"use strict";

//Font constructor
function Font(url)
{
	this.name = "font";
	this.uuid = THREE.Math.generateUUID();
	this.type = "Font";

	this.format = "";
	this.encoding = "";
	this.data = null;

	this.font = null;

	if(url !== undefined)
	{
		if(typeof url === "object")
		{
			this.data = url;
			this.font = url;
			this.name = url.original_font_information.fullName;
			this.format = "json";
			this.encoding = "json";
		}
		else
		{
			this.encoding = url.split(".").pop().toLowerCase();

			if(this.encoding === "json")
			{
				this.data = JSON.parse(FileSystem.readFile(url));
				this.font = this.data;
				this.name = this.data.original_font_information.fullName;
				this.format = "json";
			}
			else if(this.encoding === "ttf" || this.encoding === "otf" || this.encoding === "ttc" || this.encoding === "otc")
			{
				this.data = FileSystem.readFileArrayBuffer(url);
				this.font = new TTFLoader().parse(this.data);
				this.name = FileSystem.getFileName(url); //this.font.original_font_information.fullName;
				this.format = "arraybuffer";
			}
		}
	}
}

Font.prototype.isFont = true;

//Generate shapes
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
		var offset_x = 0, offset_y = 0;

		var paths = [];

		for(var i = 0; i < chars.length; i++)
		{
			var char = chars[i];

			if(char === "\n")
			{
				offset_y -= (data.boundingBox.yMax - data.boundingBox.yMin) * scale;
				offset_x = 0;
			}
			else
			{
				var ret = createPath(char, scale, offset_x, offset_y);
				offset_x += ret.offset_x;
			}


			paths.push(ret.path);
		}

		return paths;
	}

	//Create path for a character
	function createPath(c, scale, offset_x, offset_y)
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
					x = outline[i++] * scale + offset_x;
					y = outline[i++] * scale + offset_y;

					path.moveTo(x, y);
				}
				//Line to
				if(action === "l")
				{
					x = outline[i++] * scale + offset_x;
					y = outline[i++] * scale + offset_y;
					path.lineTo(x, y);
				}
				//Quadratic curve to
				else if(action === "q")
				{
					cpx = outline[i++] * scale + offset_x;
					cpy = outline[i++] * scale + offset_y;
					cpx1 = outline[i++] * scale + offset_x;
					cpy1 = outline[i++] * scale + offset_y;

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
					cpx = outline[i++] * scale + offset_x;
					cpy = outline[i++] * scale + offset_y;
					cpx1 = outline[i++] * scale + offset_x;
					cpy1 = outline[i++] * scale + offset_y;
					cpx2 = outline[i++] * scale + offset_x;
					cpy2 = outline[i++] * scale + offset_y;

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

		return {offset_x: glyph.ha * scale, path: path};
	}
}

//Create json description
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
}
