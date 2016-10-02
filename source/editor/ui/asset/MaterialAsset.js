"use strict";

function MaterialAsset(parent)
{
	Asset.call(this, parent);

	//Mateiral
	this.material = null;

	//Self pointer
	var self = this;

	//Use to store original material color on highlight
	this.material_color = new THREE.Color(0, 0, 0);
	this.material_highlighted = false;

	//Mouse over event
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.button_over_color;
		self.highlightMaterial();
	};

	//Mouse leave event
	this.element.onmouseleave = function()
	{
		this.style.backgroundColor = "";
		self.restoreMaterial();
	};

	//Double click
	this.element.ondblclick = function()
	{
		if(self.material instanceof THREE.Material)
		{
			//Check if there is already a tab with this material attached
			var found = false;
			for(var i = 0; i < Interface.tab.options.length; i++)
			{
				if(Interface.tab.options[i].component instanceof MaterialEditor)
				{
					if(Interface.tab.options[i].component.material === self.material)
					{
						found = true;
						Interface.tab.selectTab(i);
						break;
					}
				}
			}

			//If not found open new tab
			if(!found)
			{
				self.restoreMaterial();

				var tab = Interface.tab.addTab(self.material.name, Interface.file_dir + "icons/misc/material.png", true);
				var material_editor;

				if(self.material instanceof THREE.MeshPhongMaterial)
				{
					material_editor = new PhongMaterialEditor();
				}
				else if(self.material instanceof THREE.MeshBasicMaterial)
				{
					material_editor = new BasicMaterialEditor();
				}
				else if(self.material instanceof THREE.MeshStandardMaterial)
				{
					material_editor = new StandardMaterialEditor();
				}
				else if(self.material instanceof THREE.SpriteMaterial)
				{
					material_editor = new SpriteMaterialEditor();
				}
				else if(self.material instanceof THREE.ShaderMaterial)
				{
					material_editor = new ShaderMaterialEditor();
				}
				else
				{
					material_editor = new MaterialEditor();
				}

				material_editor.attachMaterial(self.material, self);
				tab.attachComponent(material_editor);
				tab.select();
			}
		}
	};

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX - 5, event.clientY - 5);
		
		context.addOption("Rename", function()
		{
			if(self.material !== null)
			{
				self.material.name = prompt("Rename material", self.material.name);
				self.updateMetadata();
			}
		});
		
		context.addOption("Delete", function()
		{
			if(self.material !== null)
			{
				if(confirm("Delete material?"))
				{
					Editor.program.removeMaterial(self.material, Editor.default_material, Editor.default_sprite_material);
					Editor.updateObjectViews();
				}
			}
		});

		context.addOption("Copy", function()
		{
			if(self.material !== null)
			{
				try
				{
					Editor.clipboard.set(JSON.stringify(self.material.toJSON()), "text");
				}
				catch(e){}
			}
		});

		context.addOption("Duplicate", function()
		{
			if(self.material !== null)
			{
				try
				{
					//Object loader
					var json = self.material.toJSON();
					var loader = new ObjectLoader();

					//Load images
					var images = loader.parseImages(json.images);
					for(var i = 0; i < images.length; i++)
					{
						images[i].uuid = THREE.Math.generateUUID();
					}

					//Load textures
					var textures = loader.parseTextures(json.textures, images);
					for(i = 0; i < textures.length; i++)
					{
						textures[i].uuid = THREE.Math.generateUUID();
					}

					//Load Material
					loader = new THREE.MaterialLoader();
					loader.setTextures(textures);
					var material = loader.parse(json); 
					material.uuid = THREE.Math.generateUUID();
					
					//Add material
					Editor.program.addMaterial(material);
					Editor.updateAssetExplorer();
				}
				catch(e)
				{
					alert("Material duplication failed\n(" + e + ")");
				}
			}
		});
	};

	//Drag start
	this.element.ondragstart = function(event)
	{
		//Restore material color
		self.restoreMaterial();

		//Insert material into drag buffer
		if(self.material !== null)
		{
			event.dataTransfer.setData("uuid", self.material.uuid);
			DragBuffer.pushDragElement(self.material);
		}

		//To avoid camera movement
		Mouse.updateKey(Mouse.LEFT, Key.KEY_UP);
	};

	//Drag end (called after of ondrop)
	this.element.ondragend = function(event)
	{
		//Try to remove material from drag buffer
		var uuid = event.dataTransfer.getData("uuid");
		var obj = DragBuffer.popDragElement(uuid);
	};
}

//Super prototypes
MaterialAsset.prototype = Object.create(Asset.prototype);

//Destroy material file
MaterialAsset.prototype.destroy = function()
{
	Asset.prototype.destroy.call(this);
	this.restoreMaterial();
}

//Set object to file
MaterialAsset.prototype.setMaterial = function(material)
{
	if(material instanceof THREE.Material)
	{
		Editor.material_renderer.renderMaterial(material, this.image);
		this.setText(material.name);
		this.material = material;
	}
}

//Highlight material
MaterialAsset.prototype.highlightMaterial = function()
{
	if(this.material instanceof THREE.Material)
	{
		if(this.material.color !== undefined)
		{
			this.material_color.copy(this.material.color);
			this.material.color.setRGB(1, 1, 0);
			this.material_highlighted = true;
		}
	}
}

//Restore material to normal color
MaterialAsset.prototype.restoreMaterial = function()
{
	if(this.material_highlighted)
	{
		if(this.material instanceof THREE.Material)
		{
			if(this.material.color !== undefined)
			{
				this.material.color.copy(this.material_color);
				this.material_highlighted = false;
			}
		}
	}
}

//Update material preview
MaterialAsset.prototype.updateMetadata = function()
{
	if(this.material !== null)
	{
		Editor.material_renderer.renderMaterial(this.material, this.image);
		this.setText(this.material.name);
	}
}
