"use strict";

function Image()
{
	this.name = "image";
	this.uuid = THREE.Math.generateUUID();
	
	this.enconding = Image.PNG;
	this.data = null;
}

//Image enconding
Image.PNG = 0;
Image.JPEG = 1;
Image.TGA = 2;

//Create json description
Image.prototype.toJSON = function()
{
	//TODO <ADD CODE HERE>
}