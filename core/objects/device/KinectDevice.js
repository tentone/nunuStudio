function KinectDevice()
{
	THREE.Object3D.call(this);

	this.type = "Kinect";
	this.name = "kinect";

	//Initialize a new web socket
	this.socket = new WebSocket("ws://127.0.0.1:8181");
	this.connected = false;

	//Received Data
	this.data = null;

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
		if(typeof event.data === "string")
		{
			self.data = JSON.parse(event.data);
		}
		else if(event.data instanceof Blob)
		{
			var data = event.data;
			//TOTO <STORE CAMERA FEED>
		}
	};
}

KinectDevice.DEPTH = 0;
KinectDevice.COLOR = 1;
KinectDevice.JOINTS_NAME = [["head","shouldercenter"],["shouldercenter","shoulderright"],["shouldercenter","shoulderleft"],["shoulderright","elbowright"],
							["shoulderleft","elbowleft"],["elbowright","wristright"],["elbowleft","wristleft"],["wristright","handright"],["wristleft","handleft"],
							["shouldercenter","spine"],["spine","hipcenter"],["hipcenter","hipright"],["hipcenter","hipleft"],["hipright","kneeright"],
							["hipleft","kneeleft"],["kneeright","ankleright"],["kneeleft","ankleleft"],["ankleright","footright"],["ankleleft","footleft"]];

//Function Prototype
KinectDevice.prototype = Object.create(THREE.Object3D.prototype);
KinectDevice.prototype.icon = "editor/files/icons/hw/kinect.png";

//Runtime functions
KinectDevice.prototype.initialize = initialize;
KinectDevice.prototype.update = update;
KinectDevice.prototype.isConnected = isConnected;
KinectDevice.prototype.setCameraMode = setCameraMode;

//Initialize
function initialize()
{
	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].initialize != undefined)
		{
			this.children[i].initialize();
		}
	}
}

//Update State
function update()
{
	//Check if there is data to process
	if(this.data !== null)
	{
		//Remove all children
		while(this.children.length > 0)
		{
			this.children.pop();
			//remove(this.children[0]);
		}

		//Fill with new data
		if(this.data.skeletons.length > 0)
		{
			var joints = this.data.skeletons[0].joints;

			//Add children
			for(var j = 0; j < KinectDevice.JOINTS_NAME.length; j++)
			{	
				var ori = 0, end = 0;

				for(var k = 0; k < joints.length; k++)
				{
					if(joints[k].name === KinectDevice.JOINTS_NAME[j][0])
					{
						ori = k;
					}
					else if(joints[k].name === KinectDevice.JOINTS_NAME[j][1])
					{
						end = k;
					}
				}

				this.add(ObjectUtils.createCylinderBetweenPoints
				(
					new THREE.Vector3(joints[ori].x, joints[ori].y, joints[ori].z), 
					new THREE.Vector3(joints[end].x, joints[end].y, joints[end].z)
				));
			}
		}
	}
}

//Check if there is kinect connected
function isConnected()
{
	return this.connected;
}

//Set kinect camera mode
function setCameraMode(mode)
{
	if(mode === KinectDevice.COLOR)
	{
		socket.send("Color");
	}
	else if(mode === KinectDevice.COLOR)
	{
		socket.send("Depth");
	}
}
