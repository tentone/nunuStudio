"use strict";

//Texture constructor
function Texture(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	//If image is a URL
	if(typeof image === "string")
	{
		this.img = new Image(image);
	}
	else
	{
		this.img = image;
	}

	//Super constructor
	THREE.Texture.call(this, document.createElement("img"), mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	//Self pointer
	var self = this;

	//Name
	this.name = "texture";
	this.category = "Image";

	//Set image source
	this.image.src = this.img.data;
	this.image.onload = function()
	{
		self.needsUpdate = true;
	}
}

//Super prototypes
Texture.prototype = Object.create(THREE.Texture.prototype);

//Create JSON description
Texture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);
	var image = this.img.toJSON(meta);

	data.image = image.uuid;

	return data;
}