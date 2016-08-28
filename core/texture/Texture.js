"use strict";

//Texture constructor
function Texture(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	//Image data
	this.data = "";
	this.encoding = "";

	//If image is a URL
	if(typeof image === "string")
	{
		var url = image;
		var image = document.createElement("img");
		image.src = url;
		
		var self = this;
		image.onload = function()
		{
			self.needsUpdate = true;
		}
	}

	//Call super constructor
	THREE.Texture.call(this, image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	//Name
	this.name = "texture";
	this.category = "Image";
}

//Super prototypes
Texture.prototype = Object.create(THREE.Texture.prototype);

//Create JSON description
Texture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);

	//Serialize image data
	var image = this.image;
	if(image.uuid === undefined)
	{
		image.uuid = THREE.Math.generateUUID();
	}
	if(meta.images[image.uuid] === undefined)
	{
		meta.images[image.uuid] =
		{
			uuid: image.uuid,
			url: getDataURL(image)
		};
	}
	data.image = image.uuid;

	return data;

	//Create data url for image element
	function getDataURL(image)
	{
		var canvas, context;
		
		if(image.toDataURL !== undefined)
		{
			canvas = image;
			context = image.getContext("2d");
		}
		else
		{
			canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;

			context = canvas.getContext("2d");
			context.drawImage(image, 0, 0, image.width, image.height);
		}
		
		var transparent = false;
		var data = context.getImageData(0, 0, image.width, image.height).data;
		for(var i = 3; i < data.length; i += 4)
		{
			if(data[i] !== 255)
			{
				transparent = true;
				break;
			}
		}

		if(transparent)
		{
			return canvas.toDataURL("image/png");
		}
		else
		{
			return canvas.toDataURL("image/jpeg", 0.8);
		}
	}
}