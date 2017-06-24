"use strict";

/**
 * CubeTextures represent 360 view using six images, these images correspond to the faces of a cube.
 * 
 * CubeTextures can be used to simulate reflections and transparency refraction in materials.
 * 
 * Is also possible to create dynamic cubetextures using the CubeCamera object.
 *
 * @class CubeTexture
 * @constructor
 * @extends {Texture}
 * @param {Array} images Image array
 * @param {Number} mapping
 * @param {Number} wrapS
 * @param {Number} wrapT
 * @param {Number} magFilter
 * @param {Number} minFilter
 * @param {Number} format
 * @param {Number} type
 * @param {Number} anisotropy
 * @param {Number} encoding
 */

/**
 * Size of each one of the texture that compose the CubeTexture.
 *
 * @property size
 * @type {Number}
 * @default 512
 */

/**
 * Cube texture mode, the mode specifies how the cube texture is created.
 *
 * Source format may vary from a mode to another.
 * @property mode
 * @type {Number}
 */
function CubeTexture(images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	if(mapping === undefined)
	{
		mapping = THREE.CubeReflectionMapping;
	}

	var array = [];
	for(var i = 0; i < 6; i++)
	{
		array.push(document.createElement("canvas"));
	}	

	THREE.Texture.call(this, array, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	this.images = (images !== undefined) ? images : [];

	this.size = 512;
	this.flipY = false;
	this.mode = (this.images.length === 6) ? CubeTexture.CUBE : CubeTexture.EQUIRECTANGULAR;

	if(this.images.length > 0)
	{
		this.updateImages();
	}

	this.name = "cubetexture";
	this.category = "Cube";
}

CubeTexture.prototype = Object.create(THREE.Texture.prototype);

CubeTexture.prototype.isCubeTexture = true;

/**
 * Cubemap right image index
 *
 * @attribute RIGHT
 * @type {Number}
 */
CubeTexture.RIGHT = 0;

/**
 * Cubemap left image index
 *
 * @attribute LEFT
 * @type {Number}
 */
CubeTexture.LEFT = 1;

/**
 * Cubemap top image index
 *
 * @attribute TOP
 * @type {Number}
 */
CubeTexture.TOP = 2;

/**
 * Cubemap bottom image index
 *
 * @attribute BOTTOM
 * @type {Number}
 */
CubeTexture.BOTTOM = 3;

/**
 * Cubemap front image index
 *
 * @attribute FRONT
 * @type {Number}
 */
CubeTexture.FRONT = 4;

/**
 * Cubemap back image index
 *
 * @attribute BACK
 * @type {Number}
 */
CubeTexture.BACK = 5;

/**
 * CubeMap mode, 6 images used as source for the texture.
 *
 * @attribute CUBE
 * @type {Number}
 */
CubeTexture.CUBE = 20;

/**
 * CubeMap mode, single image used as source.
 *
 * @attribute CROSS
 * @type {Number}
 */
CubeTexture.CROSS = 21;

/**
 * Equirectangular projection mode, 1 single image used as source.
 *
 * Source image should have a 2:1 aspect ratio.
 *
 * @attribute EQUIRECTANGULAR
 * @type {Number}
 */
CubeTexture.EQUIRECTANGULAR = 22;


/**
 * Set resolution of each face of the cubemap.
 *
 * The size has to be a power of 2.
 * 
 * @method setSize
 * @param {Number} size Cube face resolution.
 */
CubeTexture.prototype.setSize = function(size)
{
	if((size & (size - 1)) !== 0)
	{
		console.warn("nunuStudio: CubeTexture new size is not a power of two.");
		return;
	}

	this.size = size;
	this.updateImages();
}


/**
 * Set mode and update images.
 * 
 * @method setMode
 * @param {Number} mode Mode to be used.
 */
CubeTexture.prototype.setMode = function(mode)
{
	this.mode = mode;
	this.updateImages();
}

/**
 * Updates the CubeTexture images, should be called after changing the images attached to the texture
 * 
 * @method updateImages
 */
CubeTexture.prototype.updateImages = function()
{
	var self = this;

	if(this.mode === CubeTexture.CUBE)
	{
		for(var i = 0; i < this.images.length; i++)
		{
			if(typeof this.images[i] === "string")
			{
				this.images[i] = new Image(this.images[i]);
			}

			var image = document.createElement("img");
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
	else if(this.mode === CubeTexture.CROSS)
	{
		for(var i = 0; i < this.image.length; i++)
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
	else if(this.mode === CubeTexture.EQUIRECTANGULAR)
	{
		for(var i = 0; i < this.image.length; i++)
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

			var faces = ["pz", "nz", "px", "nx", "py", "ny"];

			for(var i = 0; i < faces.length; i++)
			{
				var out = renderFace(data, faces[i], Math.PI, self.size);
				self.image[i].getContext("2d").putImageData(out, 0, 0);
			}
			
			self.needsUpdate = true;
		};
	}
};

/**
 * Serialize cube texture to JSON
 * All six images of the cube texture are stored individually
 * 
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
CubeTexture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);

	data.size = this.size;
	data.mode = this.mode;

	data.images = [];
	for(var i = 0; i < this.images.length; i++)
	{	
		var image = this.images[i].toJSON(meta);
		data.images.push(image.uuid);
	}

	return data;
};


function kernelResample(read, write, a, kernel)
{
	var width = read.width, height = read.height, data = read.data;

	var readIndex = function(x, y)
	{
		return 4 * (y * width + x);
	};

	var twoA = 2 * a;
	var xMax = width - 1;
	var yMax = height - 1;
	var xKernel = new Array(4);
	var yKernel = new Array(4);

	return function(xFrom, yFrom, to)
	{
		var xl = Math.floor(xFrom);
		var yl = Math.floor(yFrom);
		var xStart = xl - a + 1;
		var yStart = yl - a + 1;

		for(var i = 0; i < twoA; i++)
		{
			xKernel[i] = kernel(xFrom - (xStart + i));
			yKernel[i] = kernel(yFrom - (yStart + i));
		}

		for(var channel = 0; channel < 3; channel++)
		{
			var q = 0;

			for(var i = 0; i < twoA; i++)
			{
				var y = yStart + i;
				var yClamped = clamp(y, 0, yMax);
				var p = 0;

				for (var j = 0; j < twoA; j++)
				{
					var x = xStart + j;
					var index = readIndex(clamp(x, 0, xMax), yClamped);
					p += data[index + channel] * xKernel[j];
				}

				q += p * yKernel[i];
			}

			write.data[to + channel] = Math.round(q);
		}
	};
}

var orientations =
{
	pz: function(out, x, y)
	{
		out.x = -1;
		out.y = -x;
		out.z = -y;
	},
	nz: function(out, x, y)
	{
		out.x = 1;
		out.y = x;
		out.z = -y;
	},
	px: function(out, x, y)
	{
		out.x = x;
		out.y = -1;
		out.z = -y;
	},
	nx: function(out, x, y)
	{
		out.x = -x;
		out.y = 1;
		out.z = -y;
	},
	py: function(out, x, y)
	{
		out.x = -y;
		out.y = -x;
		out.z = 1;
	},
	ny: function(out, x, y)
	{
		out.x = y;
		out.y = -x;
		out.z = -1;
	}
};

function copyPixelLanczos(read, write, grid)
{
	var kernel = function(x)
	{
		if(x === 0)
		{
			return 1;
		}
		else
		{
			var xp = Math.PI * x;
			return 3 * Math.sin(xp) * Math.sin(xp / 3) / (xp * xp);
		}
	};

	return kernelResample(read, write, 3, kernel);
}


var renderFace = function(readData, face, rotation, size, interpolation)
{
	var faceWidth = size;
	var faceHeight = size;

	var cube = {};
	var orientation = orientations[face];

	var writeData = new ImageData(faceWidth, faceHeight);

	var copyPixel = copyPixelLanczos(readData, writeData);//interpolation === "linear" ? copyPixelBilinear(readData, writeData) : interpolation === "cubic" ? copyPixelBicubic(readData, writeData) : interpolation === "lanczos" ? copyPixelLanczos(readData, writeData) : copyPixelNearest(readData, writeData);

	for(var x = 0; x < faceWidth; x++)
	{
		for (var y = 0; y < faceHeight; y++)
		{
			var to = 4 * (y * faceWidth + x);

			// fill alpha channel
			writeData.data[to + 3] = 255;

			// get position on cube face
			// cube is centered at the origin with a side length of 2
			orientation(cube, 2 * (x + 0.5) / faceWidth - 1, 2 * (y + 0.5) / faceHeight - 1);

			// project cube face onto unit sphere by converting cartesian to spherical coordinates
			var r = Math.sqrt(cube.x * cube.x + cube.y * cube.y + cube.z * cube.z);
			var lon = mod(Math.atan2(cube.y, cube.x) + rotation, 2 * Math.PI);
			var lat = Math.acos(cube.z / r);

			copyPixel(readData.width * lon / Math.PI / 2 - 0.5, readData.height * lat / Math.PI - 0.5, to);
		}
	}

	return writeData;
}

function clamp(x, min, max)
{
	return Math.min(max, Math.max(x, min));
}

function mod(x, n)
{
	return (x % n + n) % n;
}
