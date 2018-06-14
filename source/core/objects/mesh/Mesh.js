"use strict";

/**
 * A Mesh combines a geometry and a material forming a complete rederizable object.
 * 
 * Based on THREE.Mesh documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Objects/Mesh.
 * 
 * @class Mesh
 * @module Meshes
 * @param {Geometry} geometry Geometry used by this mesh
 * @param {Material} material Material used to shade the superficie of the geometry
 * @constructor
 * @extends {Mesh}
 */

/**
 * Geometry defines the object structure.
 * 
 * @property geometry
 * @type {Geometry}
 */
/**
 * Material is used to define how the geometry surface is shaded.
 * 
 * @property material
 * @type {Material}
 */
/**
 * Determines how the mesh triangles are constructed from the vertices.
 * 
 * Only works when the geometry is a BufferGeometry.
 * 
 * @property drawMode
 * @default TrianglesDrawMode
 */
function Mesh(geometry, material)
{
	THREE._Mesh.call(this, geometry, material);

	this.name = "model";

	this.receiveShadow = true;
	this.castShadow = true;
}

THREE._Mesh = THREE.Mesh;
THREE.Mesh = Mesh;

Mesh.prototype = Object.create(THREE._Mesh.prototype);

/**
 * Dispose mesh along with its material and geometry.
 * 
 * @method dispose
 */
Mesh.prototype.dispose = function()
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
