"use strict";

/**
 * Use an array of bones to create a skeleton that can be used by a SkinnedMesh.
 *
 * @author takahirox
 * @class Skeleton
 * @module Animation
 * @param {Array} bones Bone array.
 * @param {Array} boneInverses An array of Matrix4.
 */

/**
 * The array of bones. Note this is a copy of the original array, not a reference, so you can modify the original array without effecting this one.
 * 
 * @property bones
 * @type {Array}
 */
/**
 * An array of Matrix4s that represent the inverse of the matrixWorld of the individual bones.
 * 
 * @property boneInverses
 * @type {Array}
 */

/**
 * The array buffer holding the bone data when using a vertex texture.
 * 
 * @property boneMatrices
 * @type {ArrayBuffer}
 */

/**
 * The DataTexture holding the bone data when using a vertex texture.
 * 
 * @property boneTexture
 * @type {DataTexture}
 */
function Skeleton(bones, boneInverses)
{
	this.uuid = THREE.Math.generateUUID();

	//Copy the bone array
	bones = bones || [];

	this.bones = bones.slice(0);
	this.boneMatrices = new Float32Array(this.bones.length * 16);

	//Use the supplied bone inverses or calculate the inverses
	if(boneInverses === undefined)
	{
		this.calculateInverses();
	}
	else
	{
		if(this.bones.length === boneInverses.length)
		{
			this.boneInverses = boneInverses.slice(0);
		}
		else
		{
			console.warn("THREE.Skeleton boneInverses is the wrong length.");

			this.boneInverses = [];

			for(var i = 0; i < this.bones.length; i++)
			{
				this.boneInverses.push(new Matrix4());
			}
		}
	}
}

Skeleton.prototype = Object.create(THREE.Skeleton.prototype);

THREE.Skeleton = Skeleton;

/**
 * Serialize skeleton to json.
 *
 * @method toJSON
 * @param {Object} meta Meta.
 * @return {Object} Serialized data.
 */
Skeleton.prototype.toJSON = function(meta)
{
	var data = {};

	var bones = [];
	var boneInverses = [];

	for(var i = 0, il = this.bones.length; i < il; i++)
	{
		bones.push(this.bones[i].uuid);
	}

	for(var i = 0, il = this.boneInverses.length; i < il; i++)
	{
		boneInverses.push(this.boneInverses[i].toArray());
	}

	data.uuid = this.uuid;
	data.bones = bones;
	data.boneInverses = boneInverses;

	return data;
};