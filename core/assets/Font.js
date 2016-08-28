"use strict";

//Font constructor
function Font(data)
{
	this.name = "font";
	this.uuid = THREE.Math.generateUUID();
	this.type = "Font";

	this.data = data;
}

Font.prototype.isFont = true;

//Create json description
Font.prototype.toJSON = function(meta)
{
	var data = {};

	data.name = this.name;
	data.uuid = this.uuid;
	data.type = this.type;
	data.data = this.data;
	
	return data;
}

//Generate shapes
Font.prototype.generateShapes = function(text, size, divisions)
{
	if(size === undefined)
	{
		size = 100;
	}
	if(divisions === undefined)
	{
		divisions = 4;
	}

	var data = this.data;
	var paths = createPaths(text);
	var shapes = [];

	for(var p = 0, pl = paths.length; p < pl; p++)
	{
		Array.prototype.push.apply(shapes, paths[p].toShapes());
	}

	return shapes;

	//Create paths for text
	function createPaths(text)
	{
		var chars = String(text).split("");
		var scale = size / data.resolution;
		var offset = 0;

		var paths = [];

		for(var i = 0; i < chars.length; i++)
		{
			var ret = createPath(chars[i], scale, offset);
			offset += ret.offset;
			paths.push(ret.path);
		}

		return paths;
	}

	//Create path for a character
	function createPath(c, scale, offset)
	{
		var glyph = data.glyphs[c] || data.glyphs["?"];

		if(!glyph)
		{
			return;
		}

		var path = new THREE.ShapePath();

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
					x = outline[i++] * scale + offset;
					y = outline[i++] * scale;

					path.moveTo(x, y);
				}
				//Line to
				if(action === "l")
				{
					x = outline[i++] * scale + offset;
					y = outline[i++] * scale;
					path.lineTo(x, y);
				}
				//Quadratic curve to
				else if(action === "q")
				{
					cpx = outline[i++] * scale + offset;
					cpy = outline[i++] * scale;
					cpx1 = outline[i++] * scale + offset;
					cpy1 = outline[i++] * scale;

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
					cpx = outline[i++] * scale + offset;
					cpy = outline[i++] * scale;
					cpx1 = outline[i++] * scale + offset;
					cpy1 = outline[i++] * scale;
					cpx2 = outline[i++] * scale + offset;
					cpy2 = outline[i++] * scale;

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

		return {offset: glyph.ha * scale, path: path};
	}
}
