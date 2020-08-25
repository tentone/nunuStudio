import {CubeReflectionMapping, Texture, Math as TMath, Vector3} from "three";
import {Image} from "../resources/Image.js";


/**
 * CubeTextures represent 360 view using six images, these images correspond to the faces of a cube.
 * 
 * CubeTextures can be used to simulate reflections and transparency refraction in materials.
 * 
 * Is also possible to create dynamic cubetextures using the CubeCamera object.
 *
 * @class CubeTexture
 * @extends {Texture}
 * @param {Array} images Image array
 * @param {number} mapping
 * @param {number} wrapS
 * @param {number} wrapT
 * @param {number} magFilter
 * @param {number} minFilter
 * @param {number} format
 * @param {number} type
 * @param {number} anisotropy
 * @param {number} encoding
 */
function CubeTexture(images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	if (mapping === undefined)
	{
		mapping = CubeReflectionMapping;
	}

	var array = [];
	for (var i = 0; i < 6; i++)
	{
		array.push(document.createElement("canvas"));
	}	

	Texture.call(this, array, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	this.images = images !== undefined ? images : [];

	/**
	 * Size of each one of the texture that compose the CubeTexture.
	 *
	 * @property size
	 * @type {number}
	 * @default 512
	 */
	this.size = 512;
	
	this.flipY = false;
	
	/**
	 * Cube texture mode, the mode specifies how the cube texture is created.
	 *
	 * Source format may vary from a mode to another.
	 *
	 * @property mode
	 * @type {number}
	 */
	this.mode = this.images.length === 6 ? CubeTexture.CUBE : CubeTexture.CROSS;

	if (this.images.length > 0)
	{
		this.updateImages();
	}

	this.name = "cubetexture";
	this.category = "Cube";
}

CubeTexture.prototype = Object.create(Texture.prototype);
CubeTexture.prototype.constructor = CubeTexture;
CubeTexture.prototype.isCubeTexture = true;

/**
 * Cubemap right image index
 *
 * @attribute RIGHT
 * @type {number}
 */
CubeTexture.RIGHT = 0;

/**
 * Cubemap left image index
 *
 * @attribute LEFT
 * @type {number}
 */
CubeTexture.LEFT = 1;

/**
 * Cubemap top image index
 *
 * @attribute TOP
 * @type {number}
 */
CubeTexture.TOP = 2;

/**
 * Cubemap bottom image index
 *
 * @attribute BOTTOM
 * @type {number}
 */
CubeTexture.BOTTOM = 3;

/**
 * Cubemap front image index
 *
 * @attribute FRONT
 * @type {number}
 */
CubeTexture.FRONT = 4;

/**
 * Cubemap back image index
 *
 * @attribute BACK
 * @type {number}
 */
CubeTexture.BACK = 5;

/**
 * CubeMap mode, 6 images used as source for the texture.
 *
 * @attribute CUBE
 * @type {number}
 */
CubeTexture.CUBE = 20;

/**
 * CubeMap mode, single image used as source.
 *
 * @attribute CROSS
 * @type {number}
 */
CubeTexture.CROSS = 21;

/**
 * Equirectangular projection mode, 1 single image used as source.
 *
 * Source image should have a 2:1 aspect ratio.
 *
 * @attribute EQUIRECTANGULAR
 * @type {number}
 */
CubeTexture.EQUIRECTANGULAR = 22;


/**
 * Set resolution of each face of the cubemap.
 *
 * The size has to be a power of 2.
 * 
 * @method setSize
 * @param {number} size Cube face resolution.
 */
CubeTexture.prototype.setSize = function(size)
{
	if ((size & size - 1) !== 0)
	{
		console.warn("nunuStudio: CubeTexture new size is not a power of two.");
		return;
	}

	this.size = size;
};

/**
 * Set new images for this cube texture.
 *
 * @method setImages
 * @param {Array} images Cube texture images.
 * @param {number} mode Mode to be used.
 */
CubeTexture.prototype.setImages = function(images, mode)
{
	this.mode = mode !== undefined ? mode : CubeTexture.CUBE;
	this.images = images;
};

/**
 * Updates the CubeTexture images, should be called after changing the images attached to the texture
 * 
 * @method updateImages
 */
CubeTexture.prototype.updateImages = function()
{
	var self = this;

	if (this.mode === CubeTexture.CUBE)
	{
		for (var i = 0; i < this.images.length; i++)
		{
			if (typeof this.images[i] === "string")
			{
				this.images[i] = new Image(this.images[i]);
			}

			var image = document.createElement("img");
			image.crossOrigin = "anonymous";
			image.index = i;
			image.src = this.images[i].data;
			image.onload = function()
			{
				self.image[this.index].width = self.size;
				self.image[this.index].height = self.size;

				var context = self.image[this.index].getContext("2d");
				context.drawImage(this, 0, 0, self.size, self.size);

				self.needsUpdate = true;
			};
		}
	}
	else if (this.mode === CubeTexture.CROSS)
	{
		for (var i = 0; i < this.image.length; i++)
		{
			this.image[i].width = this.size;
			this.image[i].height = this.size;
		}

		var image = document.createElement("img");
		image.src = this.images[0].data;
		image.onload = function()
		{
			var x = this.naturalWidth / 4;
			var y = this.naturalHeight / 3; 

			self.image[CubeTexture.LEFT].getContext("2d").drawImage(this, 0, y, x, y, 0, 0, self.size, self.size);
			self.image[CubeTexture.FRONT].getContext("2d").drawImage(this, x, y, x, y, 0, 0, self.size, self.size);
			self.image[CubeTexture.RIGHT].getContext("2d").drawImage(this, x * 2, y, x, y, 0, 0, self.size, self.size);
			self.image[CubeTexture.BACK].getContext("2d").drawImage(this, x * 3, y, x, y, 0, 0, self.size, self.size);
			self.image[CubeTexture.TOP].getContext("2d").drawImage(this, x, 0, x, y, 0, 0, self.size, self.size);
			self.image[CubeTexture.BOTTOM].getContext("2d").drawImage(this, x, y * 2, x, y, 0, 0, self.size, self.size);

			self.needsUpdate = true;
		};
	}
	else if (this.mode === CubeTexture.EQUIRECTANGULAR)
	{
		for (var i = 0; i < this.image.length; i++)
		{
			this.image[i].width = this.size;
			this.image[i].height = this.size;
		}
		
		var image = document.createElement("img");
		image.src = this.images[0].data;
		image.onload = function()
		{
			var canvas = document.createElement("canvas");
			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;

			var context = canvas.getContext("2d");
			context.drawImage(image, 0, 0);
			var data = context.getImageData(0, 0, canvas.width, canvas.height);

			for (var i = 0; i < 6; i++)
			{
				var out = CubeTexture.renderEquirectFace(data, i, Math.PI, self.size);
				self.image[i].getContext("2d").putImageData(out, 0, 0);
			}
			
			self.needsUpdate = true;
		};
	}
};

/**
 * Resample an image pixel from ImageData to ImageData, using bilinear interpolation.
 *
 * @method resampleBilinear
 * @param {ImageData} read Where to read data from.
 * @param {ImageData} write Where to write data.
 * @param {number} x Origin pixel x.
 * @param {number} y Origin pixel y.
 * @param {number} index Target index.
 */
CubeTexture.resampleBilinear = function(read, write, x, y, index)
{
	var width = read.width;
	var height = read.height;
	var data = read.data;

	var xl = TMath.clamp(Math.floor(x), 0, width - 1);
	var xr = TMath.clamp(Math.ceil(x), 0, width - 1);
	var xf = x - xl;

	var yl = TMath.clamp(Math.floor(y), 0, height - 1);
	var yr = TMath.clamp(Math.ceil(y), 0, height - 1);
	var yf = y - yl;

	var ll = 4 * (yl * width + xl);
	var lr = 4 * (yl * width + xr);
	var rl = 4 * (yr * width + xl);
	var rr = 4 * (yr * width + xr);

	for (var k = 0; k < 3; k++)
	{
		var a = data[ll + k] * (1 - xf) + data[lr + k] * xf;
		var b = data[rl + k] * (1 - xf) + data[rr + k] * xf;
		
		write.data[index + k] = Math.ceil(a * (1 - yf) + b * yf);
	}
};

/**
 * Render a cube face from equirectangular projection.
 *
 * @method renderEquirectFace
 * @param {ImageData} read Equirectangular image.
 * @param {number} face Face to render.
 * @param {number} rotation Image rotation
 * @param {number} size Face size.
 * @return {ImageData} Face data.
 */
CubeTexture.renderEquirectFace = function(read, face, rotation, size)
{
	var out = new ImageData(size, size);
	var orientation = CubeTexture.faces[face];

	for (var x = 0; x < size; x++)
	{
		for (var y = 0; y < size; y++)
		{
			var index = 4 * (y * size + x);

			// Fill alpha channel
			out.data[index + 3] = 255;

			// Get position on cube face cube is centered at the origin with a side length of 2
			var cube = orientation(2 * (x + 0.5) / size - 1, 2 * (y + 0.5) / size - 1);

			// Project cube face onto unit sphere by converting cartesian to spherical coordinates
			var r = Math.sqrt(cube.x * cube.x + cube.y * cube.y + cube.z * cube.z);
			var lon = TMath.euclideanModulo(Math.atan2(cube.y, cube.x) + rotation, 2 * Math.PI);
			var lat = Math.acos(cube.z / r);

			var px = read.width * lon / Math.PI / 2 - 0.5;
			var py = read.height * lat / Math.PI - 0.5;

			CubeTexture.resampleBilinear(read, out, px, py, index);
		}
	}

	return out;
};

CubeTexture.faces =
[
	function(x, y)
	{
		return new Vector3(x, -1, -y);
	},
	function(x, y)
	{
		return new Vector3(-x, 1, -y);
	},
	function(x, y)
	{
		return new Vector3(-y, -x, 1);
	},
	function(x, y)
	{
		return new Vector3(y, -x, -1);
	},
	function(x, y)
	{
		return new Vector3(-1, -x, -y);
	},
	function(x, y)
	{
		return new Vector3(1, x, -y);
	}
];

/**
 * Serialize cube texture to JSON.
 * 
 * All images of the cube texture are stored individually.
 * 
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
CubeTexture.prototype.toJSON = function(meta)
{
	var data = Texture.prototype.toJSON.call(this, meta);

	data.size = this.size;
	data.mode = this.mode;

	data.images = [];

	if (this.mode === CubeTexture.EQUIRECTANGULAR || this.mode === CubeTexture.CROSS)
	{
		var image = this.images[0].toJSON(meta);
		data.images.push(image.uuid);
	}
	else
	{
		for (var i = 0; i < this.images.length; i++)
		{	
			var image = this.images[i].toJSON(meta);
			data.images.push(image.uuid);
		}
	}

	return data;
};
export {CubeTexture};
