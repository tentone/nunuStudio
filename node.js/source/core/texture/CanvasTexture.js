"use strict";

function CanvasTexture(width, height, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	THREE.Texture.call(this, document.createElement("canvas"), mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	this.name = "canvas";
	this.category = "Canvas";

	this.width = (width !== undefined) ? width : 512;
	this.height = (height !== undefined) ? height : 512;

	//Canvas size
	this.image.width = width;
	this.image.height = height;

	//2D drawing conxtext
	this.context = this.image.getContext("2d");
	this.context.font = "Normal 55px Arial";
	this.context.textAlign = "center";
	this.context.fillStyle = "#FF0000";
	this.context.fillText("Canvas Texture", this.width/2, this.height/2);

	this.needsUpdate = true;
}

CanvasTexture.prototype = Object.create(THREE.Texture.prototype);

//Create JSON description
CanvasTexture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);

	data.width = this.width;
	data.height = this.height;

	return data;
}