"use strict";

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
		this.data = FileSystem.readFileArrayBuffer(url);
		this.encoding = url.split(".").pop().toLowerCase();
		this.format = "arraybuffer";
	}
}

//JSON serialization
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