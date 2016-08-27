"use strict";

//Texture constructor
function Texture(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	//Self pointer
	var self = this;

	//Check if image is url
	if(typeof image === "string")
	{
		var url = image;
		var image = document.createElement("img");
		image.src = url;

		image.onload = function()
		{
			self.needsUpdate = true;
		}
	}

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
	if(meta.textures[this.uuid] !== undefined)
	{
		return meta.textures[this.uuid];
	}

	var output =
	{
		metadata:
		{
			version: Editor.VERSION,
			type: "Texture"
		},

		uuid: this.uuid,
		name: this.name,
		category: this.category,
		
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