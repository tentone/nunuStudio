"use strict";

/**
 * AudioEmitter is a Object3D used to play audio inside the scene.
 * 
 * @param {Audio} audio Audio used by this emitter
 * @class AudioEmitter
 * @extends {Audio}
 * @module Audio
 * @constructor
 */
/**
 * Audio volume
 * @property volume
 * @default 1.0
 * @type {Number}
*/
/**
 * If true the playback starts automatically
 * @property autoplay
 * @default true
 * @type {boolean}
*/
/**
 * Start time in seconds
 * @property playbackRate
 * @default 1.0
 * @type {Number}
*/
/**
 * Start time in seconds
 * @property startTime
 * @default 0.0
 * @type {Number}
*/
/**
 * If true the audio plays in loop
 * @property loop
 * @default true
 * @type {boolean}
*/
function AudioEmitter(audio)
{
	THREE.Audio.call(this, AudioEmitter.listener);

	this.name = "audio";
	this.type = "Audio";

	this.matrixAutoUpdate = false;

	this.audio = (audio !== undefined) ? audio : null;

	this.volume = 1.0;

	this.autoplay = true;
	this.playbackRate = 1.0;
	this.startTime = 0;
	this.loop = true;

	this.isPlaying = false;
	this.hasPlaybackControl = true;
}

//Default audio listener
AudioEmitter.listener = new THREE.AudioListener();

//Super prototypes
AudioEmitter.prototype = Object.create(THREE.Audio.prototype);

/**
 * Initialize audio object, loads audio data decodes it and starts playback if autoplay is set to True.
 * 
 * Called by the runtime.
 * 
 * @method initialize
 */
AudioEmitter.prototype.initialize = function()
{
	var self = this;

	if(this.audio !== null)
	{
		THREE.AudioContext.getContext().decodeAudioData(this.audio.data, function(buffer)
		{
			self.setBuffer(buffer);
		});
	}

	this.setVolume(this.volume);
	this.setPlaybackRate(this.playbackRate);

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

/**
 * Dispose audio object.
 * 
 * @method dispose
 */
AudioEmitter.prototype.dispose = function()
{
	if(this.isPlaying)
	{
		this.stop();
		this.disconnect();
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}

/**
 * Change audio emitter volume.
 * 
 * @method setVolume
 * @param {Number} value Audio volume
 */
AudioEmitter.prototype.setVolume = function(value)
{
	this.volume = value;
	this.gain.gain.value = value;

	return this;
}

/**
 * Create JSON description.
 * 
 * @method toJSON
 * @param {Object} meta
 * @return {Object} JSON descrition
 */
AudioEmitter.prototype.toJSON = function(meta)
{
	var audio = this.audio;
	var data = THREE.Object3D.prototype.toJSON.call(this, meta, function(meta, object)
	{
		audio = audio.toJSON(meta);
	});

	data.object.audio = audio.uuid;	
	data.object.volume = this.volume;
	data.object.autoplay = this.autoplay;
	data.object.startTime = this.startTime;
	data.object.playbackRate = this.playbackRate;
	data.object.loop = this.loop;

	return data;
}

/**
 * Starts playback
 * @method play
 */

/**
 * Pauses playback
 * @method pause
 */

/**
 * Stops playback and resets time to 0
 * @method pause
 */

/**
 * Set loop mode
 * @param {boolean} loop
 * @method setLoop
 */

/**
 * Set playback speed
 * @param {Number} speed
 * @method setPlaybackRate
 */

/**
 * Add the filter to the filters array.
 * @method setFilter
 * @param {Object} filter
 */

/**
 * Set the filters array to value.
 * @method setFilters
 * @param {Array} value
 */
