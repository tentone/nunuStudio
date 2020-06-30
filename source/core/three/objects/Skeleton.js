import {Texture} from "../../texture/Texture.js";
import {DataTexture} from "../../texture/DataTexture.js";
import {ResourceContainer} from "../../resources/ResourceContainer.js";
import {Resource} from "../../resources/Resource.js";
import {Container} from "../../objects/misc/Container.js";
import {SkinnedMesh} from "../../objects/mesh/SkinnedMesh.js";
import {Mesh} from "../../objects/mesh/Mesh.js";
import {Skeleton, Math, Object3D, Bone, Matrix4} from "three";

/**
 * Use an array of bones to create a skeleton that can be used by a SkinnedMesh.
 *
 * @class Skeleton
 * @module Animation
 * @param {Array} bones Bone array.
 * @param {Array} boneInverses An array of Matrix4.
 */

Skeleton.prototype.toJSON = function(meta)
{
	var data = {};

	// Generate a new UUID of there is none.
	if(this.uuid === undefined)
	{
		this.uuid = Math.generateUUID();
	}

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
	
	return data;
};

/**
 * Parse skeleton from JSON data, for a specific object.
 *
 * @static
 * @method fromJSON
 * @param {Object} data JSON encoded data.
 * @param {Object3D} object Target object that has this skeleton.
 * @param {ResourceContainer} resources Resource container to read resouce data.
 */
Skeleton.fromJSON = function(data, object, resources)
{
	var bones = [];
	var boneInverses = [];

	for(var j = 0; j < data.bones.length; j++)
	{
		var bone = object.getObjectByProperty("uuid", data.bones[j]);
		if(bone === undefined)
		{
			console.warn("Skeleton.fromJSON: Not found Bone with uuid " + data.bones[j]);
			bone = new Bone();
		}

		bones.push(bone);
		boneInverses.push(new Matrix4().fromArray(data.boneInverses[j]));
	}

	var skeleton = new Skeleton(bones, boneInverses);
	skeleton.uuid = data.uuid;

	return skeleton;
};

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