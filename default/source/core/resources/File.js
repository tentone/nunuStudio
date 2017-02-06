"use strict";

function File
{
	this.name = "file";
	this.uuid = THREE.Math.generateUUID();
	this.type = "File";

	this.format = "";
	this.encoding = ""
	this.data = null;
}

File.prototype.toJSON = function(meta)
{
	var data = {};
	data.name = this.name;
	data.uuid = this.uuid;
	data.type = this.type;
	
	data.encoding = this.encoding;
}