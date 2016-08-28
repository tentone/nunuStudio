"use strict";

//Audio constructor
function Audio()
{
	this.name = "audio";
	this.uuid = THREE.Math.generateUUID();
	this.type = "Audio";

	this.encoding = "";
	this.data = null;
}

//Create json description
Audio.prototype.toJSON = function(meta)
{
	var data = {};

	data.name = this.name;
	data.uuid = this.uuid;
	data.type = this.type;
	data.encoding = this.encoding;
	data.data = this.data;

	return data;
}