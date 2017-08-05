"use strict";

/**
 * Dispose mesh along with its material and geometry.
 * 
 * @method dispose
 */
THREE.SkinnedMesh.prototype.dispose = function()
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

/**
 * Bind a skeleton to this SkinnedMesh. The bindMatrix gets saved to .bindMatrix property and the .bindMatrixInverse gets calculated.
 * 
 * This is called automatically in the constructor, and the skeleton is created from the bones of the Geometry passed in the constructor.
 * 
 * @method bind
 * @param {Skeleton} skeleton
 * @param {Matrix4} bindMatrix
 */

/**
 * Serializa skinned mesh to json.
 *
 * @method toJSON
 * @param {Object} meta Metadata
 */
THREE.SkinnedMesh.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	console.log(this);

	if(this.bindMode !== undefined)
	{
		data.object.bindMode = this.bindMode;
	}

	if(this.bindMatrix !== undefined)
	{
		data.object.bindMatrix = this.bindMatrix.toArray();
	}

	if(this.skeleton !== undefined)
	{
		if(meta.skeletons[this.skeleton.uuid] === undefined)
		{
			meta.skeletons[this.skeleton.uuid] = this.skeleton.toJSON(meta);
		}

		data.object.skeleton = this.skeleton.uuid;
	}

	return data;
};