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
	this.name = "audio";
	this.uuid = THREE.Math.generateUUID();
	this.type = "Audio";

	this.format = "";
	this.encoding = ""
	this.data = null;

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

/**
 * Serialize audio data as JSON, audio data is serialized in Base64
 * @param {meta} meta
 * @return {Object} data
 */
Audio.prototype.toJSON = function(meta)
{
	if(meta.audio[this.uuid] !== undefined)
	{
		return meta.audio[this.uuid];
	}

	var data = {};
	data.name = this.name;
	data.uuid = this.uuid;
	data.type = this.type;
	data.encoding = this.encoding;
	data.data = Base64Utils.fromArraybuffer(this.data);
	data.format = "base64";

	meta.audio[this.uuid] = data;

	return data;
}