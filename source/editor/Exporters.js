import {OBJExporter} from "three/examples/jsm/exporters/OBJExporter";
import {GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter";
import {DRACOExporter} from "three/examples/jsm/exporters/DRACOExporter";
import {ColladaExporter} from "three/examples/jsm/exporters/ColladaExporter";
import {PLYExporter} from "three/examples/jsm/exporters/PLYExporter";
import {STLExporter} from "three/examples/jsm/exporters/STLExporter";
import {FileSystem} from "../core/FileSystem.js";
import {Locale} from "./locale/LocaleManager.js";
import {Editor} from "./Editor.js";

/**
 * Exporters contains methods and utils to export objects in multiple formats used by other applications.
 * 
 * @static
 * @class Exporters
 */
function Exporters() {}

/**
 * Export a object into a wavefront obj file.
 * 
 * @static
 * @method exportOBJ
 * @param {Object3D} object Object to export. 
 */
Exporters.exportOBJ = function(object)
{
	FileSystem.chooseFileWrite(function(fname)
	{
		var exporter = new OBJExporter();
		var data = exporter.parse(object);
		FileSystem.writeFile(fname, data);
	}, ".obj");
};

/**
 * Export a object into a GLTF encoded file.
 * 
 * @static
 * @method exportGLTF
 * @param {Object3D} object Object to export.
 * @param {boolean} binary Indicates if the file should be encoded as binary data.
 */
Exporters.exportGLTF = function(object, binary)
{
	var onlyVisible = Editor.confirm(Locale.exportOnlyVisibleObjects);

	var config = 
	{
		onlyVisible: onlyVisible,
		binary: binary,
		forceIndices: true,
		embedImages: true,
		forcePowerOfTwoTextures: false
	};

	if (binary)
	{
		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new GLTFExporter();
			exporter.parse(object, function(result)
			{
				FileSystem.writeFileArrayBuffer(fname, result);
			}, config);
		}, ".glb");
	}
	else
	{
		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new GLTFExporter();
			exporter.parse(object, function(result)
			{
				FileSystem.writeFile(fname, JSON.stringify(result, null, "\t"));
			}, config);
		}, ".gltf");
	}
};

/**
 * Export a object into a Google draco encoded file. The object has to contain a geometry to be encoded.
 * 
 * @static
 * @method exportDraco
 * @param {Object3D} object Object to export. 
 */
Exporters.exportDraco = function(object)
{
	if (object.geometry === undefined)
	{
		throw new Error("Object required a geometry to be exported as DRACO.");
	}

	var geometry = object.geometry;
	var exporter = new DRACOExporter();

	FileSystem.chooseFileWrite(function(fname)
	{
		var arraybuffer = exporter.parse(geometry);
		FileSystem.writeFileArrayBuffer(fname, arraybuffer);
	}, ".drc");
};


/**
 * Export COLLADA encoded file. The version to export can be configured as a parameter.
 * 
 * @static
 * @method exportCollada
 * @param {Object3D} object Object to export.
 * @param {string} version Version to be used as export (e.g., 1.4.1, 1.5.0)
 */
Exporters.exportCollada = function(object, version)
{
	var config =
	{
		version: version !== undefined ? version : "1.5.0",
		binary: true,
		textureDirectory: ""
	};

	FileSystem.chooseFileWrite(function(fname)
	{
		var path = FileSystem.getFilePath(fname);

		var exporter = new ColladaExporter();
		exporter.parse(object, function(result)
		{
			for (var i = 0; i < result.textures.length; i++)
			{
				var texture = result.textures[i];
				FileSystem.writeFileArrayBuffer(path + texture.name + "." + texture.ext, texture.data.buffer);
			}

			FileSystem.writeFile(fname, result.data);
		}, config);
	}, ".dae");
};

/**
 * Export object as a PLY (Polygon File Format) file.
 * 
 * @static
 * @method exportPLY
 * @param {Object3D} object Object to export.
 * @param {boolean} binary Indicates if the file should be encoded as binary data.
 */
Exporters.exportPLY = function(object, binary)
{
	var config = {binary: binary === true};
	
	if (binary)
	{
		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new PLYExporter();
			exporter.parse(object, function(result)
			{
				FileSystem.writeFileArrayBuffer(fname, result);
			}, config);
		}, ".ply");
	}
	else
	{
		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new PLYExporter();
			exporter.parse(object, function(result)
			{
				FileSystem.writeFile(fname, result);
			}, config);
		}, ".ply");
	}

};

/**
 * Export object as a STL (Standard Triangle Language) file.
 * 
 * @static
 * @method exportSTL
 * @param {Object3D} object Object to export.
 * @param {boolean} binary Indicates if the file should be encoded as binary data.
 */
Exporters.exportSTL = function(object, binary)
{
	var config = {binary: binary === true};

	if (binary)
	{
		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new STLExporter();
			var data = exporter.parse(object, config);
			FileSystem.writeFileArrayBuffer(fname, data.buffer);
		}, ".stl");
	}
	else
	{
		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new STLExporter();
			var data = exporter.parse(object, config);
			FileSystem.writeFile(fname, data);
		}, ".stl");
	}
};
