"use strict";

function SkinnedWireframeHelper(object, hex) 
{
	THREE.SkinnedMesh.call(this, object.geometry, new THREE.MeshBasicMaterial(
	{
		color: (hex !== undefined) ? hex : 0xFFFFFF,
		wireframe: true,
		skinning: true
	}));

	this.object = object;
	this.matrixAutoUpdate = false;
	this.update();
}

SkinnedWireframeHelper.prototype = Object.create(THREE.SkinnedMesh.prototype);

SkinnedWireframeHelper.prototype.update = function()
{
	this.matrixWorld.copy(this.object.matrixWorld);
};
