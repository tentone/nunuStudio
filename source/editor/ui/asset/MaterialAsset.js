"use strict";

function MaterialAsset(parent)
{
	Asset.call(this, parent);

	this.material = null;
	this.setIcon(Editor.filePath + "icons/misc/material.png");
	
	//Self pointer
	var self = this;

	//Use to store original material color on highlight
	this.materialColor = new THREE.Color(0, 0, 0);
	this.materialHighlighted = false;

	//Material Preview
	this.image = document.createElement("img");
	this.image.style.position = "absolute";
	this.image.style.top = "5px";
	this.element.appendChild(this.image);

	//Mouse over event
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
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
			var tab = Interface.tab.getTab(MaterialEditor, self.material);

			if(tab === null)
			{
				self.restoreMaterial();

				if(self.material instanceof THREE.MeshPhongMaterial)
				{
					tab = Interface.tab.addTab(PhongMaterialEditor, true);
				}
				else if(self.material instanceof THREE.MeshLambertMaterial)
				{
					tab = Interface.tab.addTab(LambertMaterialEditor, true);
				}
				else if(self.material instanceof THREE.MeshBasicMaterial)
				{
					tab = Interface.tab.addTab(BasicMaterialEditor, true);
				}
				else if(self.material instanceof THREE.MeshPhysicalMaterial)
				{
					tab = Interface.tab.addTab(PhysicalMaterialEditor, true);
				}
				else if(self.material instanceof THREE.MeshStandardMaterial)
				{
					tab = Interface.tab.addTab(StandardMaterialEditor, true);
				}
				else if(self.material instanceof THREE.SpriteMaterial)
				{
					tab = Interface.tab.addTab(SpriteMaterialEditor, true);
				}
				else if(self.material instanceof THREE.ShaderMaterial)
				{
					tab = Interface.tab.addTab(ShaderMaterialEditor, true);
				}
				else if(self.material instanceof THREE.PointsMaterial)
				{
					tab = Interface.tab.addTab(PointMaterialEditor, true);
				}
				else
				{
					tab = Interface.tab.addTab(MaterialEditor, true);
				}

				tab.attach(self.material, self);
			}

			tab.select();
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
				Editor.updateTabsData();
			}
		});
		
		context.addOption("Delete", function()
		{
			if(self.material !== null && confirm("Delete material?"))
			{
				Editor.program.removeMaterial(self.material, Editor.defaultMaterial, Editor.defaultSpriteMaterial);
				Editor.updateObjectViews();
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

		context.addOption("Cut", function()
		{
			if(self.material !== null)
			{
				try
				{
					Editor.clipboard.set(JSON.stringify(self.material.toJSON()), "text");
					Editor.program.removeMaterial(self.material, Editor.defaultMaterial, Editor.defaultSpriteMaterial);
					Editor.updateObjectViews();
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
					//Serialize
					var json = self.material.toJSON();

					//Loader
					var loader = new MaterialLoader();
					loader.setTextures(Editor.program.textures);

					//Load
					var material = loader.parse(json); 
					material.uuid = THREE.Math.generateUUID();
					
					//Add
					Editor.program.addMaterial(material);
					Editor.updateAssetExplorer();
				}
				catch(e)
				{
					alert("Material duplication failed\n" + e.stack);
				}
			}
		});

		context.updateInterface();
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
};

//Set object to file
MaterialAsset.prototype.setMaterial = function(material)
{
	if(material instanceof THREE.Material)
	{
		this.material = material;
		this.updateMetadata();
	}
};

//Highlight material
MaterialAsset.prototype.highlightMaterial = function()
{
	if(this.material instanceof THREE.Material && this.material.color !== undefined)
	{
		this.materialColor.copy(this.material.color);
		this.material.color.setRGB(1, 1, 0);
		this.materialHighlighted = true;
	}
};

//Restore material to normal color
MaterialAsset.prototype.restoreMaterial = function()
{
	if(this.materialHighlighted)
	{
		if(this.material instanceof THREE.Material && this.material.color !== undefined)
		{
			this.material.color.copy(this.materialColor);
			this.materialHighlighted = false;
		}
	}
};

//Update material preview
MaterialAsset.prototype.updateMetadata = function()
{
	if(this.material !== null)
	{
		var image = this.image;
		
		MaterialRenderer.render(this.material, function(url)
		{
			image.src = url;
		});
		
		this.setText(this.material.name);
	}
};

//Update interface
MaterialAsset.prototype.updateInterface = function()
{
	Asset.prototype.updateInterface.call(this);

	this.image.width = this.size.x * this.scale.x;
	this.image.height = this.size.y * this.scale.y;
	this.image.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";
};