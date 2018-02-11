"use strict";

function TextureAsset(parent)
{
	Asset.call(this, parent);

	this.setIcon(Editor.filePath + "icons/misc/texture.png");

	//Self pointer
	var self = this;

	this.element.ondblclick = function()
	{
		var Constructor = TextureEditor;

		if(self.asset instanceof VideoTexture)
		{
			Constructor = VideoTextureEditor;
		}
		else if(self.asset instanceof CanvasTexture)
		{
			Constructor = CanvasTextureEditor;
		}
		else if(self.asset instanceof CubeTexture)
		{
			Constructor = CubeTextureEditor;
		}
		else if(self.asset instanceof SpriteSheetTexture)
		{
			Constructor = SpriteSheetTextureEditor;
		}

		var tab = Interface.tab.getTab(Constructor, self.asset);
		
		if(tab === null)
		{
			tab = Interface.tab.addTab(Constructor, true);
			tab.attach(self.asset);
		}

		tab.select();
	}

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
				Editor.history.add(new ChangeAction(self.asset, "name", prompt("Rename texture", self.asset.name)));
				Editor.updateObjectViews();
			}
		});
		
		context.addOption("Delete", function()
		{
			if(self.asset !== null && confirm("Delete texture?"))
			{
				self.asset.dispose();
				Editor.program.removeTexture(self.asset, Editor.defaultTexture);
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

					self.asset.dispose();
					Editor.program.removeTexture(self.asset, Editor.defaultTexture);
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
					var resources =
					{
						videos: {},
						images: {},
						fonts: {},
						textures: {}
					};

					//Serialize
					var json = self.asset.toJSON(resources);
					var images = ObjectLoader.prototype.parseImages.call(this, resources.images);
					var videos = ObjectLoader.prototype.parseVideos.call(this, resources.videos);

					//Loader
					var loader = new TextureLoader();
					loader.setImages(images);
					loader.setVideos(videos);

					//Load
					var texture = loader.parse(json); 
					texture.uuid = THREE.Math.generateUUID();
					
					//Add
					Editor.program.addTexture(texture);
					Interface.assetExplorer.updateSelection();
				}
				catch(e)
				{
					Editor.alert("Texture duplication failed\n" + e.stack);
				}
			}
		});
		context.updateInterface();
	};

	//Drag start
	this.element.ondragstart = function(event)
	{
		//Insert into drag buffer
		if(self.asset !== null)
		{
			event.dataTransfer.setData("uuid", self.asset.uuid);
			DragBuffer.pushDragElement(self.asset);
		}
	};

	//Drag end (called after of ondrop)
	this.element.ondragend = function(event)
	{
		//Try to remove font from drag buffer
		var uuid = event.dataTransfer.getData("uuid");
		var obj = DragBuffer.popDragElement(uuid);
	};
}

TextureAsset.prototype = Object.create(Asset.prototype);

//Set object to file
TextureAsset.prototype.setAsset = function(texture)
{
	this.asset = texture;
	this.preview = TextureRenderer.generateElement(texture);

	if(this.preview !== null)
	{
		this.preview.draggable = true;
		this.preview.style.position = "absolute";
		this.preview.style.top = "5%";
		this.preview.style.left = "17%";
		this.preview.style.width = "65%";
		this.preview.style.height = "65%";
		this.element.appendChild(this.preview);	
	}

	this.updateMetadata();
};
