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
function Skeleton(bones, boneInverses)
{
	this.uuid = THREE.Math.generateUUID();

	if(bones === undefined)
	{
		bones = [];
	}

	/**
	 * The array of bones. Note this is a copy of the original array, not a reference, so you can modify the original array without effecting this one.
	 * 
	 * @property bones
	 * @type {Array}
	 */
	this.bones = bones.slice(0);
	
	/**
	 * The array buffer holding the bone data when using a vertex texture.
	 * 
	 * @property boneMatrices
	 * @type {ArrayBuffer}
	 */
	this.boneMatrices = new Float32Array(this.bones.length * 16);


	/**
	 * An array of Matrix4s that represent the inverse of the matrixWorld of the individual bones.
	 * 
	 * Use the supplied bone inverses or calculate the inverses.
	 *
	 * @property boneInverses
	 * @type {Array}
	 */
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

	/**
	 * The DataTexture holding the bone data when using a vertex texture.
	 * 
	 * @property boneTexture
	 * @type {DataTexture}
	 */
}

THREE._Skeleton = THREE.Skeleton;
THREE.Skeleton = Skeleton;

Skeleton.prototype = Object.create(THREE._Skeleton.prototype);

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