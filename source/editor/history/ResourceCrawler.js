import {Video} from "../../../core/resources/Video.js";
import {ResourceManager} from "../../../core/resources/ResourceManager.js";
import {ResourceContainer} from "../../../core/resources/ResourceContainer.js";
import {Resource} from "../../../core/resources/Resource.js";
import {Image} from "../../../core/resources/Image.js";
import {Font} from "../../../core/resources/Font.js";
import {Audio} from "../../../core/resources/Audio.js";
import {TextSprite} from "../../../core/objects/text/TextSprite.js";
import {TextBitmap} from "../../../core/objects/text/TextBitmap.js";
import {Sprite} from "../../../core/objects/sprite/Sprite.js";
import {SpineAnimation} from "../../../core/objects/spine/SpineAnimation.js";
import {ParticleEmitter} from "../../../core/objects/particle/ParticleEmitter.js";
import {Sky} from "../../../core/objects/misc/Sky.js";
import {LensFlare} from "../../../core/objects/misc/LensFlare.js";
import {Container} from "../../../core/objects/misc/Container.js";
import {Editor} from "../../Editor.js";
import {Text} from "../../components/Text.js";
import {Texture, Materials, Object3D, Material, MultiMaterial, Mesh, SkinnedMesh, BufferGeometry, Geometry} from "three";

/**
 * Resource utils contains multiple tools to manipulate data in the resource manager on the editor.
 *
 * @static
 * @class ResourceCrawler
 */
function ResourceCrawler(){}

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
ResourceCrawler.traverseDeep = function(object, callback)
{
	if(callback === undefined)
	{
		return;
	}

	for(var i in object)
	{
		var value = object[i];

		if(typeof value === "object")
		{
			if(callback(value, object, i) !== false)
			{
				ResourceCrawler.traverseDeep(value, callback);
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
 * @param {string} category Name of the resource category.
 * @param {Resource} oldResource Old resource being replaced.
 * @param {Resource} newResource New resource used to replace the old one.
 */
ResourceCrawler.swapResource = function(manager, category, oldResource, newResource)
{	
	if(manager[category][oldResource.uuid] === undefined)
	{
		throw new Error("Old resource not found in the resource manager.");
	}
	
	// Swap resource in the manager
	delete manager[category][oldResource.uuid];

	// Replace all instances found
	ResourceCrawler.traverseDeep(manager, function(value, object, attribute)
	{
		if(value === oldResource)
		{
			object[attribute] = newResource;
			return false;
		}

		return true;
	});

	manager[category][newResource.uuid] = newResource;
};

/**
 * Remove all duplicate resources from object.
 *
 * @static
 * @method removeDuplicated
 */
ResourceCrawler.removeDuplicated = function(object)
{
	// Check if two resources are similar
	function areEqual(a, b)
	{
		// TODO <ADD CODE HERE>
	}

	var textures = [];
	var materials = [];

	// Fetch resources to be optimized
	ResourceCrawler.traverseDeep(object, function(value)
	{
		if(value instanceof Texture)
		{

		}
		else if(value instanceof Materials)
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
 * @param {string} category
 */
ResourceCrawler.addResource = function(manager, resource, category)
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
 * @param {string} category
 */ 
ResourceCrawler.removeResource = function(manager, resource, category)
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
 * @param {string} name
 */
ResourceCrawler.getResourceByName = function(manager, name)
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
 * @param {Object3D} object Object to search for resources.
 * @param {ResourceManager} manager Resource manager object.
 * @param {ResourceContainer} target Optional resource container object that can be used to store the found resources.
 * @return {ResourceContainer} Object with the new resources found in the object.
 */
ResourceCrawler.searchObject = function(object, manager, target)
{
	var resources;

	if(target !== undefined)
	{
		resources = target;
	}
	else
	{
		resources = new ResourceContainer();
	}
	
	object.traverse(function(child)
	{
		if(child.locked)
		{
			return;
		}

		// Fonts
		if(child.font instanceof Font)
		{
			if(manager.fonts[child.font.uuid] === undefined)
			{
				resources.fonts[child.font.uuid] = child.font;
			}
		}

		// Audio
		if(child.audio instanceof Audio)
		{
			if(manager.audio[child.audio.uuid] === undefined)
			{
				resources.audio[child.audio.uuid] = child.audio;
			}
		}

		// Material/textures
		if(child.material !== undefined && !(child instanceof TextBitmap || child instanceof TextSprite ||child instanceof LensFlare || child instanceof ParticleEmitter || child instanceof Sky || child instanceof SpineAnimation))
		{
			if(child.material instanceof Material)
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
			else if(child.material instanceof MultiMaterial)
			{
				var materials = child.material.materials;
				for(var j = 0; j < materials.length; j++)
				{
					addMaterial(materials[j]);
				}
			}
		}

		// Geometries
		if((child instanceof Mesh || child instanceof SkinnedMesh) && !(child instanceof TextBitmap))
		{
			if(child.geometry instanceof BufferGeometry || child.geometry instanceof Geometry)
			{
				if(manager.geometries[child.geometry.uuid] === undefined)
				{
					resources.geometries[child.geometry.uuid] = child.geometry;
				}			
			}
		}

		// Textures
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
		// Image
		if(texture.source instanceof Image)
		{
			addImage(texture.source);
		}
		// Video
		if(texture.video instanceof Video)
		{
			if(manager.videos[texture.video.uuid] === undefined)
			{
				resources.videos[texture.video.uuid] = texture.video;
			}
		}
		// Images array
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
export {ResourceCrawler};