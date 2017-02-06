"use strict";

//Audio constructor
function Audio(url)
{
	var self = this;
	this.name = "audio";
	this.uuid = THREE.Math.generateUUID();
	this.type = "Audio";

	this.format = "";
	this.encoding = ""
	this.data = null;

	if(url !== undefined)
	{
		FileSystem.readFileArrayBuffer(url,function(data){
			self.data = data;
			self.encoding = url.split(".").pop().toLowerCase();
			self.format = "arraybuffer";
		});
	}
}

//Create json description
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