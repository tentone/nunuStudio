import {Model} from "../../resources/Model.js";
import {Audio} from "../../resources/Audio.js";
import {Scene} from "../Scene.js";
import {AudioEmitter} from "./AudioEmitter.js";
import {Vector3, Quaternion, PositionalAudio, Object3D} from "three";


/**
 * PositionalAudio is used to play audio with positional audio effect using a WebAudio panner.
 *
 * Using the positional audio object the sound is controlled by the camera that renders first in the scene.
 * 
 * @param {Audio} audio Audio used by this emitter
 * @class PositionalAudio
 * @extends {AudioEmitter}
 * @module Audio
 */
function PositionalAudio(audio)
{
	AudioEmitter.call(this, audio);

	this.type = "PositionalAudio";
	this.matrixAutoUpdate = true;

	/**
	 * Distance model to be applied to the audio panner.
	 *
	 * @property distanceModel
	 * @type {string}
	 */
	this.distanceModel = "inverse";

	/**
	 * Model to be applied to the audio panner.
	 *
	 * @property panningModel
	 * @type {string}
	 */
	this.panningModel = "HRTF";

	/**
	 * WebAudio panner effect.
	 *
	 * https:// developer.mozilla.org/en-US/docs/Web/API/PannerNode
	 * 
	 * @property panner
	 * @type {PannerNode}
	 */
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

	/**
	 * Runtime pointer to the scene to get the camera list.
	 *
	 * @attribute scene
	 * @type {Scene}
	 */
	this.scene = null;

	this.tempPosition = new Vector3();
	this.tempPositionCamera = new Vector3();
	this.tempQuaternionCamera = new Quaternion();
}

PositionalAudio = PositionalAudio;

PositionalAudio.prototype = Object.create(AudioEmitter.prototype);

/**
 * Initialize audio object, loads audio data decodes it and starts playback if autoplay is set to True.
 * 
 * @method initialize
 */
PositionalAudio.prototype.initialize = function()
{
	AudioEmitter.prototype.initialize.call(this);
	
	var node = this.parent;
	while(node !== null)
	{
		if(node instanceof Scene)
		{
			this.scene = node;
			break;
		}

		node = node.parent;
	}
};

/**
 * Update positional audio panner relative to the camera.
 * 
 * @method update
 */
PositionalAudio.prototype.update = function(delta)
{
	if(this.scene.cameras.length > 0)
	{
		var camera = this.scene.cameras[0];

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

	Object3D.prototype.update.call(this, delta);
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
 * @return {number} Reference distance.
 */
PositionalAudio.prototype.getRefDistance = function()
{
	return this.panner.refDistance;
};

/**
 * Set reference distance.
 * 
 * @method setRefDistance
 * @param {number} value Reference distance.
 */
PositionalAudio.prototype.setRefDistance = function(value)
{
	this.panner.refDistance = value;
};

/**
 * Get rolloff factor.
 * 
 * @method getRolloffFactor
 * @return {number} Rolloff factor.
 */
PositionalAudio.prototype.getRolloffFactor = function()
{
	return this.panner.rolloffFactor;
};

/**
 * Set rolloff factor.
 * 
 * @method setRolloffFactor
 * @param {number} value Rolloff factor.
 */
PositionalAudio.prototype.setRolloffFactor = function(value)
{
	this.panner.rolloffFactor = value;
};


/**
 * Get distance model in use by this audio emitter.
 *
 * @method getDistanceModel
 * @return {string} Distance model.
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
 * @param {string} model Distance Model to be used.
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
 * @param {number} value Maximum distance.
 */
PositionalAudio.prototype.setMaxDistance = function(value)
{
	this.panner.maxDistance = value;
};

PositionalAudio.prototype.toJSON = function(meta)
{
	var data = AudioEmitter.prototype.toJSON.call(this, meta);

	data.object.distanceModel = this.distanceModel;
	data.object.panningModel = this.panningModel;

	return data;
};
export {PositionalAudio};