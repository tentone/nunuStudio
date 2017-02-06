//Based on typeface.js online converter made by gero3

"use strict";

function TTFLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
	this.reversed = false;
}

TTFLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var self = this;
	var loader = new THREE.FileLoader(this.manager);
	loader.setResponseType("arraybuffer");
	loader.load(url, function(buffer)
	{
		var json = self.parse(buffer);
		if(onLoad !== undefined)
		{
			onLoad(json);
		}
	}, onProgress, onError);
}

TTFLoader.prototype.parse = function(arraybuffer)
{
	var font = opentype.parse(arraybuffer);
	return TTFLoader.convert(font, this.reversed);
}

TTFLoader.convert = function(font, reversed)
{
	var scale = (100000) / ((font.unitsPerEm || 2048) * 72);
	var data = {};

	data.glyphs = {};
	for(var i = 0; i < font.glyphs.length; i++)
	{
		var glyph = font.glyphs.glyphs[i];

		if(glyph.unicode !== undefined)
		{
			var token = {};
			
			token.ha = Math.round(glyph.advanceWidth * scale);
			token.xMin = Math.round(glyph.xMin * scale);
			token.xMax = Math.round(glyph.xMax * scale);
			token.o = ""
			
			if(reversed)
			{
				glyph.path.commands = TTFLoader.reverseCommands(glyph.path.commands);
			}

			glyph.path.commands.forEach(function(command, i)
			{
				if(command.type.toLowerCase() === "c")
				{
					command.type = "b";
				}
				
				token.o += command.type.toLowerCase();
				token.o += " "
				
				if(command.x !== undefined && command.y !== undefined)
				{
					token.o += Math.round(command.x * scale);
					token.o += " "
					token.o += Math.round(command.y * scale);
					token.o += " "
				}
				if(command.x1 !== undefined && command.y1 !== undefined)
				{
					token.o += Math.round(command.x1 * scale);
					token.o += " "
					token.o += Math.round(command.y1 * scale);
					token.o += " "
				}
				if(command.x2 !== undefined && command.y2 !== undefined)
				{
					token.o += Math.round(command.x2 * scale);
					token.o += " "
					token.o += Math.round(command.y2 * scale);
					token.o += " "
				}
			});
			data.glyphs[String.fromCharCode(glyph.unicode)] = token;
		}
	}

	data.resolution = 1000;
	data.originalFontInformation = font.names;
	data.unitsPerEm = font.unitsPerEm;
	data.ascender = Math.round(font.ascender * scale);
	data.descender = Math.round(font.descender * scale);
	data.underlinePosition = font.tables.post.underlinePosition;
	data.underlineThickness = font.tables.post.underlineThickness;
	
	data.boundingBox =
	{
		yMin: font.tables.head.yMin,
		xMin: font.tables.head.xMin,
		yMax: font.tables.head.yMax,
		xMax: font.tables.head.xMax
	};

	return data;
}

TTFLoader.reverseCommands = function(commands)
{
	var paths = [];
	var path;
	
	commands.forEach(function(c)
	{
		if(c.type.toLowerCase() === "m")
		{
			path = [c];
			paths.push(path);
		}
		else if(c.type.toLowerCase() !== "z")
		{
			path.push(c);
		}
	});
	
	var reversed = [];
	paths.forEach(function(p)
	{
		var data =
		{
			type: "m",
			x: p[p.length - 1].x,
			y: p[p.length - 1].y
		};

		reversed.push(data);
		
		for(var i = p.length - 1; i > 0; i--)
		{
			var command = p[i];
			data = {type: command.type};

			if(command.x2 !== undefined && command.y2 !== undefined)
			{
				data.x1 = command.x2;
				data.y1 = command.y2;
				data.x2 = command.x1;
				data.y2 = command.y1;
			}
			else if(command.x1 !== undefined && command.y1 !== undefined)
			{
				data.x1 = command.x1;
				data.y1 = command.y1;
			}

			data.x = p[i - 1].x;
			data.y = p[i - 1].y;
			reversed.push(data);
		}
	});
	
	return reversed;
}