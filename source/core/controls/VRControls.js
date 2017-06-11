"use strict";

/**
 * VRControl is used to get input from an HDM device and apply it to an Object.
 *
 * @class VRControls
 * @constructor
 * @module VirtualReality
 * @author mrdoob (http://mrdoob.com)
 * @author dmarcos (https://github.com/dmarcos)
 */
/**
 * VR display.
 * @property display
 * @type {Object}
 */
/**
 * Scale from real units to world units.
 * @property scale
 * @type {Number}
 */
/**
 * Standing property, is set true the user height will be added to the position of the HMD.
 * @property standing
 * @type {boolean}
 */
/**
 * User height, used to calibrate when the user is standing.
 * @property userHeight
 * @type {Number}
 */
function VRControls()
{
	this.display = null;
	this.scale = 1;
	this.standing = false;
	this.userHeight = 1.6;

	//VR Frame data
	this.frameData = null;
	if(VRFrameData !== undefined)
	{
		this.frameData = new VRFrameData();
	}

	//Position and rotation matrix
	this.position = new THREE.Vector3();
	this.quaternion = new THREE.Quaternion();

	//Get vr display devices
	if(navigator.getVRDisplays !== undefined)
	{
		var self = this;
		navigator.getVRDisplays().then(function(devices)
		{
			if(devices.length > 0)
			{
				self.display = devices[0];
			}
			else
			{
				console.warn("nunuStudio: No vr display is available.");
			}
		});
	}	
}

/**
 * Update VRControls object state.
 * 
 * @method update
 * @param {Object3D} object Object to be updated
 */
VRControls.prototype.update = function(object)
{
	if(this.display !== null)
	{
		var pose;

		if(this.display.getFrameData)
		{
			this.display.getFrameData(this.frameData);
			pose = this.frameData.pose;
		}
		else
		{
			pose = this.display.getPose();
		}

		//Orientation
		if(pose.orientation !== null)
		{
			this.quaternion.fromArray(pose.orientation);
		}

		//Position
		if(pose.position !== null)
		{
			this.position.fromArray(pose.position);
		}
		else
		{
			this.position.set(0, 0, 0);
		}

		//If standing mode enabled
		if(this.standing)
		{
			this.position.y += this.userHeight;
		}

		//Scale
		this.position.multiplyScalar(this.scale);

		if(object !== null)
		{
			object.position.copy(this.position);
			object.quaternion.copy(this.quaternion);
		}
	}
};

/**
 * Dispose object.
 * 
 * @method dispose
 */
VRControls.prototype.dispose = function()
{
	this.display = null;
};

/**
 * Reset the HDM pose.
 * 
 * @method resetPose
 */
VRControls.prototype.resetPose = function()
{
	if(this.display !== null)
	{
		this.display.resetPose();
	}
};
