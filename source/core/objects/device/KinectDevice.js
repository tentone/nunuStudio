"use strict";

/**
 * Kinect device object.
 * 
 * This object is used to connect nunuStudio to a Microsoft Kinect V1, it only works in Microsoft Windows.
 * 
 * The operation of the kinect object depends on a server program used to connect to kinect that sends the data to nunuStudio via WebSocket.
 * 
 * The server software is available inside the tools folder in the nunuStudio repository, and communicates using the port 8181 in the localhost.
 * 
 * @class KinectDevice
 * @extends {Object3D}
 * @constructor
 * @module Devices
 */

/**
 * Websocket object used to connect to the data server.
 * 
 * @property socket
 * @default 127.0.0.1:8181
 * @type {Object}
 */
/**
 * Connected flag.
 * 
 * @property connected
 * @type {boolean}
 */
/**
 * Debug model flag.
 * 
 * @property debugModel
 * @default true
 * @type {boolean}
 */
/**
 * Time until data is considered too obsolete to be usable.
 * 
 * @property dataTimeout
 * @type {Number}
 */
/**
 * Image data sent by the kinnect camera.
 * 
 * @property camera
 * @type {Blob}
 */
/**
 * Skeleton data sent by the kinnect.
 * 
 * @property data
 * @type {Object}
 */
function KinectDevice()
{
	THREE.Object3D.call(this);

	this.type = "Kinect";
	this.name = "kinect";

	//Initialize a new web socket
	this.socket = new WebSocket("ws://127.0.0.1:8181");
	this.connected = false;

	//Configuration
	this.debugModel = true;
	this.dataTimeout = 0;

	//Received Data
	this.camera = null;
	this.data = null;
	this.dataReceived = false;

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
			self.dataReceived = true;
			self.dataTimeout = KinectDevice.DATA_TIMEOUT;
		}
		//Camera feed can be collected using URL.createObjectURL(event.data)
		else if(event.data instanceof Blob)
		{
			self.camera = event.data;
		}
	};
}

/**
 * Kinect default data timeout in seconds.
 * 
 * @attribute DATA_TIMEOUT
 * @type {Number}
 */
KinectDevice.DATA_TIMEOUT = 20;


/**
 * Kinect camera depth mode.
 * 
 * @attribute DEPTH
 * @type {Number}
 */
KinectDevice.DEPTH = 0;

/**
 * Kinect camera color mode.
 * 
 * @attribute COLOR
 * @type {Number}
 */
KinectDevice.COLOR = 1;

/**
 * Kinect skeleton joint names in pairs.
 * 
 * @attribute JOINTS_NAME
 * @type {Array}
 */
KinectDevice.JOINTS_NAME = [["head","shouldercenter"],["shouldercenter","shoulderright"],["shouldercenter","shoulderleft"],["shoulderright","elbowright"],
							["shoulderleft","elbowleft"],["elbowright","wristright"],["elbowleft","wristleft"],["wristright","handright"],["wristleft","handleft"],
							["shouldercenter","spine"],["spine","hipcenter"],["hipcenter","hipright"],["hipcenter","hipleft"],["hipright","kneeright"],
							["hipleft","kneeleft"],["kneeright","ankleright"],["kneeleft","ankleleft"],["ankleright","footright"],["ankleleft","footleft"]];

KinectDevice.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Update kinect device state.
 * 
 * @method update
 */
KinectDevice.prototype.update = function()
{
	//Check if there is data to process
	if(this.data !== null)
	{
		if(this.dataReceived)
		{
			//Clear data received flag
			this.dataReceived = false;

			//Remove all children
			while(this.children.length > 0)
			{
				this.children.pop();
			}

			//Show debug model
			if(this.debugModel)
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
		else if(this.dataTimeout > 0)
		{
			this.dataTimeout--;

			//If timeout Remove all children
			if(this.dataTimeout === 0)
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
};

/**
 * Check if there is kinect connected.
 * 
 * @method isConnected
 * @return {boolean} True if there is a kinect connected
 */
KinectDevice.prototype.isConnected = function()
{
	return this.connected;
};

/**
 * Set kinect camera mode.
 * 
 * @method setCameraMode
 * @param {boolean} mode Camera mode
 */
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
};

/**
 * Create JSON for object.
 * 
 * @method toJSON
 */
KinectDevice.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.debugModel = this.debugModel;

	return data;
};
