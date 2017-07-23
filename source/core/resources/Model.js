"use strict";

/**
 * Model is used to load and check file type for external 3D models, animations, scenes etc.
 *
 * It wraps other threejs loaders and loads files using them depending on file format.
 * 
 * @class Model
 * @extends {Resource}
 * @constructor
 * @module Resources
 */
function Model()
{
	Resource.call(this, "model", "Model3D");
}

/**
 * Check if a file name refers to a 3D geometry file.
 *
 * @method fileIsFont
 * @static
 * @param {File} file
 * @return {boolean} True if the fname refers to a supported format.
 */
Model.fileIsModel = function(file)
{
	if(file !== undefined)
	{
		file = file.name.toLocaleLowerCase();

		return file.endsWith("obj") || file.endsWith("3ds") || file.endsWith("dae") || file.endsWith("gltf") || file.endsWith("glb") || file.endsWith("3mf") || file.endsWith("awd") || file.endsWith("ply") || file.endsWith("vtk") || file.endsWith("vtp") || file.endsWith("wrl") || file.endsWith("vrml") || file.endsWith("fbx") || file.endsWith("pcd") || file.endsWith("stl") || file.endsWith("json");
	}

	return false;
};

