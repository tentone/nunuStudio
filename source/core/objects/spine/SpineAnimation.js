"use strict";

/**
 * Spine animation object, to used with animation produced inside Esoteric spine
 * Based on the official threejs runtime
 * More information abou spine available here www.esotericsoftware.com
 * 
 * @class SpineAnimation
 * @constructor
 * @extends {Mesh}
 * @param {Object} json
 * @param {String} atlas
 * @param {String} path
 * @param {Array} textures
 * @module Animations
 */

/**
 * Array of SpineTextures used by the animation
 * @property textures
 * @type {Array}
 */

/**
 * Animation data
 * @property json
 * @type {Object}
 */

/**
 * Texture atlas information
 * @property atlas
 * @type {Object}
 */
function SpineAnimation(json, atlas, path, textures)
{
	if(textures !== undefined)
	{
		var textureAtlas = new spine.TextureAtlas(atlas, function(file)
		{
			for(var i = 0; i < textures.length; i++)
			{
				if(textures[i].name === file)
				{
					var texture = new SpineTexture(textures[i].texture);
					var image = texture.texture.image;
					image.width = 1024;
					image.height = 1024;

					return texture;
				}
			}
		});
	}
	else
	{
		textures = [];
		
		var textureAtlas = new spine.TextureAtlas(atlas, function(file)
		{
			var texture = new SpineTexture(new Texture(new Image(path + "\\" + file)));
			var image = texture.texture.image;
			image.width = 1024;
			image.height = 1024;
			
			textures.push({name: file, texture: texture.texture});

			return texture;
		});
	}

	var loader = new spine.AtlasAttachmentLoader(textureAtlas);
	var skeleton = new spine.SkeletonJson(loader).readSkeletonData(json);

	THREE.Mesh.call(this);

	this.zOffset = 0.1;
	
	this.skeleton = new spine.Skeleton(skeleton);

	var animation = new spine.AnimationStateData(skeleton);
	this.state = new spine.AnimationState(animation);

	this.batcher = new spine.threejs.MeshBatcher(this);

	var material = new THREE.MeshBasicMaterial();
	material.side = THREE.DoubleSide;
	material.transparent = true;
	material.name = "spine";
	material.alphaTest = 0.5;
	this.material = material;

	this.json = json;
	this.atlas = atlas;
	this.textures = textures;

	this.name = "spine";
	this.type = "SpineAnimation";

	this.scale.set(0.01, 0.01, 0.01);

	this.frustumCulled = false;
	this.receiveShadow = true;
	this.castShadow = true;

	this.clock = new THREE.Clock();
}

SpineAnimation.prototype = Object.create(THREE.Mesh.prototype);
SpineAnimation.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];

/**
 * Update animation state
 * Automatically called by the rutime
 * @method update
 */
SpineAnimation.prototype.update = function()
{
	var state = this.state;
	var skeleton = this.skeleton;
	state.update(this.clock.getDelta());
	state.apply(skeleton);
	skeleton.updateWorldTransform();
	this.updateGeometry();

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

/**
 * Get all available animations
 * @method getAnimations
 * @return {Array} Animations
 */
SpineAnimation.prototype.getAnimations = function()
{
	return this.state.data.skeletonData.animations;
}

/**
 * Set animation from track number and name
 * @method setAnimation
 * @param {Number} track Track number
 * @param {String} name Animation name
 */
SpineAnimation.prototype.setAnimation = function(track, name)
{
	try
	{
		this.state.setAnimation(track, name, true);
	}
	catch(e){}
}

/**
 * Get skins in this animation
 * @return {[type]} [description]
 */
SpineAnimation.prototype.getSkins = function()
{
	return this.state.data.skeletonData.skins;
}

/**
 * Update mesh geometry from animation state
 * @method updateGeometry
 */
SpineAnimation.prototype.updateGeometry = function()
{
	//var geometry = this.geometry;
	//var numVertices = 0;
	//var verticesLength = 0;
	//var indicesLength = 0;
	//var blendMode = null;

	var vertices = null, triangles = null;
	var drawOrder = this.skeleton.drawOrder;
	var z = 0;

	var batcher = this.batcher;
	batcher.begin();

	for(var i = 0, n = drawOrder.length; i < n; i++)
	{
		var slot = drawOrder[i];
		var attachment = slot.getAttachment();
		var texture = null;

		if(attachment instanceof spine.RegionAttachment)
		{
			var region = attachment;
			vertices = region.updateWorldVertices(slot, false);
			triangles = SpineAnimation.QUAD_TRIANGLES;
			texture = region.region.renderObject.texture;
		}
		else if(attachment instanceof spine.MeshAttachment)
		{
			var mesh = attachment;
			vertices = mesh.updateWorldVertices(slot, false);
			triangles = mesh.triangles;
			texture = mesh.region.renderObject.texture;
		}
		else
		{
			continue;
		}

		if(texture !== null)
		{
			if(!this.material.map)
			{
				var material = this.material;
				material.map = texture.texture;
				material.needsUpdate = true;
			}
			batcher.batch(vertices, triangles, z);
			z += this.zOffset;
		}
	}
	batcher.end();
}

/**
 * Create JSON for script
 * @param {Object} meta
 * @return {Object} json
 */
SpineAnimation.prototype.toJSON = function(meta)
{
	//Avoid serializing geometry and material
	var geometry = this.geometry;
	var material = this.material;
	this.geometry = undefined;
	this.material = undefined;
	
	//Store textures
	var textures = [];
	var self = this;
	var data = THREE.Object3D.prototype.toJSON.call(this, meta, function(meta, object)
	{
		for(var i = 0; i < self.textures.length; i++)
		{
			var texture = self.textures[i].texture.toJSON(meta);
			textures.push({name: self.textures[i].name, texture: texture.uuid});
		}
	});

	//Animation data
	data.object.json = this.json;
	data.object.atlas = this.atlas;
	data.object.textures = textures;

	//Restore geometry and material
	this.geometry = geometry;
	this.material = material;

	return data;
}