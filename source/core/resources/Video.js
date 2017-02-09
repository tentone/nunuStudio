"use strict";

/**
 * Video resources are used to store video data in base64
 * @class Video
 * @constructor
 * @extends {Resource}
 * @module Resources
 * @param {String} url URL to video file
 */
function Video(url)
{
	this.name = "video";
	this.uuid = THREE.Math.generateUUID();
	this.type = "Video";

	this.format = "";
	this.encoding = ""
	this.data = null;

	if(url !== undefined)
	{
		this.encoding = url.split(".").pop().toLowerCase();
		this.data = "data:video/" + this.encoding + ";base64," + FileSystem.readFileBase64(url);
		this.format = "base64";
	}
}

/**
 * Serialize resource to json
 * Video is stores in Base64
 * @param {Object} meta
 * @return {Object} json
 */
Video.prototype.toJSON = function(meta)
{
	if(meta.videos[this.uuid] !== undefined)
	{
		return meta.videos[this.uuid];
	}

	var data = {};
	data.name = this.name;
	data.uuid = this.uuid;
	data.type = this.type;
	data.encoding = this.encoding;
	data.format = this.format;
	data.data = this.data;

	meta.videos[this.uuid] = data;

	return data;
}