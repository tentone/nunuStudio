"use strict";

function SkinnedWireframeHelper(object, hex) 
{
	THREE.SkinnedMesh.call(this, object.geometry, new THREE.MeshBasicMaterial(
	{
		color: (hex !== undefined) ? hex : 0xFFFFFF,
		wireframe: true,
		skinning: false
	}));

	this.object = object;

	this.matrix = object.matrixWorld;
	this.matrixAutoUpdate = false;

	this.update();
}

SkinnedWireframeHelper.prototype = Object.create(THREE.SkinnedMesh.prototype);

SkinnedWireframeHelper.prototype.update = function()
{
	this.matrix = this.object.matrixWorld;
	this.geometry = this.object.geometry;
};