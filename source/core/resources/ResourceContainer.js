"use strict";

/**
 * Constructor method for a resource container object of multiple types.
 *
 * @method ResourceContainer
 */
function ResourceContainer()
{
	/**
	 * Image resources.
	 * 
	 * @property images
	 * @type {Array}
	 */
	this.images = [];

	/**
	 * Videos.
	 * 
	 * @property videos
	 * @type {Array}
	 */
	this.videos = [];

	/**
	 * Audio.
	 * 
	 * @property audio
	 * @type {Array}
	 */
	this.audio = [];

	/**
	 * Fonts.
	 * 
	 * @property fonts
	 * @type {Array}
	 */
	this.fonts = [];

	/**
	 * Materials.
	 * 
	 * @property materials
	 * @type {Array}
	 */
	this.materials = [];

	/**
	 * Textures.
	 * 
	 * @property textures
	 * @type {Array}
	 */
	this.textures = [];

	/**
	 * Geometries.
	 * 
	 * @property geometries
	 * @type {Array}
	 */
	this.geometries = [];

	/**
	 * Resources.
	 * 
	 * @property resources
	 * @type {Array}
	 */
	this.resources = [];

	/**
	 * Shapes.
	 * 
	 * @property shapes
	 * @type {Array}
	 */
	this.shapes = [];

	/**
	 * Skeletons.
	 * 
	 * @property skeletons
	 * @type {Array}
	 */
	this.skeletons = [];
};

ResourceContainer.libraries = ["images", "videos", "audio", "fonts", "materials", "textures", "geometries", "resources", "shapes", "skeletons"];


ResourceContainer.prototype.getTexture = function(uuid)
{
	if(this.textures[uuid] === undefined)
	{
		console.warn("ResourceContainer: Undefined texture", uuid);
	}

	return this.textures[uuid];
};

ResourceContainer.prototype.getGeometry = function(uuid)
{
	// TODO <REMOVE THIS>
	console.log("ResourceContainer.prototype.getGeometry", this.geometries);

	if(this.geometries[uuid] === undefined)
	{
		console.warn("ResourceContainer: Undefined geometry", uuid);
	}
	
	return this.geometries[uuid];
};

ResourceContainer.prototype.getMaterial = function(uuid)
{
	if(uuid instanceof Array)
	{
		var array = [];
		for(var i = 0; i < uuid.length; i++)
		{
			if(this.materials[uuid[i]] === undefined)
			{
				console.warn("ResourceContainer: Undefined material", uuid);
			}

			array.push(this.materials[uuid[i]]);
		}
		
		return array;
	}

	if(this.materials[uuid] === undefined)
	{
		console.warn("ResourceContainer: Undefined material", uuid);
	}

	return this.materials[uuid];
};

ResourceContainer.prototype.getFont = function(uuid)
{
	if(this.fonts[uuid] === undefined)
	{
		console.warn("ResourceContainer: Undefined font", uuid);
	}
	return this.fonts[uuid];
};

ResourceContainer.prototype.getAudio = function(uuid)
{
	if(this.audio[uuid] === undefined)
	{
		console.warn("ResourceContainer: Undefined audio", uuid);
	}
	return this.audio[uuid];
};