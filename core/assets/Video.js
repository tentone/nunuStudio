"use strict";

//Video constructor
function Video(video)
{
	this.name = "video";
	this.uuid = THREE.Math.generateUUID();
	this.type = "Video";

	this.encoding = "";
	this.data = "";

	if(video !== undefined)
	{
		this.encoding = video.split(".").pop();
		this.data = base64ArrayBuffer(App.readFileArrayBuffer(video));
	}
}

//Create json description
Video.prototype.toJSON = function(meta)
{
	var data = {};

	data.name = this.name;
	data.uuid = this.uuid;
	data.type = this.type;

	data.encoding = this.encoding;
	data.data = this.data;

	return data;
}