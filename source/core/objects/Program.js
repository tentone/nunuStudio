"use strict";

//Program constructor
function Program(name)
{
	THREE.Object3D.call(this);

	this.type = "Program";

	//Disable matrix auto update
	this.matrixAutoUpdate = false;

	//Pointer to nunu app
	this.app = null;

	//Program Info
	this.name = (name !== undefined) ? name : "program";
	this.description = "";
	this.author = "";
	this.version = "0";

	//Hardware flags
	this.lock_pointer = false;
	
	//VR flags
	this.vr = false;
	this.vr_scale = 1;

	//Render quality
	this.antialiasing = false;
	this.shadows = true;
	this.shadows_type = THREE.PCFSoftShadowMap;

	//Resources
	this.images = [];
	this.videos = [];
	this.audio = [];
	this.fonts = [];
	this.materials = [];
	this.textures = [];
	this.geometries = [];

	//Default value
	this.default_scene = null;
	this.default_camera = null;

	//Runtime variables
	this.scene = null;
	this.renderer = null;
	this.canvas = null;
}

Program.prototype = Object.create(THREE.Object3D.prototype);

//Select initial scene and initialize that scene
Program.prototype.initialize = function()
{
	//Get canvas from renderer
	this.canvas = this.renderer.domElement;
	
	//Get default scene
	if(this.default_scene !== null)
	{
		for(var i = 0; i < this.children.length; i++)
		{
			if(this.children[i].uuid === this.default_scene)
			{
				this.setScene(this.children[i]);
				break;
			}
		}
	}
	else if(this.children.length > 0)
	{
		this.setScene(this.children[0]);
	}

	//Set mouse lock
	if(this.lock_pointer)
	{
		Mouse.setLock(true);
		
		//TODO <ADD EVENT TO LOCK MOUSE WHEN CANVAS IS CLICKED>
		//this.canvas.addEventListener("click", function(){Mouse.setLock(true);}, false);
	}
}

//Update program
Program.prototype.update = function()
{
	this.scene.update();
}

//Render program (renderer passed as argument)
Program.prototype.render = function(renderer)
{
	var x = renderer.domElement.width;
	var y = renderer.domElement.height;

	renderer.setScissorTest(true);

	for(var i = 0; i < this.scene.cameras.length; i++)
	{
		var camera = this.scene.cameras[i];

		if(camera.clear_color)
		{
			renderer.clearColor();
		}
		if(camera.clear_depth)
		{
			renderer.clearDepth();
		}

		renderer.setViewport(x * camera.offset.x, y * camera.offset.y, x * camera.viewport.x, y * camera.viewport.y);
		renderer.setScissor(x * camera.offset.x, y * camera.offset.y, x * camera.viewport.x, y * camera.viewport.y);

		renderer.render(this.scene, camera);
	}

	renderer.setScissorTest(false);
}

//Resize program cameras
Program.prototype.resize = function(x, y)
{
	//Resize cameras
	for(var i = 0; i < this.scene.cameras.length; i++)
	{
		this.scene.cameras[i].aspect = x / y;
		this.scene.cameras[i].updateProjectionMatrix();
	}

	//Resize scripts
	this.traverse(function(child)
	{
		if(child instanceof Script)
		{
			child.resize();
		}
	});
}

//Set actual scene (to be used in runtime)
Program.prototype.setScene = function(scene)
{
	if(scene instanceof Scene)
	{
		this.scene = scene;
	}
	else if(typeof scene === "string")
	{
		this.scene = this.getObjectByName(scene);
	}

	if(this.scene !== null)
	{
		this.scene.initialize();

		if(this.scene.cameras.length === 0)
		{
			this.scene.cameras.push(this.default_camera);
		}
	}
}

//Remove Scene from program
Program.prototype.remove = function(scene)
{
	var index = this.children.indexOf(scene);
	if(index > -1)
	{
		this.children.splice(index, 1);
		scene.parent = null;
	}

	//If no scene on program set actual scene to null
	if(this.children.length === 0)
	{
		this.scene = null;
	}
}

//Add children to program (only allows Scenes to be added)
Program.prototype.add = function(scene)
{
	if(scene instanceof Scene)
	{
		this.children.push(scene);
		scene.parent = this;

		//If first scene set as actual scene
		if(this.children.length === 1)
		{
			this.scene = this.children[0];
		}
	}
}

//Clone program (keep uuid and everything else)
Program.prototype.clone = function()
{
	return new ObjectLoader().parse(this.toJSON());
}

//Set as initial scene (from uuid reference)
Program.prototype.setInitialScene = function(scene)
{
	this.default_scene = scene.uuid;
}

