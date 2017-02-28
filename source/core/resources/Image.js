"use strict";

/**
 * Image class is used to store image data that is used to create Textures
 * 
 * Images can be stored in mutiple formats but on serialization images are converted to JPEG if they are opaque or to PNG if they are transparent
 * 
 * GIF images are never converted to prevert animation capabilities
 * 
 * @class Image
 * @constructor
 * @extends {Resource}
 * @module Resources
 * @param {String} url URL to image
 */
function Image(url)
{
	this.name = "image";
	this.uuid = THREE.Math.generateUUID();
	this.type = "Image";

	this.format = "";
	this.encoding = ""
	this.data = null;
	
	if(url !== undefined)
	{
		//Arraybuffer data
		if(url instanceof window.ArrayBuffer)
		{
			var canvas = new THREE.TGALoader().parse(url);
			this.encoding = "jpeg";
			this.format = "base64";
			this.data = canvas.toDataURL("image/jpeg", 1.0);
		}
		//Base64 data
		else if(url.startsWith("data:image"))
		{
			this.encoding = Base64Utils.getFileFormat(url);
			this.format = "base64";
			this.data = url;
		}
		//URL
		else
		{
			this.encoding = url.split(".").pop().toLowerCase();

			if(this.encoding === "gif")
			{
				this.data = "data:image/" + this.encoding + ";base64," + FileSystem.readFileBase64(url);
				this.format = "base64";
			}
			else if(this.encoding === "tga")
			{
				var canvas = new THREE.TGALoader().parse(FileSystem.readFileArrayBuffer(url));
				this.encoding = "jpeg";
				this.format = "base64";
				this.data = canvas.toDataURL("image/jpeg", 1.0);
			}
			else
			{
				this.format = "url";
				this.data = url;
			}
		}
	}
}

/**
 * Check if a file name refers to a supported binary image file.
 *
 * @method fileIsImage
 * @static
 * @param {String} file
 * @return {boolean} True if the file refers to a supported image format.
 */
Image.fileIsImage = function(file)
{
	if(file !== undefined)
	{
		if(file.type.startsWith("image"))
		{
			return true;
		}

		file = file.name.toLocaleLowerCase();
		return file.endsWith("tga");
	}

	return false;
};

/**
 * Encode image data to jpeg or png in base64 format.
 *
 * Called automatically when serializing the image object.
 * 
 * @method encodeData
 */
Image.prototype.encodeData = function()
{
	if(this.format === "url")
	{
		var image = document.createElement("img");
		image.src = this.data;

		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;

		var context = canvas.getContext("2d");
		context.drawImage(image, 0, 0, image.width, image.height);

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
			this.format = "base64";
			this.encoding = "png";
			this.data = canvas.toDataURL("image/png");
		}
		else
		{
			this.format = "base64";
			this.encoding = "jpeg";
			this.data = canvas.toDataURL("image/jpeg", 1.0);
		}
	}
};

/**
 * Serialize Image resource to JSON.
 *
 * If image is stored as URL it is converter to PNG or JPEG.
 * 
 * @param {Object} meta
 * @return {Object} json
 */
Image.prototype.toJSON = function(meta)
{
	if(meta.images[this.uuid] !== undefined)
	{
		return meta.images[this.uuid];
	}
	
	this.encodeData();

	var data = {};
	data.name = this.name;
	data.uuid = this.uuid;
	data.type = this.type;
	data.encoding = this.encoding;
	data.format = this.format;
	data.data = this.data;

	meta.images[this.uuid] = data;

	return data;
};
