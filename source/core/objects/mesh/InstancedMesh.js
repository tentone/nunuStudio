import {Mesh} from "./Mesh.js";
import {InstancedMesh as TInstancedMesh, BufferAttribute, Object3D} from "three";

/**
 * A instanced mesh is a mesh that can be drawn multiple times at once, it can be used to optimize the draw of large amount of the same geometry material combination.
 * 
 * The usage of InstancedMesh will help you to reduce the number of draw calls and thus improve the overall rendering performance in your application.
 *
 * @class InstancedMesh
 * @module Meshes
 * @param {Geometry} geometry Geometry used by this mesh
 * @param {Material} material Material used to shade the superficie of the geometry
 * @extends {InstancedMesh}
 */
function InstancedMesh(geometry, material, count)
{
	TInstancedMesh.call(this, geometry, material, count);

	this.name = "instanced";
	this.type = "InstancedMesh";

	this.receiveShadow = true;
	this.castShadow = true;
	
	Object.defineProperties(this,
	{
		/**
		 * The number of instances. The count value represents the maximum number of instances of this mesh.
		 *
		 * You can change the number of instances at runtime to an integer value in the range [0, count].
		 *
		 * @attribute url
		 * @type {string}
		 */
		count:
		{
			get: function(){return count;},
			set: function(value)
			{
				// Resize the instanceMatrix to fit the number of instances
				if(value > count)
				{
					this.instanceMatrix = new BufferAttribute(new Float32Array(value * 16), 16);
				}
				
				count = value;
			}
		}
	});
}

InstancedMesh.prototype = Object.create(TInstancedMesh.prototype);

InstancedMesh.prototype.dispose = function()
{
	// Material and geometry
	if(this.material !== null && this.material.dispose !== undefined)
	{
		this.material.dispose();
	}
	if(this.geometry !== null)
	{
		this.geometry.dispose();
	}

	// Children
	Object3D.prototype.dispose.call(this);
};

InstancedMesh.prototype.toJSON = function(meta)
{
	var data = Object3D.prototype.toJSON.call(this, meta);

	data.object.instanceMatrix = this.instanceMatrix.toJSON();
	data.object.count = this.count;

	return data;
};
export {InstancedMesh};