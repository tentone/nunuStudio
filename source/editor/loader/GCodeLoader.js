"use strict";

/**
 * GCodeLoader is used to load .gcode files usually used for 3D printing or CNC applications.
 *
 * @class GCodeLoader
 * @param {Manager} manager Loading manager.
 */
function GCodeLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

GCodeLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var self = this;

	var loader = new THREE.FileLoader(self.manager);
	loader.setPath(this.path);
	loader.load(url, function(text)
	{

		onLoad(self.parse(text));

	}, onProgress, onError);
};

GCodeLoader.prototype.parse = function(data)
{
	var lastLine = {x:0, y:0, z:0, e:0, f:0, extruding:false};
	var layers = [];
	var layer = undefined;
	var bbbox = { min: { x:100000,y:100000,z:100000 }, max: { x:-100000,y:-100000,z:-100000 } };
	
	var pathMaterial = new THREE.LineBasicMaterial({color: 0xFFFF00});
	pathMaterial.name = "path";
	var extrudingMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
	extrudingMaterial.name = "extruded";

	function newLayer(line)
	{
		layer = { type: {}, layer: layers.length, z: line.z, };
		layers.push(layer);
	}

	function getLineGroup(line)
	{
		if(layer === undefined)
		{
			newLayer(line);
		}
		var speed = Math.round(line.e / 1000);
		var grouptype = (line.extruding ? 10000 : 0) + speed;

		var color = new THREE.Color(line.extruding ? 0xffffff : 0x0000ff);

		if(layer.type[grouptype] === undefined)
		{
			layer.type[grouptype] =
			{
				type: grouptype,
				feed: line.e,
				extruding: line.extruding,
				segmentCount: 0,
				material: line.extruding ? extrudingMaterial : pathMaterial,
				geometry: new THREE.Geometry(),
			};
		}

		return layer.type[grouptype];
	}

	function addSegment(p1, p2)
	{
		var group = getLineGroup(p2);
		var geometry = group.geometry;
		
		group.segmentCount++;
		geometry.vertices.push(new THREE.Vector3(p1.x, p1.y, p1.z));
		geometry.vertices.push(new THREE.Vector3(p2.x, p2.y, p2.z));
		if(p2.extruding)
		{
			bbbox.min.x = Math.min(bbbox.min.x, p2.x);
			bbbox.min.y = Math.min(bbbox.min.y, p2.y);
			bbbox.min.z = Math.min(bbbox.min.z, p2.z);
			bbbox.max.x = Math.max(bbbox.max.x, p2.x);
			bbbox.max.y = Math.max(bbbox.max.y, p2.y);
			bbbox.max.z = Math.max(bbbox.max.z, p2.z);
		}
	}
	
	var relative = false;

	function delta(v1, v2)
	{
		return relative ? v2 : v2 - v1;
	}

	function absolute (v1, v2)
	{
		return relative ? v1 + v2 : v2;
	}

	var lines = data.replace(/;.+/g,'').trim().split("\n");

	for(var i = 0; i < lines.length; i++)
	{
		var tokens = lines[i].split(" ");
		var cmd = tokens[0].toUpperCase();

		//Argumments
		var args = {};
		tokens.splice(1).forEach(function(token) 
		{ 
			if(token[0] !== undefined)
			{
				var key = token[0].toLowerCase(); 
				var value = parseFloat(token.substring(1)); 
				args[key] = value; 
			}
		}); 

		//Process commands
		if(cmd === "G0" || cmd === "G1")
		{
			//Example: G1 Z1.0 F3000
			//         G1 X99.9948 Y80.0611 Z15.0 F1500.0 E981.64869
			//         G1 E104.25841 F1800.0
			//Go in a straight line from the current (X, Y) point to the point (90.6, 13.8), extruding material as the move happens from the current extruded length to a length of 22.4 mm.
			var newLine =
			{
				x: args.x !== undefined ? absolute(lastLine.x, args.x) : lastLine.x,
				y: args.y !== undefined ? absolute(lastLine.y, args.y) : lastLine.y,
				z: args.z !== undefined ? absolute(lastLine.z, args.z) : lastLine.z,
				e: args.e !== undefined ? absolute(lastLine.e, args.e) : lastLine.e,
				f: args.f !== undefined ? absolute(lastLine.f, args.f) : lastLine.f,
			};

			//Layer change detection is or made by watching Z, it"s made by watching when we extrude at a new Z position
			if(delta(lastLine.e, newLine.e) > 0)
			{
				newLine.extruding = delta(lastLine.e, newLine.e) > 0;
				if(layer == undefined || newLine.z != layer.z)
				{
					newLayer(newLine);
				}
			}

			addSegment(lastLine, newLine);
			lastLine = newLine;
		}
		else if(cmd === "G90")
		{
			//G90: Set to Absolute Positioning
			//All coordinates from now on are absolute relative to the origin of the machine. (This is the RepRap default.)
			relative = false;
		}
		else if(cmd === "G91")
		{
			//G91: Set to Relative Positioning
			//All coordinates from now on are relative to the last position.
			relative = true;
		}
		else if(cmd === "G92")
		{
			//G92: Set Position
			//Example: G92 E0
			//Allows programming of absolute zero point, by reseting the
			//current position to the values specified. This would set the
			//machine"s X coordinate to 10, and the extrude coordinate to 90.
			//No physical motion will occur.

			//TODO: Only support E0
			var newLine = lastLine;
			newLine.x= args.x !== undefined ? args.x : newLine.x;
			newLine.y= args.y !== undefined ? args.y : newLine.y;
			newLine.z= args.z !== undefined ? args.z : newLine.z;
			newLine.e= args.e !== undefined ? args.e : newLine.e;
			lastLine = newLine;
		}
		else
		{
			console.warn("GCodeLoader: Unknown command:" + cmd);
		}
	}

	/*
	G21: function(args)
	{
		//G21: Set Units to Millimeters
		//Example: G21
		//Units from now on are in millimeters. (This is the RepRap default.)

		//No-op: So long as G20 is not supported.
	},
	M82: function(args)
	{
		//M82: Set E codes absolute (default)
		//Descriped in Sprintrun source code.

		//No-op, so long as M83 is not supported.
	},

	M84: function(args)
	{
		//M84: Stop idle hold
		//Example: M84
		//Stop the idle hold on all axis and extruder. In some cases the
		//idle hold causes annoying noises, which can be stopped by
		//disabling the hold. Be aware that by disabling idle hold during
		//printing, you will get quality issues. This is recommended only
		//in between or after printjobs.

		//No-op
	}*/

	console.log("Layer Count ", layers.length);
	console.log("bbox ", bbbox);

	var object = new THREE.Object3D();

	for(var i = 0; i < layers.length; i++)
	{
		var layer = layers[i];

		for(var tid in layer.type)
		{
			var type = layer.type[tid];
			var line = new THREE.LineSegments(type.geometry, type.material);
			line.name = "layer" + i;
			object.add(line);
		}
	}
	
	return object;
};
