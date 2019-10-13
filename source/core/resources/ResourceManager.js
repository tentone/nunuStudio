"use strict";

/**
 * Resource manager is used to manage available resources used by objects
 * 
 * The resource manager is used to extend the Program object and is not meant to be used as a standalone.
 *
 * @class ResourceManager
 * @module Resources
 * @extends {Object3D}
 */
function ResourceManager()
{
	THREE.Object3D.call(this);
	ResourceManager.ResourceContainer.call(this);
}

/**
 * Constructor method for a resource container object.
 *
 * The container is used to store the following types of resources:
 *  - Images
 *  - Videos
 *  - Audio
 *  - Fonts
 *  - Textures
 *  - Materials
 *  - Geometries
 *  - Shapes
 * 
 * @method ResourceContainer
 */
ResourceManager.ResourceContainer = function()
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

ResourceManager.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Dispose all the resources present in the resource manager.
 *
 * @method dispose
 */
ResourceManager.prototype.dispose = function()
{
	//var libraries = ["images", "videos", "audio", "fonts", "materials", "textures", "geometries", "resources", "shapes", "skeletons"];

	for(var i in this.geometries)
	{
		this.geometries[i].dispose();
	}

	for(var i in this.textures)
	{
		this.textures[i].dispose();
	}

	for(var i in this.materials)
	{
		this.materials[i].dispose();
	}
};

/**
 * Remove geometry from the list and replace by other.
 * 
 * @method removeGeometry
 * @param {Resource} geometry
 */
ResourceManager.prototype.removeGeometry = function(geometry, defaultGeometry)
{
	this.traverse(function(child)
	{
		if(child.geometry !== undefined && child.geometry.uuid === geometry.uuid)
		{
			child.geometry = defaultGeometry;
		}
	});

	delete this.geometries[geometry.uuid];
};

/**
 * Get resource by name.
 * 
 * @method getResourceByName
 * @param {String} name Resource name
 * @return {Resource} Resource if found else null
 */
ResourceManager.prototype.getResourceByName = function(name)
{
	for(var i in this.resources)
	{
		if(this.resources[i].name === name)
		{
			return this.resources[i];
		}
	}

	console.warn("nunuStudio: Resource " + name + " not found");
	return null;
};

/**
 * Add resource to resources manager.
 * 
 * @method addResource
 * @param {Resource} Resource to add.
 */
ResourceManager.prototype.addResource = function(resource)
{
	if(resource instanceof Resource)
	{
		this.resources[resource.uuid] = resource;
	}
}

/**
 * Remove resource from font list.
 * 
 * @method removeResource
 * @param {Resource} resource
 */
ResourceManager.prototype.removeResource = function(resource)
{
	delete this.resources[resource.uuid];
};

/**
 * Get image by name.
 * 
 * @method getImageByName
 * @param {String} name Image name
 * @return {Image} Image if found else null
 */
ResourceManager.prototype.getImageByName = function(name)
{
	for(var i in this.images)
	{
		if(this.images[i].name === name)
		{
			return this.images[i];
		}
	}

	console.warn("nunuStudio: Resource " + name + " not found");
	return null;
};

/**
 * Remove image.
 * 
 * @param {Image} image
 * @method removeImage
 */
ResourceManager.prototype.removeImage = function(image)
{
	if(image instanceof Image)
	{
		delete this.images[image.uuid];
	}
};


/**
 * Get video by name.
 * 
 * @method getVideoByName
 * @param {String} name Video name
 * @return {Video} Video if found else null
 */
ResourceManager.prototype.getVideoByName = function(name)
{
	for(var i in this.videos)
	{
		if(this.videos[i].name === name)
		{
			return this.videos[i];
		}
	}

	console.warn("nunuStudio: Resource " + name + " not found");
	return null;
};

/**
 * Remove video.
 * 
 * @param {Video} video
 * @method removeVideo
 */
ResourceManager.prototype.removeVideo = function(video)
{
	if(video instanceof Video)
	{
		delete this.videos[video.uuid];
	}
};

/**
 * Get material by its name.
 * 
 * @method getMaterialByName
 * @param {String} name Material name
 * @return {Material} Material if found else null
 */
ResourceManager.prototype.getMaterialByName = function(name)
{
	for(var i in this.materials)
	{
		if(this.materials[i].name === name)
		{
			return this.materials[i];
		}
	}

	console.warn("nunuStudio: Resource " + name + " not found");
	return null;
};

/**
 * Add material to materials list.
 * 
 * @method addMaterial
 * @param {Material} material Material to be added
 */
ResourceManager.prototype.addMaterial = function(material)
{
	if(material instanceof THREE.Material)
	{
 		this.materials[material.uuid] = material;
 	}
};

/**
 * Remove material from materials list, also receives default material used to replace.
 * 
 * @method removeMaterial
 * @param {Material} material Material to be removed from manager.
 * @param {Material} defaultMeshMaterial Default mesh material to replace objects mesh materials.
 * @param {Material} defaultSpriteMaterial Defaul sprite material.
 */
ResourceManager.prototype.removeMaterial = function(material, defaultMeshMaterial, defaultSpriteMaterial)
{
	if(defaultMeshMaterial === undefined)
	{
		defaultMeshMaterial = new THREE.MeshBasicMaterial();
	}

	if(defaultSpriteMaterial === undefined)
	{
		defaultSpriteMaterial = new THREE.SpriteMaterial();
	}

	if(material instanceof THREE.Material)
	{
		delete this.materials[material.uuid];
		
		this.traverse(function(child)
		{
			if(child.material !== undefined && child.material.uuid === material.uuid)
			{
				if(child instanceof THREE.Sprite)
				{
					child.material = defaultSpriteMaterial;
				}
				else
				{
					child.material = defaultMeshMaterial;
				}
			}
		});
	}
};

