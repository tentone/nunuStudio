"use strict";

/**
 * Image class is used to store image data that is used to create Textures.
 * 
 * Images can be stored in mutiple formats.
 *
 * Some formats (tga, tiff, etc) are converted to png or jpeg in order to work with the rest of the code.
 * 
 * @class Image
 * @extends {Resource}
 * @module Resources
 * @param {ArrayBuffer, Base64, String} data Can be URL to image, ArrayBuffer data or base64 encoded data.
 * @param {string} encoding Image encoding, required for ArrayBuffer data.
 */
function Image(url, encoding)
{
	Resource.call(this, "image", "Image");

	this.width = -1;
	this.height = -1;

	if(url !== undefined)
	{
		// ArrayBuffer
		if(url instanceof ArrayBuffer)
		{
			this.loadArrayBufferData(url, encoding);
		}
		// Base64
		else if(Base64Utils.isBase64(url))
		{
			this.encoding = Base64Utils.getFileFormat(url);
			this.format = "base64";
			this.data = url;
		}
		// Blob (Need to be read immediatly might be revoked to clean space).
		else if(url.startsWith("blob"))
		{
			var arraybuffer = FileSystem.readFileArrayBuffer(url, true);
			this.loadArrayBufferData(arraybuffer);
		}
		// URL
		else
		{
			this.encoding = FileSystem.getFileExtension(url);
			this.format = "url";
			this.data = url;
		}
	}
	else
	{
		this.createSolidColor();
	}
}

Image.prototype = Object.create(Resource.prototype);

/**
 * Check if a file name refers to a supported binary image file.
 *
 * @method fileIsImage
 * @static
 * @param {File} file
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

		return file.endsWith("tga") || file.endsWith("dds") || file.endsWith("pvr") || file.endsWith("ktx") || file.endsWith("basis");
	}

	return false;
};

/**
 * Create a new image with 1x1 resolution with solid color.
 *
 * Can be called externally on data load error to load dummy data.
 *
 * @method createSolidColor
 * @param {string} color Color code
 */
Image.prototype.createSolidColor = function(color)
{
	var canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;

	var context = canvas.getContext("2d");
	context.fillStyle = (color !== undefined) ? color : MathUtils.randomColor();
	context.fillRect(0, 0, 1, 1);

	this.data = canvas.toDataURL("image/png");
	this.format = "base64";
	this.encoding = "png";
};

/**
 * Load arraybuffer data to this image.
 *
 * Creates a blob with data to be stored on data atribute and used by external objects.
 *
 * @method loadArrayBufferData
 * @param {ArrayBuffer} data Data to be loaded.
 * @param {string} encoding Image enconding (jpeg, png, etc).
 */
Image.prototype.loadArrayBufferData = function(data, encoding)
{
	var view = new Uint8Array(data);
	var blob = new Blob([view], {type: "image/" + encoding});

	this.data = URL.createObjectURL(blob);
	this.arraybuffer = data;
	this.encoding = encoding;
	this.format = "arraybuffer";
};

/**
 * Check if this image has alpha channel.
 *
 * This checks the file encoding if the file a GIF or a PNG is assumed that the file has alpha channel.
 *
 * @method hasTransparency
 * @param {boolean} perPixel Check every individual pixel to see if the image actually has tranparency data, default is false.
 * @return {boolean} True if the image is encoded as PNG or GIF
 */
Image.prototype.hasTransparency = function(perPixel)
{
	if(perPixel === true)
	{
		var image = document.createElement("img");
		image.src = this.data;

		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;

		var context = canvas.getContext("2d");
		context.drawImage(image, 0, 0, image.width, image.height);

		var data = context.getImageData(0, 0, image.width, image.height).data;
		for(var i = 3; i < data.length; i += 4)
		{
			if(data[i] !== 255)
			{
				return true;
			}
		}

		return false;
	}
	else
	{
		return this.encoding === "png" || this.encoding === "gif";
	}
};

/**
 * Compresses image data to JPEG.
 *
 * Can be used to compress data and save some space.
 * 
 * @method compressJPEG
 * @param {number} quality JPEG compression quality level by default 0.7 is used (1.0  means max quality).
 */
Image.prototype.compressJPEG = function(quality)
{
	var image = document.createElement("img");
	image.src = this.data;

	var canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;

	var context = canvas.getContext("2d");
	context.drawImage(image, 0, 0, image.width, image.height);

	var self = this;

	canvas.toBlob(function(blob)
	{
		var reader = new FileReader();
		
		reader.onload = function()
		{
			self.encoding = "jpeg";
			self.format = "arraybuffer";
			self.data = reader.result;
		};

		reader.readAsArrayBuffer(blob);

	}, "image/jpeg", quality !== undefined ? quality : 0.7);
};

Image.prototype.dispose = function()
{
	if(this.format === "arraybuffer")
	{
		URL.revokeObjectURL(this.data);
	}
};

/**
 * Serialize Image resource to json.
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

	var data = Resource.prototype.toJSON.call(this, meta);

	if(this.format === "url")
	{
		this.loadArrayBufferData(FileSystem.readFileArrayBuffer(this.data), this.encoding);
	}

	data.width = this.width;
	data.height = this.height;
	data.encoding = this.encoding;

	if(this.format === "arraybuffer")
	{
		data.format = this.format;
		data.data = this.arraybuffer;
	}
	else if(this.format === "base64")
	{
		data.format = "arraybuffer";
		data.data = ArraybufferUtils.fromBase64(Base64Utils.removeHeader(this.data));
	}
	else
	{
		data.format = this.format;
		data.data = this.data;
	}
	
	meta.images[this.uuid] = data;

	return data;
};
