"use strict";

/**
 * Materials describe the appearance of objects. They are defined in a (mostly) renderer-independent way, so you don't have to rewrite materials if you decide to use a different renderer.
 * 
 * Original documentation available here https://threejs.org/docs/index.html#Reference/Materials/Material
 *
 * @class Material
 * @module THREE
 */

/**
 * Dispose material.
 * 
 * Also disposes all the textures attached to the material.
 * 
 * @method dispose
 */
THREE.Material.prototype.dispose = function()
{
	function disposeTexture(texture)
	{
		if(texture !== undefined && texture !== null)
		{
			texture.dispose();
		}
	}

	this.dispatchEvent({type:"dispose"});

	disposeTexture(this.map);
	disposeTexture(this.bumpMap);
	disposeTexture(this.normalMap);
	disposeTexture(this.displacementMap);
	disposeTexture(this.specularMap);
	disposeTexture(this.emissiveMap);
	disposeTexture(this.alphaMap);
	disposeTexture(this.roughnessMap);
	disposeTexture(this.metalnessMap);
	disposeTexture(this.envMap);
}
