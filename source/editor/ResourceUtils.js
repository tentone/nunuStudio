"use strict";

/**
 * Resource utils contains multiple tools to manipulate data in the resource manager on the editor.
 *
 * @static
 * @class ResourceUtils
 */
function ResourceUtils(){}

/**
 * Auxiliar method to traverse any type of JS object in depth.
 *
 * Is called recursively for every Array or Object found, the callback receives the (value, parent, attribute) as parameters.
 *
 * If the callback method returns false it does not traverse the object.
 * 
 * @static
 * @method traverseDeep
 * @param {Object} object Object to be traversed.
 * @param {Function} callback Callback to process every attribute from the object.
 */
ResourceUtils.traverseDeep = function(object, callback)
{
	if(callback === undefined)
	{
		return;
	}

	for(var i in object)
	{
		var value = object[i];

		if((value instanceof Array || value instanceof Object) && !(value instanceof Function))
		{
			if(callback(value, object, i) !== false)
			{
				traverseDeep(value, callback);
			}
		}
		else
		{
			callback(value, object, i);
		}
	}
};

/**
 * Swap a resource from the program, changes the resource in the manager.
 *
 * Searches and replaces all usages of the old resource.
 *
 * @static
 * @method swapResource
 * @param {ResourceManager} manager Resource manage with program.
 * @param {String} category Name of the resource category.
 * @param {Resource} oldResource Old resource being replaced.
 * @param {Resource} newResource New resource used to replace the old one.
 */
ResourceUtils.swapResource = function(manager, category, oldResource, newResource)
{	
	if(manager[category][oldResource.uuid] === undefined)
	{
		throw new Error("Old resource not found in the resource manager.");
	}
	
	// Swap resource in the manager
	delete manager[category][oldResource.uuid];
	manager[category][newResource.uuid] = newResource;

	// Replace all instances found
	ResourceUtils.traverseDeep(manager, function(value, object, attribute)
	{
		if(value === oldResource)
		{
			object[attribute] = newResource;
		}

		return false;
	});
};

/**
 * Remove all duplicate resources from object.
 *
 * @static
 * @method removeDuplicated
 */
ResourceUtils.removeDuplicated = function(object)
{
	// Check if two resources are similar
	function areEqual(a, b)
	{
		//TODO <ADD CODE HERE>
	}

	var textures = [];
	var materials = [];

	// Fetch resources to be optimized
	ResourceUtils.traverseDeep(object, function(value)
	{
		if(value instanceof THREE.Texture)
		{

		}
		else if(value instanceof THREE.Materials)
		{

		}
	});

};

/**
 * Add resource (of any type) to category.
 *
 * @static
 * @method addResource
 * @param {ResourceManager} manager
 * @param {Resource} resource
 * @param {String} category
 */
ResourceUtils.addResource = function(manager, resource, category)
{
	manager[category][resource.uuid] = resource;
};

/**
 * Remove resource of any type from category.
 *
 * If any resource needs replacement in an object is uses the default scene resources.
 *
 * @static
 * @method removeResource
 * @param {ResourceManager} manager
 * @param {Resource} resource
 * @param {String} category
 */ 
ResourceUtils.removeResource = function(manager, resource, category)
{
	if(category === "materials")
	{
		manager.removeMaterial(resource, Editor.defaultMaterial, Editor.defaultSpriteMaterial);
	}
	else if(category === "textures")
	{
		manager.removeTexture(resource, Editor.defaultTexture);
	}
	else if(category === "fonts")
	{
		manager.removeFont(resource, Editor.defaultFont);
	}
	else if(category === "audio")
	{
		manager.removeAudio(resource, Editor.defaultAudio);
	}
	else if(category === "geometries")
	{
		manager.removeGeometry(resource, Editor.defaultGeometry);
	}
	else
	{
		if(manager[category] !== undefined && manager[category][resource.uuid] !== undefined)
		{
			delete manager[category][resource.uuid];
		}
	}
};

/**
 * Get a resource from any category by its name, only returns the first resource found.
 *
 * @static
 * @param {ResourceManager} manager
 * @param {String} name
 */
ResourceUtils.getResourceByName = function(manager, name)
{
	for(var category in manager)
	{
		for(var resources in category)
		{
			if(resources[i].name === name)
			{
				return resources[i];
			}
		}
	}

	return null;
};

/**
 * Searches the object and all its children for resources that still dont exist in the resource manager.
 *
 * Stores them in a resource container object that is returned.
 *
 * @static
 * @method searchObject
 * @param {THREE.Object3D} object Object to search for resources.
 * @param {ResourceManager} manager Resource manager object.
 * @param {ResourceContainer} target Optional resource container object that can be used to store the found resources.
 * @return {ResourceContainer} Object with the new resources found in the object.
 */
ResourceUtils.searchObject = function(object, manager, target)
{
	var resources;

	if(target !== undefined)
	{
		resources = target;
	}
	else
	{
		resources = new ResourceManager.ResourceContainer();
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
				resources.fonts[child.font.uuid] = child.font;
			}
		}

		//Audio
		if(child.audio instanceof Audio)
		{
			if(manager.audio[child.audio.uuid] === undefined)
			{
				resources.audio[child.audio.uuid] = child.audio;
			}
		}

		//Material/textures
		if(child.material !== undefined && !(child instanceof TextBitmap || child instanceof TextSprite ||child instanceof LensFlare || child instanceof ParticleEmitter || child instanceof Sky || child instanceof SpineAnimation))
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
		if((child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) && !(child instanceof TextBitmap))
		{
			if(child.geometry instanceof THREE.BufferGeometry || child.geometry instanceof THREE.Geometry)
			{
				if(manager.geometries[child.geometry.uuid] === undefined)
				{
					resources.geometries[child.geometry.uuid] = child.geometry;
				}			
			}
		}

		//Textures
		if(child.texture !== undefined && !(child instanceof TextSprite))
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
			resources.materials[material.uuid] = material;
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
				resources.textures[texture.uuid] = texture;	
			}
		}
	}

	function addImage(image)
	{
		if(manager.images[image.uuid] === undefined)
		{
			resources.images[image.uuid] = image;
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
				resources.videos[texture.video.uuid] = texture.video;
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

	return resources;
};