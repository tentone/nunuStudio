"use strict";

/**
 * Audio class is used to store audio data as a arraybuffer to be later used by objects with the WebAudio API.
 * 
 * @class Audio
 * @extends {Resource}
 * @constructor
 * @module Resources
 * @param {ArrayBuffer, String} url URL to Audio file or ArrayBuffer data.
 * @param {String} encoding Audio encoding (mp3, wav, etc).
 */
function Audio(url, encoding)
{
	Resource.call(this, "audio", "Audio");
	
	if(url !== undefined)
	{
		//Arraybuffer
		if(url instanceof window.ArrayBuffer)
		{
			this.data = url;
			this.encoding = (encoding !== undefined) ? encoding : "";
			this.format = "arraybuffer";
		}
		//Base64
		else if(Base64Utils.isBase64(url))
		{
			this.encoding = (encoding !== undefined) ? encoding : "";
			this.data = ArraybufferUtils.fromBase64(url);
			this.format = "arraybuffer";
		}
		//URL
		else
		{
			this.data = FileSystem.readFileArrayBuffer(url);
			this.encoding = FileSystem.getFileExtension(url);
			this.format = "arraybuffer";
		}
	}

	//Audio buffer
	this.audioBuffer = null;
}

Audio.prototype = Object.create(Resource.prototype);

/**
 * Check if a file name refers to a supported audio file.
 *
 * @method fileIsAudio
 * @static
 * @param {File} file
 * @return {boolean} True if the file refers to a supported audio format.
 */
Audio.fileIsAudio = function(file)
{
	if(file !== undefined)
	{
		if(file.type.startsWith("audio"))
		{
			return true;
		}
	}

	return false;
};

/**
 * Get an WebAudio buffer to play the audio stored in this resources.
 *
 * This method is asyncronous and the value is returned using a callback function.
 * 
 * @method getAudioBuffer
 * @param {AudioContext} context WebAudio context used to decode the audio data.
 * @param {Function} callback Callback funtion that receives an audio buffer as argument.
 */
Audio.prototype.getAudioBuffer = function(context, callback)
{
	if(this.audioBuffer === null)
	{
		var self = this;

		context.decodeAudioData(this.data, function(buffer)
		{
			self.audioBuffer = buffer;
			callback(buffer);
		},
		function(error)
		{
			console.error("nunuStudio: Cannot decode audio buffer (" + error + ")");
		});
	}
	else
	{
		callback(this.audioBuffer);
	}
};


/**
 * Serialize audio data as json.
 * 
 * Audio data is serialized in Base64.
 *
 * @method toJSON
 * @param {meta} meta
 * @return {Object} data
 */
Audio.prototype.toJSON = function(meta)
{
	var data = Resource.prototype.toJSON.call(this, meta);

	if(meta.audio[this.uuid] !== undefined)
	{
		return meta.audio[this.uuid];
	}

	data.encoding = this.encoding;
	data.data = this.data;
	data.format = this.format;

	meta.audio[this.uuid] = data;

	return data;
};
