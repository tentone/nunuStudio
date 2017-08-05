"use strict";

/**
 * Dispose mesh along with its material and geometry.
 * 
 * @method dispose
 */
THREE.Mesh.prototype.dispose = function()
{
	//Material and geometry
	if(this.material !== null && this.material.dispose !== undefined)
	{
		this.material.dispose();
	}
	this.geometry.dispose();

	//Children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
};
