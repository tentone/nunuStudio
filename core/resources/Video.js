"use strict";

//Video constructor
function Video(url)
{
	this.name = "video";
	this.uuid = THREE.Math.generateUUID();
	this.type = "Video";

	this.encoding = "";
	this.data = null;

	if(url !== undefined)
	{
		var file = new XMLHttpRequest();
		file.open("GET", url, false);
		file.overrideMimeType("text/plain; charset=x-user-defined");
		file.send(null);

		this.encoding = url.split(".").pop();
		this.data = base64BinaryString(file.response);
	}
}

//Create json description
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
	data.data = this.data;

	meta.videos[this.uuid] = data;

	return data;
}