/**
 * Get texture by name.
 * 
 * @method getTextureByName
 * @param {String} name Texture name.
 * @return {Texture} Texture is found else null.
 */
ResourceManager.prototype.getTextureByName = function(name)
{
	for(var i in this.textures)
	{
		if(this.textures[i].name === name)
		{
			return this.textures[i];
		}
	}

	console.warn("nunuStudio: Resource " + name + " not found");
	return null;
};

/**
 * Add texture to texture list.
 * 
 * @method addTexture
 * @param {Texture} texture
 */
ResourceManager.prototype.addTexture = function(texture)
{
	if(material instanceof THREE.Texture)
	{
 		this.textures[texture.uuid] = texture;
	}
};

/**
 * Remove texture from textures list (also receives default used to replace).
 * 
 * @method removeTexture
 * @param {Texture} texture
 * @param {Texture} defaultTexture
 * @return {Texture} Texture if found, else null
 */
ResourceManager.prototype.removeTexture = function(texture, defaultTexture)
{
	if(defaultTexture === undefined)
	{
		defaultTexture = new THREE.Texture();
	}

	if(texture instanceof THREE.Texture)
	{
		delete this.textures[texture.uuid];
		
		this.traverse(function(child)
		{
			if(child.material !== undefined)
			{
				var material = child.material;
				
				if(material.map != null && material.map.uuid === texture.uuid)
				{
					material.map = defaultTexture;
					material.needsUpdate = true;
				}
				if(material.bumpMap != null && material.bumpMap.uuid === texture.uuid)
				{
					material.bumpMap = defaultTexture;
					material.needsUpdate = true;
				}
				if(material.normalMap != null && material.normalMap.uuid === texture.uuid)
				{
					material.normalMap = defaultTexture;
					material.needsUpdate = true;
				}
				if(material.displacementMap != null && material.displacementMap.uuid === texture.uuid)
				{
					material.displacementMap = defaultTexture;
					material.needsUpdate = true;
				}
				if(material.specularMap != null && material.specularMap.uuid === texture.uuid)
				{
					material.specularMap = defaultTexture;
					material.needsUpdate = true;
				}
				if(material.emissiveMap != null && material.emissiveMap.uuid === texture.uuid)
				{
					material.emissiveMap = defaultTexture;
					material.needsUpdate = true;
				}
				if(material.alphaMap != null && material.alphaMap.uuid === texture.uuid)
				{
					material.alphaMap = defaultTexture;
					material.needsUpdate = true;
				}
				if(material.roughnessMap != null && material.roughnessMap.uuid === texture.uuid)
				{
					material.roughnessMap = defaultTexture;
					material.needsUpdate = true;
				}
				if(material.metalnessMap != null && material.metalnessMap.uuid === texture.uuid)
				{
					material.metalnessMap = defaultTexture;
					material.needsUpdate = true;
				}
				if(material.envMap != null && material.envMap.uuid === texture.uuid)
				{
					material.envMap = null;
					material.needsUpdate = true;
				}
			}
			else if(child instanceof ParticleEmitter)
			{
				if(child.group.texture.uuid === texture.uuid)
				{
					child.group.texture = defaultTexture;
				}
			}
		});
	}
};

/**
 * Get font by name.
 * 
 * @method getFontByName
 * @param {String} name
 * @return {Font} Font if found, else null
 */
ResourceManager.prototype.getFontByName = function(name)
{
	for(var i in this.fonts)
	{
		if(this.fonts[i].name === name)
		{
			return this.fonts[i];
		}
	}

	console.warn("nunuStudio: Resource " + name + " not found");
	return null;
};

/**
 * Add font to fonts list.
 * 
 * @method addFont
 * @param {Font} font
 */
ResourceManager.prototype.addFont = function(font)
{
	if(font instanceof Font)
	{
 		this.fonts[font.uuid] = font;
 	}
}

/**
 * Remove font from font list.
 * 
 * @method removeFont
 * @param {Font} font
 * @param {Font} defaultFont
 */
ResourceManager.prototype.removeFont = function(font, defaultFont)
{
	if(defaultFont === undefined)
	{
		defaultFont = new Font();
	}

	if(font instanceof Font)
	{
		delete this.fonts[font.uuid];
		
		this.traverse(function(child)
		{
			if(child.font !== undefined && child.font.uuid === font.uuid)
			{
				child.setFont(defaultFont);
			}
		});
	}
};

/**
 * Get audio by name.
 * 
 * @method getAudioByName
 * @param {String} name
 * @return {Audio} Audio if found, else null
 */
ResourceManager.prototype.getAudioByName = function(name)
{
	for(var i in this.audio)
	{
		if(this.audio[i].name === name)
		{
			return this.audio[i];
		}
	}

	console.warn("nunuStudio: Resource " + name + " not found");
	return null;
};

/**
 * Add audio to audio list.
 * 
 * @param {Audio} audio
 * @method addAudio
 */
ResourceManager.prototype.addAudio = function(audio)
{
	if(audio instanceof Audio)
	{
 		this.audio[audio.uuid] = audio;
 	}
};

/**
 * Remove audio resource from the manager, replace on objects that are using it with another resource.
 * 
 * @param {Audio} audio
 * @param {Audio} defaultAudio
 * @method removeAudio
 */
ResourceManager.prototype.removeAudio = function(audio, defaultAudio)
{
	if(defaultAudio === undefined)
	{
		defaultAudio = new Audio();
	}

	if(audio instanceof Audio)
	{
		delete this.audio[audio.uuid];
		
		this.traverse(function(child)
		{
			if(child.audio !== undefined && child.audio.uuid === audio.uuid)
			{
				child.setAudio(defaultAudio);
			}
		});
	}
};
