"use strict";

function SkinnedWireframeHelper(object, hex) 
{
	var material = new THREE.MeshBasicMaterial(
	{
		color: (hex !== undefined) ? hex : 0xFFFFFF,
		wireframe: true,
		skinning: false
	});
	
	THREE.SkinnedMesh.call(this, object.geometry, material);

	this.matrix = object.matrixWorld;
	this.matrixAutoUpdate = false;
	this.object = object;

	this.update();
}

SkinnedWireframeHelper.prototype = Object.create(THREE.SkinnedMesh.prototype);

SkinnedWireframeHelper.prototype.update = function()
{
	if(this.object !== null)
	{
		this.matrix = this.object.matrixWorld;
		this.geometry = this.object.geometry;
	}
};