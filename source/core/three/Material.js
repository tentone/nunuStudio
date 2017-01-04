"use strict";

//Dispose material
THREE.Material.dispose = function()
{
	function disposeTexture(texture)
	{
		if(texture !== undefined)
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
}
