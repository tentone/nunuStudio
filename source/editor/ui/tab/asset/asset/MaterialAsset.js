"use strict";

function MaterialAsset(parent)
{
	Asset.call(this, parent);

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
		if(self.asset instanceof THREE.Material)
		{
			var tab = Interface.tab.getTab(MaterialEditor, self.asset);

			if(tab === null)
			{
				self.restoreMaterial();

				if(self.asset instanceof THREE.MeshPhongMaterial)
				{
					tab = Interface.tab.addTab(MeshPhongMaterialEditor, true);
				}
				else if(self.asset instanceof THREE.MeshLambertMaterial)
				{
					tab = Interface.tab.addTab(MeshLambertMaterialEditor, true);
				}
				else if(self.asset instanceof THREE.MeshBasicMaterial)
				{
					tab = Interface.tab.addTab(MeshBasicMaterialEditor, true);
				}
				else if(self.asset instanceof THREE.MeshPhysicalMaterial)
				{
					tab = Interface.tab.addTab(MeshPhysicalMaterialEditor, true);
				}
				else if(self.asset instanceof THREE.MeshStandardMaterial)
				{
					tab = Interface.tab.addTab(MeshStandardMaterialEditor, true);
				}
				else if(self.asset instanceof THREE.SpriteMaterial)
				{
					tab = Interface.tab.addTab(SpriteMaterialEditor, true);
				}
				else if(self.asset instanceof THREE.ShaderMaterial)
				{
					tab = Interface.tab.addTab(ShaderMaterialEditor, true);
				}
				else if(self.asset instanceof THREE.LineDashedMaterial)
				{
					tab = Interface.tab.addTab(LineDashedMaterialEditor, true);
				}
				else if(self.asset instanceof THREE.LineBasicMaterial)
				{
					tab = Interface.tab.addTab(LineBasicMaterialEditor, true);
				}
				else if(self.asset instanceof THREE.PointsMaterial)
				{
					tab = Interface.tab.addTab(PointsMaterialEditor, true);
				}
				else
				{
					tab = Interface.tab.addTab(MeshMaterialEditor, true);
				}

				tab.attach(self.asset, self);
			}

			tab.select();
		}
	};

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
		context.addOption("Rename", function()
		{
			if(self.asset !== null)
			{
				Editor.history.add(new ChangeAction(self.asset, "name", prompt("Rename material", self.asset.name)));
				self.updateMetadata();
				Editor.updateObjectViews();
			}
		});
		
		context.addOption("Select objects", function()
		{	
			Editor.clearSelection();
			Editor.program.traverse(function(child)
			{
				if(child.material === self.asset)
				{
					Editor.addToSelection(child);
				}
			});

			Editor.updateObjectViews();
		})

		context.addOption("Delete", function()
		{
			if(self.asset !== null && confirm("Delete material?"))
			{
				Editor.program.removeMaterial(self.asset, Editor.defaultMaterial, Editor.defaultSpriteMaterial);
				Editor.updateObjectViews();
			}
		});

		context.addOption("Copy", function()
		{
			if(self.asset !== null)
			{
				try
				{
					Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
				}
				catch(e){}
			}
		});

		context.addOption("Cut", function()
		{
			if(self.asset !== null)
			{
				try
				{
					Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
					Editor.program.removeMaterial(self.asset, Editor.defaultMaterial, Editor.defaultSpriteMaterial);
					Editor.updateObjectViews();
				}
				catch(e){}
			}
		});

		context.addOption("Duplicate", function()
		{
			if(self.asset !== null)
			{
				try
				{
					//Serialize
					var json = self.asset.toJSON();

					//Loader
					var loader = new MaterialLoader();
					loader.setTextures(Editor.program.textures);

					//Load
					var material = loader.parse(json); 
					material.uuid = THREE.Math.generateUUID();
					
					//Add
					Editor.program.addMaterial(material);
					Interface.assetExplorer.updateSelection();
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
		if(self.asset !== null)
		{
			event.dataTransfer.setData("uuid", self.asset.uuid);
			DragBuffer.pushDragElement(self.asset);
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
MaterialAsset.prototype.setAsset = function(material)
{
	if(material instanceof THREE.Material)
	{
		this.asset = material;
		this.updateMetadata();
	}
};

//Highlight material
MaterialAsset.prototype.highlightMaterial = function()
{
	if(this.asset instanceof THREE.Material && this.asset.color !== undefined)
	{
		this.materialColor.copy(this.asset.color);
		this.asset.color.setRGB(1, 1, 0);
		this.materialHighlighted = true;
	}
};

//Restore material to normal color
MaterialAsset.prototype.restoreMaterial = function()
{
	if(this.materialHighlighted)
	{
		if(this.asset instanceof THREE.Material && this.asset.color !== undefined)
		{
			this.asset.color.copy(this.materialColor);
			this.materialHighlighted = false;
		}
	}
};

//Update material preview
MaterialAsset.prototype.updateMetadata = function()
{
	if(this.asset !== null)
	{
		var image = this.image;
		
		MaterialRenderer.render(this.asset, function(url)
		{
			image.src = url;
		});
		
		this.setText(this.asset.name);
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