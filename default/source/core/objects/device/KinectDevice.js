"use strict";

//Kinect device object
function KinectDevice()
{
	THREE.Object3D.call(this);

	this.type = "Kinect";
	this.name = "kinect";

	//Initialize a new web socket
	this.socket = new WebSocket("ws://127.0.0.1:8181");
	this.connected = false;

	//Configuration
	this.debug_model = true;
	this.data_timeout = 0;

	//Received Data
	this.camera = null;
	this.data = null;
	this.data_received = false;

	//Self pointer
	var self = this;

	//Connection established
	this.socket.onopen = function()
	{
		self.connected = true;
	};

	//Connection closed
	this.socket.onclose = function()
	{
		self.connected = false;
	};

	//Receive data from the server
	this.socket.onmessage = function(event)
	{
		//Point data received
		if(typeof event.data === "string")
		{
			self.data = JSON.parse(event.data);
			self.data_received = true;
			self.data_timeout = KinectDevice.DATA_TIMEOUT;
		}
		//Camera feed can be collected using URL.createObjectURL(event.data)
		else if(event.data instanceof Blob)
		{
			self.camera = event.data;
		}
	};
}

//Data timeout limit
KinectDevice.DATA_TIMEOUT = 20;

//Kinect camera modes
KinectDevice.DEPTH = 0;
KinectDevice.COLOR = 1;

//Joint names
KinectDevice.JOINTS_NAME = [["head","shouldercenter"],["shouldercenter","shoulderright"],["shouldercenter","shoulderleft"],["shoulderright","elbowright"],
							["shoulderleft","elbowleft"],["elbowright","wristright"],["elbowleft","wristleft"],["wristright","handright"],["wristleft","handleft"],
							["shouldercenter","spine"],["spine","hipcenter"],["hipcenter","hipright"],["hipcenter","hipleft"],["hipright","kneeright"],
							["hipleft","kneeleft"],["kneeright","ankleright"],["kneeleft","ankleleft"],["ankleright","footright"],["ankleleft","footleft"]];

KinectDevice.prototype = Object.create(THREE.Object3D.prototype);

//Update State
KinectDevice.prototype.update = function()
{
	//Check if there is data to process
	if(this.data !== null)
	{
		if(this.data_received)
		{
			//Clear data received flag
			this.data_received = false;

			//Remove all children
			while(this.children.length > 0)
			{
				this.children.pop();
			}

			//Show debug model
			if(this.debug_model)
			{
				var geometry = new THREE.SphereGeometry(0.04, 6, 6);
				var material = new THREE.MeshPhongMaterial(0xff0000);

				//Fill with new data
				for(var j = 0; j < this.data.skeletons.length; j++)
				{
					var joints = this.data.skeletons[j].joints;
					for(var i = 0; i < joints.length; i++)
					{
						var model = new Mesh(geometry, material);
						model.position.set(joints[i].x, joints[i].y, joints[i].z);
						model.castShadow = true;
						this.add(model);
					}
				}
			}
		}
		else if(this.data_timeout > 0)
		{
			this.data_timeout--;

			//If timeout Remove all children
			if(this.data_timeout === 0)
			{
				while(this.children.length > 0)
				{
					this.children.pop();
				}
			}
		}
	}

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Check if there is kinect connected
KinectDevice.prototype.isConnected = function()
{
	return this.connected;
}

//Set kinect camera mode
KinectDevice.prototype.setCameraMode = function(mode)
{
	if(mode === KinectDevice.COLOR)
	{
		socket.send("Color");
	}
	else if(mode === KinectDevice.DEPTH)
	{
		socket.send("Depth");
	}
}

//Create JSON for object
KinectDevice.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.debug_model = this.debug_model;

	return data;
}
