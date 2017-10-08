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
	Resource.call(this, "model", "Model");
}

Model.prototype = Object.create(Resource.prototype);

/**
 * List of file types support for 3D models.
 *
 * @property {Array} extensions List of extensions.
 * @type {Array}
 */
Model.extensions = ["assimp", "assimp.json", "blend", "amf", "babylon", "prwm", "svg", "obj", "3ds", "dae", "gltf", "glb", "3mf", "awd", "ply", "vtk", "vtp", "wrl", "vrml", "fbx", "pcd", "stl", "json", "x"];

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

		for(var i = 0; i < Model.extensions.length; i++)
		{
			if(file.endsWith(Model.extensions[i]))
			{
				return true;
			}
		}
	}

	return false;
};

