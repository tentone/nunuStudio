"use strict";

/**
 * Use an array of bones to create a skeleton that can be used by a SkinnedMesh.
 *
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
 * The array buffer holding the bone data when using a vertex texture.
 * 
 * @property boneMatrices
 * @type {ArrayBuffer}
 */

/**
 * An array of Matrix4s that represent the inverse of the matrixWorld of the individual bones.
 * 
 * Use the supplied bone inverses or calculate the inverses.
 *
 * @property boneInverses
 * @type {Array}
 */

/**
 * The DataTexture holding the bone data when using a vertex texture.
 * 
 * @property boneTexture
 * @type {DataTexture}
 */

THREE.Skeleton.prototype.uuid = THREE.Math.generateUUID();

THREE.Skeleton.prototype.toJSON = function(meta)
{
	var data = {};

	data.uuid = this.uuid;

	data.bones = [];
	for(var i = 0; i < this.bones.length; i++)
	{
		data.bones.push(this.bones[i].uuid);
	}

	data.boneInverses = [];
	for(var i = 0; i < this.boneInverses.length; i++)
	{
		data.boneInverses.push(this.boneInverses[i].toArray());
	}


	if(this.boneMatrices !== undefined)
	{
		data.boneMatrices = Array.from(this.boneMatrices);
	}

	if(this.boneTexture !== undefined)
	{

	}

	if(this.boneTextureSize !== undefined)
	{
		data.boneTextureSize = this.boneTextureSize;
	}
	

	return data;
};


/**
 * Parse skeleton from JSON data, for a specific object.
 *
 * @static
 * @method fromJSON
 * @param {Object} data JSON encoded data.
 * @param {THREE.Object3D} object Target object that has this skeleton.
 * @param {ResourceContainer} resources Resource container to read resouce data.
 */
THREE.Skeleton.fromJSON = function(data, object, resources)
{
	var bones = [];
	var boneInverses = [];

	for(var j = 0; j < data.bones.length; j++)
	{
		var bone = object.getObjectByProperty("uuid", data.bones[j]);
		if(bone === undefined)
		{
			console.warn("Skeleton.fromJSON: Not found Bone with uuid " + data.bones[j]);
			bone = new THREE.Bone();
		}

		bones.push(bone);
		boneInverses.push(new THREE.Matrix4().fromArray(data.boneInverses[j]));
	}

	var skeleton = new THREE.Skeleton(bones, boneInverses);

	if(data.boneMatrices !== undefined)
	{
		this.boneMatrices = new Float32Array(data.boneMatrices);
	}

	if(data.boneTextureSize !== undefined)
	{
		this.boneTextureSize = data.boneTextureSize;
	}
	
	if(data.boneTexture !== undefined)
	{
		
	}


	return skeleton;
};