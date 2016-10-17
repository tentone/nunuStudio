"use strict";

function Resource
{
	this.name = "";
	this.uuid = THREE.Math.generateUUID();
	this.type = "Resource";

	this.format = "";
	this.encoding = ""
	this.data = null;
}

Resource.prototype.toJSON = function(meta)
{
	var data = {};
	data.name = this.name;
	data.uuid = this.uuid;
	data.type = this.type;
	
	data.encoding = this.encoding;
}