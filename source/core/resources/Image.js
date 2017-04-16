"use strict";

/**
 * Image class is used to store image data that is used to create Textures.
 * 
 * Images can be stored in mutiple formats but on serialization images are converted to JPEG if they are opaque or to PNG if they are transparent.
 * 
 * GIF images are never converted to prevert animation capabilities.
 * 
 * @class Image
 * @constructor
 * @extends {Resource}
 * @module Resources
 * @param {String} data Can be URL to image, ArrayBuffer for TGA data or base64 encoded data.
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
			this.loadTGAData(url);
		}
		//Base64 data
		else if(url.startsWith("data:image"))
		{
			this.encoding = Base64Utils.getFileFormat(url);
			this.format = "base64";
			this.data = url;

			if(this.encoding !== "gif")
			{
				this.encodeData();
			}
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
				this.loadTGAData(FileSystem.readFileArrayBuffer(url));
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
 * Load .tga file from ArrayBuffer data.
 *
 * After loading data is converted to JPEG format and stored in base64 encoding.
 * 
 * @method loadTGAData
 */
Image.loadTGAData = function(data)
{
	var canvas = new THREE.TGALoader().parse(data);
	this.encoding = "jpeg";
	this.format = "base64";
	this.data = canvas.toDataURL("image/jpeg", 1.0);
}

/**
 * Compresses image data to JPEG or PNG and stores in base64 encoding.
 *
 * If the image has transparency it is stored as PNG otherwise the image is stored in JPEG with 1.0 quality.
 *
 * Can be used to compress data and save space.
 * 
 * @method encodeData
 */
Image.prototype.encodeData = function()
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
};

/**
 * Serialize Image resource to JSON.
 *
 * If image is stored as URL it is converter to PNG or JPEG.
 *
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
Image.prototype.toJSON = function(meta)
{
	if(meta.images[this.uuid] !== undefined)
	{
		return meta.images[this.uuid];
	}

	if(this.format === "url")
	{
		this.encodeData();
	}

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
