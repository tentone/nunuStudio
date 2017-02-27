"use strict";

/**
 * Font class stores font data, font data can be stored as an opentype json or as a TTF file (stored in Base64).
 * 
 * Font objects are used for booth 2D and 3D text.
 * 
 * @class Font
 * @constructor
 * @extends {Resource}
 * @module Resources
 * @param {String} url URL to font file
 */

/**
 * Font data, can be an ArrayBuffer or JSON.
 *
 * @property font
 * @type {Object}
 * @default null
 */

/**
 * If true the font glyphs are reversed.
 *
 * @property reversed
 * @type {boolean}
 * @default false
 */
function Font(url)
{
	this.name = "font";
	this.uuid = THREE.Math.generateUUID();
	this.type = "Font";

	this.format = "";
	this.encoding = "";
	this.data = null;

	this.reversed = false;
	this.font = null;

	if(url !== undefined)
	{	
		//Arraybuffer
		if(url instanceof window.ArrayBuffer)
		{
			this.data = url;
			this.loadTTF();
			this.format = "arraybuffer";
		}
		//Opentype JSON
		else if(typeof url === "object")
		{
			this.data = url;
			this.font = url;
			this.format = "json";
			this.encoding = "json";
		}
		//URL
		else
		{
			this.encoding = url.split(".").pop().toLowerCase();
			this.name = FileSystem.getFileName(url);

			if(this.encoding === "json")
			{
				this.data = JSON.parse(FileSystem.readFile(url));
				this.format = "json";
				this.font = this.data;
			}
			else if(this.encoding === "ttf" || this.encoding === "otf" || this.encoding === "ttc" || this.encoding === "otc")
			{
				this.data = FileSystem.readFileArrayBuffer(url);
				this.format = "arraybuffer";
				this.loadTTF();
			}
		}
	}
}

/**
 * Check if a file name refers to a font file.
 *
 * @method fileIsFont
 * @static
 * @param {String} fname
 * @return {boolean} True if the fname refers to a supported font format.
 */
Font.fileIsFont = function(file)
{
	if(file !== undefined)
	{
		file = file.name.toLocaleLowerCase();

		return file.endsWith("ttf") || file.endsWith("otf") || file.endsWith("ttc") || file.endsWith("otc") || file.endsWith("json");
	}

	return false;
};

Font.prototype.isFont = true;

/**
 * Reverse the font glyphs.
 *
 * Can be used to fix fonts that have paths defined CW.
 *
 * @method reverseGlyphs
 */
Font.prototype.reverseGlyphs = function()
{
	this.reversed = !this.reversed;

	this.loadTTF();
};

/**
 * Load font from data using the TTF loader.
 * 
 * @method loadTTF
 */
Font.prototype.loadTTF = function()
{
	var loader = new TTFLoader();
	loader.reversed = this.reversed;
	this.font = loader.parse(this.data);
};

/**
 * Generate font shapes used to create 3D geometries.
 * 
 * @param {String} text
 * @param {Number} size
 * @param {Number} divisions
 * @return {Array} paths
 */
Font.prototype.generateShapes = function(text, size, divisions)
{
	if(size === undefined)
	{
		size = 100;
	}

	if(divisions === undefined)
	{
		divisions = 10;
	}

	var data = this.font;
	var paths = createPaths(text);
	var shapes = [];

	for(var p = 0; p < paths.length; p++)
	{
		Array.prototype.push.apply(shapes, paths[p].toShapes());
	}

	return shapes;

	//Create paths for text
	function createPaths(text)
	{
		var chars = String(text).split("");
		var scale = size / data.resolution;
		var lineHeight = (data.boundingBox.yMax - data.boundingBox.yMin) * scale;
		
		var offsetX = 0, offsetY = 0;
		var paths = [];

		for(var i = 0; i < chars.length; i++)
		{
			var char = chars[i];

			if(char === "\n")
			{
				offsetY -= lineHeight;
				offsetX = 0;
			}
			else
			{
				var ret = createPath(char, scale, offsetX, offsetY);
				offsetX += ret.width;

				paths.push(ret.path);
			}
		}

		return paths;
	}

	//Create path for a character
	function createPath(c, scale, offsetX, offsetY)
	{
		var glyph = data.glyphs[c] || data.glyphs["?"];
		
		if(!glyph)
		{
			return;
		}

		var path = new THREE.ShapePath();

		//Temporary variables
		var pts = [], b2 = THREE.ShapeUtils.b2, b3 = THREE.ShapeUtils.b3;
		var x, y, cpx, cpy, cpx0, cpy0, cpx1, cpy1, cpx2, cpy2, laste;

		if(glyph.o)
		{
			var outline = glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(" "));

			for(var i = 0, l = outline.length; i < l;)
			{
				var action = outline[i++];

				//Move to
				if(action === "m")
				{
					x = outline[i++] * scale + offsetX;
					y = outline[i++] * scale + offsetY;
					path.moveTo(x, y);
				}
				//Line to
				if(action === "l")
				{
					x = outline[i++] * scale + offsetX;
					y = outline[i++] * scale + offsetY;
					path.lineTo(x, y);
				}
				//Quadratic curve to
				else if(action === "q")
				{
					cpx = outline[i++] * scale + offsetX;
					cpy = outline[i++] * scale + offsetY;
					cpx1 = outline[i++] * scale + offsetX;
					cpy1 = outline[i++] * scale + offsetY;

					path.quadraticCurveTo(cpx1, cpy1, cpx, cpy);
					laste = pts[pts.length - 1];

					if(laste)
					{
						cpx0 = laste.x;
						cpy0 = laste.y;

						for(var i2 = 1; i2 <= divisions; i2++)
						{
							var t = i2 / divisions;
							b2(t, cpx0, cpx1, cpx);
							b2(t, cpy0, cpy1, cpy);
						}
					}
				}
				//Bezier curve to
				else if(action === "b")
				{
					cpx = outline[i++] * scale + offsetX;
					cpy = outline[i++] * scale + offsetY;
					cpx1 = outline[i++] * scale + offsetX;
					cpy1 = outline[i++] * scale + offsetY;
					cpx2 = outline[i++] * scale + offsetX;
					cpy2 = outline[i++] * scale + offsetY;

					path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, cpx, cpy);
					laste = pts[pts.length - 1];

					if(laste)
					{
						cpx0 = laste.x;
						cpy0 = laste.y;

						for(var i2 = 1; i2 <= divisions; i2++)
						{
							var t = i2 / divisions;
							b3(t, cpx0, cpx1, cpx2, cpx);
							b3(t, cpy0, cpy1, cpy2, cpy);
						}
					}
				}
			}
		}

		return {width: glyph.ha * scale, path: path};
	}
};

/**
 * Serialize font resource to json.
 *
 * Font data is stored as Base64 is present in a binary format, or JSON otherwise.
 * 
 * @param {Object} meta
 * @return {Object} json
 */
Font.prototype.toJSON = function(meta)
{
	if(meta.fonts[this.uuid] !== undefined)
	{
		return meta.fonts[this.uuid];
	}

	var data = {};
	data.name = this.name;
	data.uuid = this.uuid;
	data.type = this.type;
	data.encoding = this.encoding;

	data.reversed = this.reversed;
	
	if(this.format === "arraybuffer")
	{
		data.data = Base64Utils.fromArraybuffer(this.data);
		data.format = "base64";
	}
	else if(this.format === "json")
	{
		data.data = this.data;
		data.format = this.format;
	}

	meta.fonts[this.uuid] = data;
	
	return data;
};
