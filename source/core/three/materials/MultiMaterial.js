"use strict";

/**
 * A Material to define multiple materials for the same geometry. The geometry decides which material is used for which faces by the faces materialindex. The material index corresponds with the index of the material in the .materials array.
 *
 * MultiMaterials have been deprectaed in threejs R85 but some of the loaders still use it.
 * 
 * Original documentation available here https://threejs.org/docs/index.html#Reference/Materials/MultiMaterial.
 *
 * @class MultiMaterial
 * @module THREE
 */

/**
 * UUID unique identifier.
 * @property uuid
 * @type {String}
 */

/**
 * Resource name. Not required to be unique.
 * @property name
 * @type {String}
 */
THREE.MultiMaterial.prototype.name = "material";

/**
 * Dispose materials inside the container
 * @method dispose
 */
THREE.MultiMaterial.prototype.dispose = function()
{
	for(var i in this.materials)
	{
		this.materials[i].dispose();
	}
}
