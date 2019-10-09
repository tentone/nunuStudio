"use strict";

/**
 * Resource utils contains multiple tools to manipulate data in the resource manager on the editor.
 *
 * @static
 * @class ResourceUtils
 */
function ResourceUtils(){}

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