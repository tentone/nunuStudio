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

	var texture = this;
	this.disposed = false;

	//Name
	this.name = "texture";
	this.category = "Image";

	//Set image source
	this.image.src = this.img.data;
	this.image.onload = function()
	{
		texture.needsUpdate = true;
	}

	//Check if image is animated
	if(this.img.encoding === "gif")
	{
		function update()
		{
			if(!texture.disposed)
			{
				texture.needsUpdate = true;
				requestAnimationFrame(update);
			}
		};
		update();
	}
}

//Super prototypes
Texture.prototype = Object.create(THREE.Texture.prototype);

//Dispose texture
Texture.prototype.dispose = function()
{	
	THREE.Texture.prototype.dispose.call(this);

	this.disposed = true;
}

//Create JSON description
Texture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);
	var image = this.img.toJSON(meta);

	data.image = image.uuid;

	return data;
}