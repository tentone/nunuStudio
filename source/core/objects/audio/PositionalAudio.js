"use strict";

/**
 * PositionalAudio is used to play audio with positional audio effect using a WebAudio panner.
 *
 * Using the positional audio object the sound is controlled by the camera that renders first in the scene.
 *
 * @param {Audio} audio Audio used by this emitter
 * @class PositionalAudio
 * @extends {AudioEmitter}
 * @module Audio
 * @constructor
 */
function PositionalAudio(audio)
{
	AudioEmitter.call(this, audio);

	this.type = "PositionalAudio";
	this.matrixAutoUpdate = true;

	//Attributes
	this.distanceModel = "inverse";
	this.panningModel = "HRTF";

	//Create panner
	this.panner = this.context.createPanner();
	this.panner.connect(this.gain);
	this.panner.panningModel = this.panningModel;
	this.panner.distanceModel = this.distanceModel;
	this.panner.refDistance = 1;
	this.panner.maxDistance = 10000;
	this.panner.rolloffFactor = 1;
	this.panner.coneInnerAngle = 360;
	this.panner.coneOuterAngle = 0;
	this.panner.coneOuterGain = 0;

	//Runtime variables
	this.cameras = null;
	this.tempPosition = new THREE.Vector3();
	this.tempPositionCamera = new THREE.Vector3();
	this.tempQuaternionCamera = new THREE.Quaternion();
}

THREE._PositionalAudio = THREE.PositionalAudio;
THREE.PositionalAudio = PositionalAudio;

PositionalAudio.prototype = Object.create(AudioEmitter.prototype);

/**
 * Initialize audio object, loads audio data decodes it and starts playback if autoplay is set to True.
 * 
 * @method initialize
 */
PositionalAudio.prototype.initialize = function()
{
	AudioEmitter.prototype.initialize.call(this);
	
	var node = this;
	while(node.parent !== null)
	{
		node = node.parent;
		if(node instanceof Scene)
		{
			this.cameras = node.cameras;
		}
	}
};

/**
 * Update positional audio panner relative to the camera.
 * 
 * @method update
 */
PositionalAudio.prototype.update = function(delta)
{
	if(this.cameras.length > 0)
	{
		var camera = this.cameras[0];

		this.getWorldPosition(this.tempPosition);
		camera.getWorldPosition(this.tempPositionCamera);
		camera.getWorldQuaternion(this.tempQuaternionCamera);

		this.tempPosition.sub(this.tempPositionCamera);
		this.tempPosition.z = -this.tempPosition.z;
		
		this.tempPosition.applyQuaternion(this.tempQuaternionCamera);
		this.panner.setPosition(this.tempPosition.x, this.tempPosition.z, this.tempPosition.y);
	}
	else
	{
		this.panner.setPosition(0, 0, 0);
		this.panner.setOrientation(0, 0, 0);
	}

	THREE.Object3D.prototype.update.call(this, delta);
};

/**
 * Get output audio node.
 * 
 * @method getOutput
 * @return {Object} Output audio node.
 */
PositionalAudio.prototype.getOutput = function()
{
	return this.panner;
};

/**
 * Get reference distance.
 * 
 * @method getRefDistance
 * @return {Number} Reference distance.
 */
PositionalAudio.prototype.getRefDistance = function()
{
	return this.panner.refDistance;
};

/**
 * Set reference distance.
 * 
 * @method setRefDistance
 * @param {Number} value Reference distance.
 */
PositionalAudio.prototype.setRefDistance = function(value)
{
	this.panner.refDistance = value;
};

/**
 * Get rolloff factor.
 * 
 * @method getRolloffFactor
 * @return {Number} Rolloff factor.
 */
PositionalAudio.prototype.getRolloffFactor = function()
{
	return this.panner.rolloffFactor;
};

/**
 * Set rolloff factor.
 * 
 * @method setRolloffFactor
 * @param {Number} value Rolloff factor.
 */
PositionalAudio.prototype.setRolloffFactor = function(value)
{
	this.panner.rolloffFactor = value;
};


/**
 * Get distance model in use by this audio emitter.
 *
 * @method getDistanceModel
 * @return {String} Distance model.
 */
PositionalAudio.prototype.getDistanceModel = function()
{
	return this.panner.distanceModel;
};

/**
 * Set distance model to be used.
 *
 * Distance model defined how the emitter controls its volume from its position in the world, relative to the camera.
 *
 * By default the mode used is "inverse", can be also set to:
 *  - "linear": A linear distance model calculating the gain induced by the distance according to
 *    - 1 - rolloffFactor * (distance - refDistance) / (maxDistance - refDistance)
 *  - "inverse": An inverse distance model calculating the gain induced by the distance according to:
 *    - refDistance / (refDistance + rolloffFactor * (distance - refDistance))
 *  - "exponential": An exponential distance model calculating the gain induced by the distance according to:
 *    - pow(distance / refDistance, -rolloffFactor).
 * 
 * @method setDistanceModel
 * @param {String} model Distance Model to be used.
 */
PositionalAudio.prototype.setDistanceModel = function(distanceModel)
{
	this.panner.distanceModel = distanceModel;
};

/**
 * Get maximum distance for this audio emitter.
 *
 * @method getMaxDistance
 * @return Maximum distance.
 */
PositionalAudio.prototype.getMaxDistance = function()
{
	return this.panner.maxDistance;
};

/**
 * Set maximum distance for this audio emitter.
 *
 * @method setMaxDistance
 * @param {Number} value Maximum distance.
 */
PositionalAudio.prototype.setMaxDistance = function(value)
{
	this.panner.maxDistance = value;
};

/**
 * Serialize object to JSON.
 * 
 * @method toJSON
 * @param  {Object} meta
 * @return {Object} JSON descrition
 */
PositionalAudio.prototype.toJSON = function(meta)
{
	var data = AudioEmitter.prototype.toJSON.call(this, meta);

	//data.object.distanceModel = distanceModel;
	//data.object.panningModel = panningModel;

	return data;
};
