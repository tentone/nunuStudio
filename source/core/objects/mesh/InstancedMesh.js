"use strict";

/**
 * A instanced mesh is a mesh that can be drawn multiple times at once, it can be used to optimize the draw of large amount of the same geometry/material combination.
 * 
 * @class InstancedMesh
 * @module Meshes
 * @param {Geometry} geometry Geometry used by this mesh
 * @param {Material} material Material used to shade the superficie of the geometry
 * @extends {THREE.InstancedMesh}
 */
function InstancedMesh(geometry, material)
{
	THREE._InstancedMesh.call(this, geometry, material);

	this.name = "instanced";
	this.type = "InstancedMesh";

	this.receiveShadow = true;
	this.castShadow = true;
}

THREE._InstancedMesh = THREE.InstancedMesh;
THREE.InstancedMesh = InstancedMesh;

InstancedMesh.prototype = Object.create(THREE._InstancedMesh.prototype);

InstancedMesh.prototype.dispose = function()
{
	//Material and geometry
	if(this.material !== null && this.material.dispose !== undefined)
	{
		this.material.dispose();
	}
	if(this.geometry !== null)
	{
		this.geometry.dispose();
	}

	//Children
	THREE.Object3D.prototype.dispose.call(this);
};


InstancedMesh.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	// data.object.instanceMatrix = this.instanceMatrix 
	data.object.count = this.count;
	//TODO <STORE this.instanceMatrix and this.count>

	return data;
};