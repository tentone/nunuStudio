import {Object3D, AudioListener, Audio} from "three";


/**
 * AudioEmitter is a Object3D used to play audio inside the scene.
 *
 * @author mrdoob
 * @author Reece Aaron Lecrivain
 * @param {Audio} audio Audio used by this emitter
 * @class AudioEmitter
 * @extends {Audio}
 * @module Audio
 */
function AudioEmitter(audio)
{
	Object3D.call(this);

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
	this.listener = new AudioListener();
	this.context = this.listener.context;
	this.matrixAutoUpdate = false;

	/** 
	 * WebAudio gain node, used to control the volume.
	 *
	 * https:// developer.mozilla.org/en-US/docs/Web/API/GainNode
	 *
	 * @property gain
	 * @type {GainNode}
	 */
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
	 * @type {string}
	 * @default {"empty"}
	 */
	this.sourceType = "empty";

	/**
	 * Audio source resource.
	 *
	 * @property audio
	 * @type {Audio}
	 */
	this.audio = (audio !== undefined) ? audio : null;

	/**
	 * If true the playback starts automatically.
	 *
	 * @property autoplay
	 * @default true
	 * @type {boolean}
	 */
	this.autoplay = true;

	/**
	 * Audio volume.
	 *
	 * @property volume
	 * @default 1.0
	 * @type {number}
	 */
	this.volume = 1.0;

	/**
	 * Start time in seconds.
	 *
	 * @property playbackRate
	 * @default 1.0
	 * @type {number}
	 */
	this.playbackRate = 1.0;

	/**
	 * Start time in seconds.
	 *
	 * @property startTime
	 * @default 0.0
	 * @type {number}
	 */
	this.startTime = 0.0;

	/**
	 * If true the audio plays in loop.
	 *
	 * @property loop
	 * @default true
	 * @type {boolean}
	 */
	this.loop = true;

	/**
	 * Modify pitch, measured in cents. +/- 100 is a semitone. +/- 1200 is an octave.
	 *
	 * @property detune
	 * @type {number}
	 */
	this.detune = 0;

	this.isPlaying = false;
	this.hasPlaybackControl = true;

	this.filters = [];
}

Audio = AudioEmitter;

AudioEmitter.prototype = Object.create(Object3D.prototype);

/**
 * Possible source types for the audio emitter.
 *
 * @static
 * @attribute SOURCE
 * @type {Object}
 */
AudioEmitter.SOURCE = {
	EMPTY: "empty",
	BUFFER: "buffer",
	NODE: "audioNode"
}

/**
 * Method called when the audio playback stoped.
 *
 * @method onEnded
 */
AudioEmitter.prototype.onEnded = function()
{
	this.isPlaying = false;
};

/**
 * Connect the audio source.
 *
 * Used internally on initialisation and when setting / removing
 *
 * @method connect
 */
AudioEmitter.prototype.connect = function()
{
	if(this.filters.length > 0)
	{
		this.source.connect(this.filters[0]);

		for (var i = 1, l = this.filters.length; i < l; i ++)
		{
			this.filters[i - 1].connect(this.filters[i]);
		}

		this.filters[this.filters.length - 1].connect(this.getOutput());
	}
	else
	{
		this.source.connect(this.getOutput());
	}

	return this;

};

/**
 * Disconnect the audio source.
 *
 * Used internally when setting / removing filters.
 *
 * @method disconnect
 */
AudioEmitter.prototype.disconnect = function()
{
	if(this.filters.length > 0)
	{
		this.source.disconnect(this.filters[0]);

		for (var i = 1, l = this.filters.length; i < l; i ++)
		{
			this.filters[i - 1].disconnect(this.filters[i]);
		}

		this.filters[this.filters.length - 1].disconnect(this.getOutput());
	}
	else
	{
		this.source.disconnect(this.getOutput());
	}

	return this;
};

/**
 * Initialize audio object, loads audio data decodes it and starts playback ifautoplay is set to True.
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
	else
	{
		console.warn("nunuStudio: AudioEmitter audio is null.");
	}
	
	this.setVolume(this.volume);
	this.setPlaybackRate(this.playbackRate);

	Object3D.prototype.initialize.call(this);
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

	if(this.autoplay === true)
	{
		this.play();
	}
	
	return this;
};

/**
 * Play audio.
 * 
 * @method play
 * @return {AudioEmitter} Self pointer for chaining.
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
	source.detune.value = this.detune;
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
 * @return {AudioEmitter} Self pointer for chaining.
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
 * @return {AudioEmitter} Self pointer for chaining.
 */
AudioEmitter.prototype.stop = function()
{
	this.source.stop();
	this.startTime = 0.0;
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
 * @param {number} volume
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
 * @param {number} value Audio volume
 * @return {AudioEmitter} Self pointer for chaining.
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
 * @return {AudioEmitter} Self pointer for chaining.
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
 * Set detune value.
 * 
 * @method setDetune
 * @param {number} value
 * @return {AudioEmitter} Self pointer for chaining.
 */
AudioEmitter.prototype.setDetune = function(value)
{
	this.detune = value;

	if(this.isPlaying === true)
	{
		this.source.detune.setTargetAtTime(this.detune, this.context.currentTime, 0.01);
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
 * @param {number} speed
 * @return {AudioEmitter} Self pointer for chaining.
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
 * @return {number} Playback speed.
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
 * @return {AudioEmitter} Self pointer for chaining.
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
 * @param {number} index Index of the filter.
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
 * @return {AudioEmitter} Self pointer for chaining.
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

	Object3D.prototype.dispose.call(this);
};

AudioEmitter.prototype.toJSON = function(meta)
{
	var audio = this.audio;
	var data = Object3D.prototype.toJSON.call(this, meta, function(meta, object)
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
export {AudioEmitter};