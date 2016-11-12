"use strict";

//Resource manager is used to keep a list of resources
function ResourceManager()
{
	//Global resource list
	this.images = [];
	this.videos = [];
	this.audio = [];
	this.fonts = [];
	this.materials = [];
	this.textures = [];
	this.geometries = [];
	this.files = [];
}

//Get material by name
ResourceManager.prototype.getMaterialByName = function(name)
{
	for(var i in this.materials)
	{
		if(this.materials[i].name === name)
		{
			return this.materials[i];
		}
	}

	return null;
}

//Add material to materials list
ResourceManager.prototype.addMaterial = function(material)
{
	if(material instanceof THREE.Material)
	{
 		this.materials[material.uuid] = material;
 	}
}

//Remove material from materials list (also receives default used to replace)
ResourceManager.prototype.removeMaterial = function(material, default_material, default_material_sprite)
{
	if(default_material === undefined)
	{
		default_material = new THREE.MeshBasicMaterial();
	}

	if(default_material_sprite === undefined)
	{
		default_material_sprite = new THREE.SpriteMaterial();
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
					child.material = default_material_sprite;
				}
				else
				{
					child.material = default_material;
				}
			}
		});
	}
}

//Get material by name
ResourceManager.prototype.getTextureByName = function(name)
{
	for(var i in this.textures)
	{
		if(this.textures[i].name === name)
		{
			return this.textures[i];
		}
	}

	return null;
}

//Add texture to texture list
ResourceManager.prototype.addTexture = function(texture)
{
 	this.textures[texture.uuid] = texture;
}

//Remove texture from textures list (also receives default used to replace)
ResourceManager.prototype.removeTexture = function(texture, default_texture)
{
	if(default_texture === undefined)
	{
		default_texture = new THREE.Texture();
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
					material.map = default_texture;
					material.needsUpdate = true;
				}
				else if(material.bumpMap != null && material.bumpMap.uuid === texture.uuid)
				{
					material.bumpMap = default_texture;
					material.needsUpdate = true;
				}
				else if(material.normalMap != null && material.normalMap.uuid === texture.uuid)
				{
					material.normalMap = default_texture;
					material.needsUpdate = true;
				}
				else if(material.displacementMap != null && material.displacementMap.uuid === texture.uuid)
				{
					material.displacementMap = default_texture;
					material.needsUpdate = true;
				}
				else if(material.specularMap != null && material.specularMap.uuid === texture.uuid)
				{
					material.specularMap = default_texture;
					material.needsUpdate = true;
				}
				else if(material.emissiveMap != null && material.emissiveMap.uuid === texture.uuid)
				{
					material.emissiveMap = default_texture;
					material.needsUpdate = true;
				}
				else if(material.alphaMap != null && material.alphaMap.uuid === texture.uuid)
				{
					material.alphaMap = default_texture;
					material.needsUpdate = true;
				}
				else if(material.roughnessMap != null && material.roughnessMap.uuid === texture.uuid)
				{
					material.roughnessMap = default_texture;
					material.needsUpdate = true;
				}
				else if(material.metalnessMap != null && material.metalnessMap.uuid === texture.uuid)
				{
					material.metalnessMap = default_texture;
					material.needsUpdate = true;
				}
			}
			else if(child instanceof ParticleEmitter)
			{
				if(child.group.texture.uuid === texture.uuid)
				{
					child.group.texture = default_texture;
				}
			}
		});
	}
}

//Add font to fonts list
ResourceManager.prototype.addFont = function(font)
{
	if(font instanceof Font)
	{
 		this.fonts[font.uuid] = font;
 	}
}

//Remove font from font list
ResourceManager.prototype.removeFont = function(font, default_font)
{
	if(default_font === undefined)
	{
		default_font = new Font();
	}

	if(font instanceof Font)
	{
		delete this.fonts[font.uuid];
		
		this.traverse(function(child)
		{
			if(child.font !== undefined && child.font.uuid === font.uuid)
			{
				child.setFont(default_font);
			}
		});
	}
}

//Add audio to audio list
ResourceManager.prototype.addAudio = function(audio)
{
	if(audio instanceof Audio)
	{
 		this.audio[audio.uuid] = audio;
 	}
}

//Remove audio
ResourceManager.prototype.removeAudio = function(audio, default_audio)
{
	if(default_audio === undefined)
	{
		default_audio = new Audio();
	}

	if(audio instanceof Audio)
	{
		delete this.audio[audio.uuid];
		
		this.traverse(function(child)
		{
			if(child.audio !== undefined && child.audio.uuid === audio.uuid)
			{
				child.setFont(default_audio);
			}
		});
	}
}
