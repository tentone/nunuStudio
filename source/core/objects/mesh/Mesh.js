"use strict";

/**
 * Meshs are used to combine a geometry and a material forming a complete rederizable object
 * Based on THREE.Mesh documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Objects/Mesh
 * 
 * @class Mesh
 * @module Meshes
 * @param {Geometry} geometry Geometry used by this mesh
 * @param {Material} material Material used to shade the superficie of the geometry
 * @constructor
 * @extends {THREE.Mesh}
 */
/**
 * Geometry defined the object structure
 * @property geometry
 * @type {Geometry}
*/
/**
 * Material is used to define how the geometry surface is shaded
 * @property material
 * @type {Material}
*/
/**
 * Determines how the mesh triangles are constructed from the vertices.
 * Only works when the geometry is a BufferGeometry
 * @property drawMode
 * @default TrianglesDrawMode
*/
function Mesh(geometry, material)
{
	THREE.Mesh.call(this, geometry, material);

	this.name = "model";

	this.receiveShadow = true;
	this.castShadow = true;
}

Mesh.prototype = Object.create(THREE.Mesh.prototype);

/**
 * Dispose mesh along with its material and geometry
 * @method dispose
 */
Mesh.prototype.dispose = function()
{
	//Dispose material and geometry
	if(this.material !== null && this.material.dispose !== undefined)
	{
		this.material.dispose();
	}
	this.geometry.dispose();

	//Dispose children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}
