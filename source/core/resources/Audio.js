"use strict";

/**
 * Audio class is used to store audio data as a arraybuffer to be later used by objects with the WebAudio API.
 * 
 * @class Audio
 * @extends {Resource}
 * @constructor
 * @module Resources
 * @param {String} url URL to Audio file
 */
function Audio(url)
{
	Resource.call(this, "audio", "Audio");

	if(url !== undefined)
	{
		//Arraybuffer data
		if(url instanceof window.ArrayBuffer)
		{
			this.data = url;
			this.encoding = "";
			this.format = "arraybuffer";
		}
		//URL
		else
		{
			this.data = FileSystem.readFileArrayBuffer(url);
			this.encoding = url.split(".").pop().toLowerCase();
			this.format = "arraybuffer";
		}
	}
}

Audio.prototype = Object.create(Resource.prototype);

/**
 * Check if a file name refers to a supported audio file.
 *
 * @method fileIsAudio
 * @static
 * @param {String} file
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
	data.data = Base64Utils.fromArraybuffer(this.data);
	data.format = "base64";

	meta.audio[this.uuid] = data;

	return data;
};
