import {Texture} from "../../texture/Texture.js";
import {Image} from "../../resources/Image.js";
import {SpineTexture} from "./SpineTexture.js";
import {Clock, Object3D} from "three";
import spine from "spine-runtimes/spine-ts/build/spine-threejs"

console.log(spine);

/**
 * Spine animation object, to used with animation produced inside Esoteric spine. These animations are created using the Spine animation studio software.
 * 
 * Based on the official three.js runtime code available at https:// github.com/EsotericSoftware/spine-runtimes.
 * 
 * More information about spine available at www.esotericsoftware.com.
 * 
 * @class SpineAnimation
 * @extends {spine.threejs.SkeletonMesh}
 * @param {Object} json
 * @param {string} atlas
 * @param {string} path
 * @param {Array} textures
 * @module Animations
 */
function SpineAnimation(json, atlas, path, textures)
{
	if(textures === undefined)
	{
		textures = [];
	}
	
	var textureAtlas = new spine.TextureAtlas(atlas, function(file)
	{
		for(var i = 0; i < textures.length; i++)
		{
			if(textures[i].name === file)
			{
				var texture = new SpineTexture(textures[i].texture);
				break;
			}
		}

		if(i === textures.length)
		{
			var texture = new SpineTexture(new Texture(new Image(path + "/" + file)));
			textures.push({name: file, texture: texture.texture});
		}

		var element = texture.texture.image;
		var image = texture.texture.source;

		if(image.width > 0 && image.height > 0)
		{
			element.width = image.width;
			element.height = image.height;
		}
		else if(element.naturalWidth !== 0 && element.naturalHeight !== 0)
		{
			element.width = element.naturalWidth;
			element.height = element.naturalHeight;
			image.width = element.width;
			image.height = element.height;
		}
		else
		{
			var beginning = atlas.search("size: ");
			var end = atlas.search("\nformat");
			var size = atlas.substring(beginning + 6, end);
			size = size.split(",");
			element.width = parseInt(size[0]);
			element.height = parseInt(size[1]);
		}
		
		return texture;
	});

	var loader = new spine.AtlasAttachmentLoader(textureAtlas);
	var skeleton = new spine.SkeletonJson(loader).readSkeletonData(json);

	spine.threejs.SkeletonMesh.call(this, skeleton);

	this.name = "spine";
	this.type = "SpineAnimation";

	this.scale.set(0.01, 0.01, 0.01);

	/**
	 * Spine animation data.
	 *
	 * @property json
	 * @type {Object}
	 */
	this.json = json;
	
	/**
	 * Texture atlas information.
	 *
	 * @property atlas
	 * @type {Object}
	 */
	this.atlas = atlas;
	
	/**
	 * Array of SpineTextures used by the animation.
	 *
	 * @property textures
	 * @type {Array}
	 */
	this.textures = textures;

	/**
	 * The animation can have multiple skins that define diferent sets of textures for the same animation.
	 *
	 * @attribute skin
	 * @type {Object}
	 */
	this.skin = (this.getSkins().length > 0) ? this.getSkins()[0].name : null;
	
	/**
	 * Animation currently playing, animations are split into tracks.
	 *
	 * An animation (e.g. walk) can be composed of multiple tracks.
	 *
	 * @attribute animation
	 * @type {Object}
	 */
	this.animation = (this.getAnimations().length > 0) ? this.getAnimations()[0].name : null;
		
	/** 
	 * Index of the animation track playing.
	 *
	 * @attribute track
	 * @type {number}
	 */
	this.track = 0;

	/** 
	 * Indicates the loop mode of the animation if set true the animation starts again after it ends.
	 *
	 * @attribute loop
	 * @type {boolean}
	 */
	this.loop = true;

	this.clock = new Clock();
	
	this.play();
}

SpineAnimation.prototype = Object.create(spine.threejs.SkeletonMesh.prototype);

SpineAnimation.prototype.update = function(delta)
{
	spine.threejs.SkeletonMesh.prototype.update.call(this, delta);
	Object3D.prototype.update.call(this);
};

/**
 * Update mesh geometry from animation state before rendering.
 * 
 * @method onBeforeRender
 */
SpineAnimation.prototype.onBeforeRender = function()
{
	this.state.update(this.clock.getDelta());
	this.state.apply(this.skeleton);
	this.skeleton.updateWorldTransform();
	this.updateGeometry();
};

/**
 * Play animation.
 * 
 * @method play
 */
SpineAnimation.prototype.play = function()
{
	if(this.animation !== null)
	{
		this.setAnimation(this.track, this.animation, this.loop);
	}

	if(this.skin !== null)
	{
		this.setSkin(this.skin);
	}
};

/**
 * Get all available animations.
 * 
 * @method getAnimations
 * @return {Array} Animations
 */
SpineAnimation.prototype.getAnimations = function()
{
	return this.state.data.skeletonData.animations;
}

/**
 * Set animation from track number and name.
 * 
 * @method setAnimation
 * @param {number} track Track number.
 * @param {string} animation Animation name.
 * @param {boolean} loop If true the animation plays in loop.
 */
SpineAnimation.prototype.setAnimation = function(track, animation, loop)
{
	try
	{
		if(track !== undefined){this.track = track;}
		if(animation !== undefined){this.animation = animation;}
		if(loop !== undefined){this.loop = loop;}

		this.state.setAnimation(this.track, this.animation, this.loop);
	}
	catch(e)
	{
		this.animation = null;

		console.warn("nunuStudio: Error setting spine animation " + name + " on track " + track);
	}
};

/**
 * Get skins available for this animation.
 *
 * @method getSkins
 * @return {Array} List of skins available for this animation.
 */
SpineAnimation.prototype.getSkins = function()
{
	return this.state.data.skeletonData.skins;
};

/**
 * Set skin to be used by this animation
 *
 * @method setSkin
 * @param {string} name Skin name.
 */
SpineAnimation.prototype.setSkin = function(name)
{
	try
	{
		this.skeleton.setSkinByName(name);
		this.skin = name;
	}
	catch(e)
	{
		this.skin = null;
		console.warn("nunuStudio: Error setting spine skin " + name);
	}
};

SpineAnimation.prototype.toJSON = function(meta)
{
	// Store textures
	var textures = [];
	var self = this;
	var data = Object3D.prototype.toJSON.call(this, meta, function(meta)
	{
		for(var i = 0; i < self.textures.length; i++)
		{
			var texture = self.textures[i].texture.toJSON(meta);
			textures.push({name: self.textures[i].name, texture: texture.uuid});
		}
	});

	// Animation data
	data.object.json = this.json;
	data.object.atlas = this.atlas;
	data.object.textures = textures;

	// Default animation and skin
	if(this.animation !== null)
	{
		data.object.animation = this.animation;
		data.object.track = this.track;
		data.object.loop = this.loop;
	}
	if(this.skin !== null)
	{
		data.object.skin = this.skin;	
	}

	return data;
};

export {SpineAnimation};