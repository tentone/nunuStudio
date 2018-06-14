"use strict";

/**
 * AudioEmitter is a Object3D used to play audio inside the scene.
 *
 * @author mrdoob
 * @author Reece Aaron Lecrivain
 * @param {Audio} audio Audio used by this emitter
 * @class AudioEmitter
 * @extends {Audio}
 * @module Audio
 * @constructor
 */
function AudioEmitter(audio)
{
	THREE.Object3D.call(this);

	this.name = "audio";
	this.type = "Audio";

	/**
	 * AudioListener used by this emmiter.
	 *
	 * Every AudioEmitter has a different WebAudio AudioListener.
	 * 
	 * @property listener
	 * @type {AudioListener}
	 */
	this.listener = new THREE.AudioListener();
	this.context = this.listener.context;
	this.matrixAutoUpdate = false;

	this.gain = this.context.createGain();
	this.gain.connect(this.listener.getInput());

	this.buffer = null;
	
	this.filters = [];

	/**
	 * Audio source type, can have the following values:
	 *  - empty
	 *  - buffer
	 *  - audioNode
	 *
	 * @property sourceType
	 * @type {String}
	 * @default {"empty"}
	 */
	this.sourceType = "empty";
	this.audio = (audio !== undefined) ? audio : null;

	/**
	 * If true the playback starts automatically.
	 * @property autoplay
	 * @default true
	 * @type {boolean}
	 */
	this.autoplay = true;

	/**
	 * Audio volume.
	 * @property volume
	 * @default 1.0
	 * @type {Number}
	 */
	this.volume = 1.0;

	/**
	 * Start time in seconds.
	 * @property playbackRate
	 * @default 1.0
	 * @type {Number}
	 */
	this.playbackRate = 1.0;

	/**
	 * Start time in seconds.
	 * @property startTime
	 * @default 0.0
	 * @type {Number}
	 */
	this.startTime = 0;

	/**
	 * If true the audio plays in loop.
	 * @property loop
	 * @default true
	 * @type {boolean}
	 */
	this.loop = true;

	this.disposed = false;
	this.isPlaying = false;
	this.hasPlaybackControl = true;
}

THREE._Audio = THREE.Audio;
THREE.Audio = AudioEmitter;

AudioEmitter.prototype = Object.create(THREE._Audio.prototype);

/**
 * Initialize audio object, loads audio data decodes it and starts playback if autoplay is set to True.
 * 
 * @method initialize
 */
AudioEmitter.prototype.initialize = function()
{
	if(this.audio !== null)
	{
		var self = this;

		this.audio.getAudioBuffer(this.context, function(buffer)
		{
			self.setBuffer(buffer);
		});
	}

	this.setVolume(this.volume);
	this.setPlaybackRate(this.playbackRate);

	THREE.Object3D.prototype.initialize.call(this);
};

/**
 * Set audio buffer to be used by this emitter.
 *
 * @method setBuffer
 * @param {AudioBuffer} audioBuffer Audio buffer to be used.
 * @return {AudioEmitter} Self pointer for chaining.
 */
AudioEmitter.prototype.setBuffer = function(audioBuffer)
{
	this.buffer = audioBuffer;
	this.sourceType = "buffer";

	if(this.autoplay && !this.disposed)
	{
		this.play();
	}
	
	return this;
};

/**
 * Play audio.
 * 
 * @method play
 * @return {AudioEmitter} Self pointer for chaining
 */
AudioEmitter.prototype.play = function()
{
	if(this.buffer === null)
	{
		console.warn("nunuStudio: Audio buffer not ready, audio will not play.");
		return;
	}

	if(this.isPlaying)
	{
		console.warn("nunuStudio: Audio is already playing, its only possible to control the last playing instance.");
	}

	var source = this.context.createBufferSource();
	source.buffer = this.buffer;
	source.loop = this.loop;
	source.onended = this.onEnded.bind(this);
	source.playbackRate.setValueAtTime(this.playbackRate, this.startTime);
	source.start(0, this.startTime);

	this.isPlaying = true;
	this.source = source;

	return this.connect();
};

/**
 * Pauses audio playback.
 * 
 * @method pause
 * @return {AudioEmitter} Self pointer for chaining
 */
AudioEmitter.prototype.pause = function()
{
	this.source.stop();
	this.startTime = this.context.currentTime;
	this.isPlaying = false;

	return this;
};

/**
 * Stops audio playback and resets time to 0.
 * 
 * @method pause
 * @return {AudioEmitter} Self pointer for chaining
 */
