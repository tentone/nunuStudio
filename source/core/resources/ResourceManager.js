"use strict";

/**
 * Resource manager is used to manage available resources used by objects
 * 
 * The resource manager is used to extend the Program object and is not designed to be used as a standalone
 * 
 * The manager is used to manage the following types of resources:
 *  - Images
 *  - Videos
 *  - Audio
 *  - Fonts
 *  - Textures
 *  - Materials
 *  - Geometries
 *
 * @class ResourceManager
 * @module Resources
 * @extends {Object3D}
 */
function ResourceManager()
{
	THREE.Object3D.call(this);
	/**
	 * Images.
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
}

ResourceManager.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Retrieve a list with all the resource in a object.
 *
 * Searches the object and all its children for resource and adds them to resource manager.
 *
 * @static
 * @method retrieveResources
 * @param {THREE.Object3D} object Object to search for resources.
 * @param {ResourceManager} manager Resource manager.
 */
ResourceManager.retrieveResources = function(object, manager)
{
	if(manager === undefined)
	{
		manager = object;
	}

	object.traverse(function(child)
	{
		if(child.locked)
		{
			return;
		}

		//Fonts
		if(child.font instanceof Font)
		{
			if(manager.fonts[child.font.uuid] === undefined)
			{
				manager.fonts[child.font.uuid] = child.font;
			}
		}

		//Audio
		if(child.audio instanceof Audio)
		{
			if(manager.audio[child.audio.uuid] === undefined)
			{
				manager.audio[child.audio.uuid] = child.audio;
			}
		}

		//Material/textures
		if(child.material !== undefined && !(child instanceof LensFlare || child instanceof ParticleEmitter || child instanceof Sky || child instanceof SpineAnimation))
		{
			if(child.material instanceof THREE.Material)
			{
				addMaterial(child.material);
			}
			else if(child.material instanceof Array)
			{
				for(var j = 0; j < child.material.length; j++)
				{
					addMaterial(child.material[j]);
				}
			}
			else if(child.materials instanceof Array)
			{
				for(var j = 0; j < child.materials.length; j++)
				{
					addMaterial(child.materials[j]);
				}
			}
			else if(child.material instanceof THREE.MultiMaterial)
			{
				var materials = child.material.materials;
				for(var j = 0; j < materials.length; j++)
				{
					addMaterial(materials[j]);
				}
			}
		}

		//Geometries
		if(child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh)
		{
			if(child.geometry.type === "BufferGeometry" || child.geometry.type === "Geometry")
			{
				if(manager.geometries[child.geometry.uuid] === undefined)
				{
					manager.geometries[child.geometry.uuid] = child.geometry;
				}			
			}
		}

		//Textures
		if(child.texture !== undefined)
		{
			addTexture(child.texture);
		}
		if(child instanceof LensFlare)
		{
			for(var i = 0; i < child.elements.length; i++)
			{
				addTexture(child.elements[i].texture);
			}
		}

	});

	function addMaterial(material)
	{
		addTexturesFromMaterial(material);

		if(manager.materials[material.uuid] === undefined)
		{
			manager.materials[material.uuid] = material;
		}
	}

	function addTexturesFromMaterial(material)
	{
		addTexture(material.map);
		addTexture(material.bumpMap);
		addTexture(material.normalMap);
		addTexture(material.displacementMap);
		addTexture(material.specularMap);
		addTexture(material.emissiveMap);
		addTexture(material.alphaMap);
		addTexture(material.roughnessMap);
		addTexture(material.metalnessMap);
		addTexture(material.envMap);
	}

	function addTexture(texture)
	{
		if(texture !== null && texture !== undefined)
		{
			addResourcesTexture(texture);

			if(manager.textures[texture.uuid] === undefined)
			{
				manager.textures[texture.uuid] = texture;	
			}
		}
	}

	function addImage(image)
	{
		if(manager.images[image.uuid] === undefined)
		{
			manager.images[image.uuid] = image;
		}
	}


	function addResourcesTexture(texture)
	{
		//Image
		if(texture.img instanceof Image)
		{
			addImage(texture.img);
		}
		//Video
		if(texture.video instanceof Video)
		{
			if(manager.videos[texture.video.uuid] === undefined)
			{
				manager.videos[texture.video.uuid] = texture.video;
			}
		}
		//Images array
		if(texture.images !== undefined)
		{
			for(var i = 0; i < texture.images.length; i++)
			{
				addImage(texture.images[i]);
			}
		}
	}

	for(var i in manager.materials)
	{
		addTexturesFromMaterial(manager.materials[i]);
	}

	for(var i in manager.textures)
	{
		addResourcesTexture(manager.textures[i]);
	}
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
 * @param {Material} defaultMaterial Default mesh material to replace objects mesh materials.
 * @param {Material} defaultMaterialSprite Defaul sprite material.
 */
ResourceManager.prototype.removeMaterial = function(material, defaultMaterial, defaultMaterialSprite)
{
	if(defaultMaterial === undefined)
	{
		defaultMaterial = new THREE.MeshBasicMaterial();
	}

	if(defaultMaterialSprite === undefined)
	{
		defaultMaterialSprite = new THREE.SpriteMaterial();
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
					child.material = defaultMaterialSprite;
				}
				else
				{
					child.material = defaultMaterial;
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
 	this.textures[texture.uuid] = texture;
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
 * Remove audio.
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
