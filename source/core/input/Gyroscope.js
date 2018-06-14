"use strict";

/**
 * Gyroscope object can be used to get the orientation from the device.
 *
 * @class Gyroscope
 * @module Input
 * @constructor
 */
function Gyroscope()
{
	/**
	 * Alpha rotation.
	 * @property alpha
	 * @type {Number}
	 */
	this.alpha = 0;
	
	/**
	 * Beta rotation.
	 * @property beta
	 * @type {Number}
	 */
	this.beta = 0;

	/**
	 * Gamma rotation.
	 * @property gamma
	 * @type {Number}
	 */
	this.gamma = 0;

	/**
	 * Device orientation.
	 * @property orientation
	 * @type {Number}
	 */
	this.orientation = 0;

	this.events = new EventManager();

	var self = this;

	//Orientation
	this.events.add(window, "orientationchange", function(event)
	{
		self.orientation = THREE.Math.degToRad(window.orientation);
	});

	//Device orientation
	this.events.add(window, "deviceorientation", function(event)
	{
		self.alpha = THREE.Math.degToRad(event.alpha);
		self.beta = THREE.Math.degToRad(event.beta);
		self.gamma = THREE.Math.degToRad(event.gamma);
	});

	//Initialize events
	this.events.create();
}

/**
 * Sets a object rotation to match the device orientation.
 * 
 * The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type ZXY
 *
 * @method setObjectQuaternion
 * @param {Object3D} object Object to oriented.
 */
Gyroscope.prototype.setObjectQuaternion = function()
{
	var euler = new THREE.Euler();
	var quaternion = new THREE.Quaternion();
	var zee = new THREE.Vector3(0, 0, 1);
	var offset = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); //-PI/2 around the x-axis

	return function(object)
	{
		euler.set(this.beta, this.alpha, -this.gamma, "YXZ"); //"ZXY" for the device, but "YXZ" for us
		object.quaternion.setFromEuler(euler); //Orient the device
		object.quaternion.multiply(offset); //Camera looks out the back of the device, not the top
		object.quaternion.multiply(quaternion.setFromAxisAngle(zee, -this.orientation)); //Adjust for screen orientation
	};
}();

/**
 * Dispose the gyroscope controller.
 *
 * Cleans all events created by this controller.
 * 
 * @method dispose
 */
Gyroscope.prototype.dispose = function()
{
	this.events.destroy();
};