AudioEmitter.prototype.stop = function()
{
	this.source.stop();
	this.startTime = 0;
	this.isPlaying = false;

	return this;
};

/**
 * Change audio resource.
 * 
 * If changed after initialization the audio buffer will be disconnected and reintialized.
 *
 * @method setAudio
 * @param {Audio} audio Audio resource.
 */
AudioEmitter.prototype.setAudio = function(audio)
{
	this.audio = audio;

	if(this.buffer !== null)
	{
		if(this.isPlaying)
		{
			this.stop();
		}
		this.disconnect();
	}

	var self = this;

	this.audio.getAudioBuffer(this.context, function(buffer)
	{
		self.setBuffer(buffer);
	});
};

/**
 * Get audio emitter volume.
 * 
 * @param {Number} volume
 * @method getVolume
 */
AudioEmitter.prototype.getVolume = function()
{
	return this.gain.gain.value;
};

/**
 * Set audio emitter volume.
 * 
 * @method setVolume
 * @param {Number} value Audio volume
 * @return {AudioEmitter} Self pointer for chaining
 */
AudioEmitter.prototype.setVolume = function(value)
{
	this.volume = value;
	this.gain.gain.value = value;

	return this;
};

/**
 * Set loop mode. If loop set to True the audio repeats after ending.
 * 
 * @method setLoop
 * @param {boolean} loop
 * @return {AudioEmitter} Self pointer for chaining
 */
AudioEmitter.prototype.setLoop = function(loop)
{
	this.loop = loop;

	if(this.isPlaying)
	{
		this.source.loop = this.loop;
	}

	return this;
};

/**
 * Get loop mode.
 *
 * @method getLoop
 * @return {boolean} Loop mode.
 */
AudioEmitter.prototype.getLoop = function()
{
	return this.loop;
};

/**
 * Set playback speed.
 * 
 * @method setPlaybackRate
 * @param {Number} speed
 * @return {AudioEmitter} Self pointer for chaining
 */
AudioEmitter.prototype.setPlaybackRate = function (speed)
{
	this.playbackRate = speed;

	if(this.isPlaying)
	{
		this.source.playbackRate.setValueAtTime(this.playbackRate, this.context.currentTime);
	}

	return this;
};

/**
 * Get the playback speed.
 *
 * @method getPlaybackRate
 * @return {Number} Playback speed.
 */
AudioEmitter.prototype.getPlaybackRate = function()
{
	return this.playbackRate;
};

/**
 * Get Array with all the filters applied to this audio emitter.
 *
 * @method getFilters
 * @return {Array} Filters in this audio emitter.
 */
AudioEmitter.prototype.getFilters = function()
{
	return this.filters;
};

/**
 * Set the entire filters array.
 * 
 * @method setFilters
 * @param {Array} value
 * @return {AudioEmitter} Self pointer for chaining
 */
AudioEmitter.prototype.setFilters = function(value)
{
	if(!value)
	{
		value = [];
	}

	if(this.isPlaying)
	{
		this.disconnect();
		this.filters = value;
		this.connect();
	}
	else
	{
		this.filters = value;
	}

	return this;
};

/**
 * Get a filter to the filters array.
 * 
 * @method getFilter
 * @param {Number} index Index of the filter.
 * @return Filter.
 */
AudioEmitter.prototype.getFilter = function(index)
{
	return this.getFilters()[index !== undefined ? index : 0];
};

/**
 * Set a filter to the filters array.
 * 
 * @method setFilter
 * @param {Object} filter
 */
AudioEmitter.prototype.setFilter = function(filter)
{
	return this.setFilters(filter ? [filter] : []);
};

/**
 * Change the source audio node.
 * 
 * @method setNodeSource
 * @param {Object} node
 * @return {AudioEmitter} Self pointer for chaining
 */
AudioEmitter.prototype.setNodeSource = function(node)
{
	this.hasPlaybackControl = false;
	this.sourceType = "audioNode";
	
	this.source = node;
	this.connect();

	return this;
};

/**
 * Get output audio node.
 * 
 * @method getOutput
 * @return {Object} Output audio node.
 */
AudioEmitter.prototype.getOutput = function()
{
	return this.gain;
};

/**
 * Dispose audio object, stops the playback and disconnects audio node.
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

	this.disposed = true;

	THREE.Object3D.prototype.dispose.call(this);
};

/**
 * Serialize object to JSON.
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
};
