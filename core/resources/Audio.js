"use strict";

//Audio constructor
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
		var file = new XMLHttpRequest();
		file.open("GET", url, false);
		file.overrideMimeType("text/plain; charset=x-user-defined");
		file.send(null);

		//this.encoding = url.split(".").pop();
		//this.data = App.readFileArrayBuffer(url);
		this.encoding = url.split(".").pop();
		this.format = "arraybuffer";
		this.data = arrayBufferBinaryString(file.response);
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
	data.data = base64ArrayBuffer(this.data);
	data.format = "base64";

	meta.audio[this.uuid] = data;

	return data;
}