"use strict";

function ObjectUtils(){}

//Get all fonts in object and childs
ObjectUtils.getFonts = function(obj, fonts)
{
	if(fonts === undefined)
	{
		fonts = [];
	}
		
	obj.traverse(function(child)
	{
		if(child.font instanceof Font)
		{
			if(fonts[child.font.uuid] === undefined)
			{
				fonts[child.font.uuid] = child.font;
			}
		}
	});

	return fonts;
}

//Get all audio files in object and childs
ObjectUtils.getAudio = function(obj, audio)
{
	if(audio === undefined)
	{
		audio = [];
	}
		
	obj.traverse(function(child)
	{
		if(child.audio instanceof Audio)
		{
			if(audio[child.audio.uuid] === undefined)
			{
				audio[child.audio.uuid] = child.audio;
			}
		}
	});

	return audio;
}


//Get all materials in object and childs
ObjectUtils.getMaterials = function(obj, materials)
{
	//Auxiliar function to add materials
	function add(material)
	{
		if(materials[material.uuid] === undefined)
		{
			materials[material.uuid] = material;
		}
	}

	//If undefined create new array to store materials
	if(materials === undefined)
	{
		materials = [];
	}

	//Transverse obj children
	obj.traverse(function(child)
	{
		//Check if child has material
		if(!(child.material === undefined || child.hidden || child instanceof ParticleEmitter || child instanceof Sky || child instanceof SpineAnimation))
		{
			if(child.material instanceof THREE.Material)
			{
				add(child.material);
			}
			else if(child.material instanceof THREE.MultiMaterial)
			{
				var array = child.material.materials;
				for(var j = 0; j < array.length; j++)
				{
					add(array[j]);
				}
			}

			if(child.materials !== undefined)
			{
				for(var j = 0; j < child.materials.length; j++)
				{
					add(child.materials[j]);
				}
			}
		}
	});

	return materials;
}

//Get all textures in object and childs
ObjectUtils.getTextures = function(obj, textures)
{
	//Get textures from material
	function addFromMaterial(material)
	{
		add(material.map);
		add(material.bumpMap);
		add(material.normalMap);
		add(material.displacementMap);
		add(material.specularMap);
		add(material.emissiveMap);
		add(material.alphaMap);
		add(material.roughnessMap);
		add(material.metalnessMap);
	}

	//Auxiliar function to add textures
	function add(texture)
	{
		if(texture != null)
		{
			if(textures[texture.uuid] === undefined)
			{
				textures[texture.uuid] = texture;
			}
		}
	}

	//If undefined create new array to store materials
	if(textures === undefined)
	{
		textures = [];
	}

	//Add textures from children
	obj.traverse(function(child)
	{
		if(child.material !== undefined)
		{
			if(child.material instanceof THREE.Material)
			{
				addFromMaterial(child.material);
			}
			else if(child.material instanceof THREE.MultiMaterial)
			{
				var array = child.material.materials;
				for(var j = 0; j < array.length; j++)
				{
					addFromMaterial(array[j]);
				}
			}
		}
		if(child.texture !== undefined)
		{
			add(child.texture);
		}
	});

	return textures;
}

//Get object scene
ObjectUtils.getScene = function(obj)
{
	var node = obj;

	while(node.parent !== null)
	{
		node = node.parent;
		if(node instanceof Scene)
		{
			return node;
		}
	}

	return null;
}

//Get object tree root
ObjectUtils.getRoot = function(obj)
{
	var node = obj;
	
	while(node.parent !== null)
	{
		node = node.parent;
	}

	return node;
}

//Set matrix auto update value
ObjectUtils.setMatrixAutoUpdate = function(obj, value)
{
	obj.matrixAutoUpdate = value;

	obj.traverse(function(child)
	{
		child.matrixAutoUpdate = value;
	});
}

//Set shadow receiving
ObjectUtils.setShadowReceiving = function(obj, value)
{
	obj.receiveShadow = value;

	obj.traverse(function(child)
	{
		child.receiveShadow = value;
	});
}

//Set shadow casting
ObjectUtils.setShadowCasting = function(obj, value)
{
	obj.castShadow = value;
	
	obj.traverse(function(child)
	{
		child.castShadow = value;
	});
}

//Check if object is child of another object
ObjectUtils.isChildOf = function(parent, child)
{
	for(var i = 0; i < parent.children.length; i++)
	{
		if(parent.children[i] === child || ObjectUtils.isChildOf(parent.children[i], child))
		{
			return true;
		}
	}
	return false;
}
