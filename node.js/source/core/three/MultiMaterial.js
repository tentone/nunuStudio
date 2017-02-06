"use strict";

//Dispose materials
THREE.MultiMaterial.prototype.dispose = function()
{
	for(var i in this.materials)
	{
		this.materials[i].dispose();
	}
}