//Create a default scene with sky
Program.prototype.addDefaultScene = function(material)
{
	if(material === undefined)
	{
		material = new THREE.MeshStandardMaterial({roughness: 0.6, metalness: 0.2});
		material.name = "default";
	}

	//Create new scene
	var scene = new Scene();

	//Sky
	var sky = new Sky();
	sky.auto_update = false;
	scene.add(sky);

	//Box
	var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
	var model = new Mesh(geometry, material);
	model.receiveShadow = true;
	model.castShadow = true;
	model.name = "box";
	scene.add(model);

	//Floor
	model = new Mesh(geometry, material);
	model.scale.set(20, 1, 20);
 	model.position.set(0, -1.0, 0);
	model.receiveShadow = true;
	model.castShadow = true;
	model.name = "ground";
	scene.add(model);

	//Add scene to program
	this.add(scene);
}

//Dispose program data
Program.prototype.dispose = function()
{
	//Materials
	for(var i = 0; i < this.materials.length; i++)
	{
		this.materials[i].dispose();
	}

	//Textures
	for(var i = 0; i < this.textures.length; i++)
	{
		this.textures[i].dispose();
	}

	//Children objects
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}

//Communicate
Program.prototype.sendDataApp = function(data)
{
	if(this.app !== null)
	{
		if(this.app.onDataReceived !== undefined)
		{
			this.app.onDataReceived(data);
		}
		else
		{
			console.warn("nunuStudio: App data communication", data);
		}
	}
	else
	{
		if(typeof data === "object")
		{
			alert(JSON.stringify(data));
		}
		else
		{
			alert(data);
		}
	}
}

//Get material by name
Program.prototype.getMaterialByName = function(name)
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
Program.prototype.addMaterial = function(material)
{
	if(material instanceof THREE.Material)
	{
 		this.materials[material.uuid] = material;
 	}
}

//Remove material from materials list (also receives default used to replace)
Program.prototype.removeMaterial = function(material, default_material, default_material_sprite)
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

//Get texture by name
Program.prototype.getTextureByName = function(name)
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
Program.prototype.addTexture = function(texture)
{
 	this.textures[texture.uuid] = texture;
}

//Remove texture from textures list (also receives default used to replace)
Program.prototype.removeTexture = function(texture, default_texture)
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

//Get font by name
Program.prototype.getFontByName = function(name)
{
	for(var i in this.fonts)
	{
		if(this.fonts[i].name === name)
		{
			return this.fonts[i];
		}
	}

	return null;
}

//Add font to fonts list
Program.prototype.addFont = function(font)
{
	if(font instanceof Font)
	{
 		this.fonts[font.uuid] = font;
 	}
}

//Remove font from font list
Program.prototype.removeFont = function(font, default_font)
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

//Get audio by name
Program.prototype.getAudioByName = function(name)
{
	for(var i in this.audio)
	{
		if(this.audio[i].name === name)
		{
			return this.audio[i];
		}
	}

	return null;
}

//Add audio to audio list
Program.prototype.addAudio = function(audio)
{
	if(audio instanceof Audio)
	{
 		this.audio[audio.uuid] = audio;
 	}
}

//Remove audio
Program.prototype.removeAudio = function(audio, default_audio)
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

//Create JSON for object
Program.prototype.toJSON = function(meta, export_resources)
{
	var self = this;

	var data = THREE.Object3D.prototype.toJSON.call(this, meta, function(meta, object)
	{
		if(export_resources !== false)
		{
			//Textures
			var textures = self.textures;
			for(var i in textures)
			{
				var texture = textures[i];
				if(meta.textures[texture.uuid] === undefined)
				{
					meta.textures[texture.uuid] = texture.toJSON(meta);
				}
			}

			//Materials
			var materials = self.materials;
			for(var i in materials)
			{
				var material = materials[i];
				if(meta.materials[material.uuid] === undefined)
				{
					meta.materials[material.uuid] = material.toJSON(meta);
				}
			}

			//Fonts
			var fonts = self.fonts;
			for(var i in fonts)
			{
				var font = fonts[i];
				if(meta.fonts[font.uuid] === undefined)
				{
					meta.fonts[font.uuid] = font.toJSON(meta);
				}
			}

			//Audio
			var audio = self.audio;
			for(var i in audio)
			{
				var aud = audio[i];
				if(meta.audio[aud.uuid] === undefined)
				{
					meta.audio[aud.uuid] = aud.toJSON(meta);
				}
			}
		}
	});

	//Initial scene
	if(this.default_scene !== null)
	{
		data.object.default_scene = this.default_scene;
	}

	//Information
	data.object.author = this.author;
	data.object.description = this.description;
	data.object.version = this.version;

	//Misc
	data.object.lock_pointer = this.lock_pointer;

	//VR
	data.object.vr = this.vr;
	data.object.vr_scale = this.vr_scale;

	//Rendering
	data.object.antialiasing = this.antialiasing;
	data.object.shadows = this.shadows;
	data.object.shadows_type = this.shadows_type;

	return data;
}