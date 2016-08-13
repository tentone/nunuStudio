"use strict";

//Texture constructor
function Texture(url)
{
	//Create image element
	this.img = document.createElement("img");
	this.img.src = url;

	//Create Texture part of object
	THREE.Texture.call(this, this.img);

	//Update texture content
	this.needsUpdate = true;
}

//Functions prototype
Texture.prototype = Object.create(THREE.Texture.prototype);
Texture.prototype.update = update;
Texture.prototype.toJSON = toJSON;

//Update texture
function update(){}

//Create JSON description
function toJSON(meta)
{
	if(meta.textures[this.uuid] !== undefined)
	{
		return meta.textures[this.uuid];
	}

	function getDataURL(image)
	{
		var canvas, context;
		

		if(image.toDataURL !== undefined)
		{
			canvas = image;
			context = canvas.getContext("2d");
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
		for(var i = 0; i < data.length; i += 4)
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

	var output =
	{
		metadata:
		{
			version: 1.0,
			type: "NunuTexture"
		},

		uuid: this.uuid,
		name: this.name,

		mapping: this.mapping,

		repeat: [this.repeat.x, this.repeat.y],
		offset: [this.offset.x, this.offset.y],
		wrap: [this.wrapS, this.wrapT],

		minFilter: this.minFilter,
		magFilter: this.magFilter,
		anisotropy: this.anisotropy,

		flipY: this.flipY
	};

	if(this.image !== undefined)
	{
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

		output.image = image.uuid;
	}

	meta.textures[this.uuid] = output;
	return output;
}