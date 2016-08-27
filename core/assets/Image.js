"use strict";

function Image()
{
	this.name = "image";
	this.uuid = THREE.Math.generateUUID();

	this.enconding = "";
	this.data = null;
}

//Create json description
Image.prototype.toJSON = function(meta)
{
	//TODO <ADD CODE HERE>
}