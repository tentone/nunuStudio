"use strict";

function TextureAsset(parent)
{
	Asset.call(this, parent);

	this.setIcon(Editor.filePath + "icons/misc/texture.png");

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

		var tab = Editor.gui.tab.getTab(Constructor, self.asset);
		
		if(tab === null)
		{
			tab = Editor.gui.tab.addTab(Constructor, true);
			tab.attach(self.asset);
		}

		tab.select();
	}

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu(DocumentBody);
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
		context.addOption(Locale.rename, function()
		{
			if(self.asset !== null)
			{
				Editor.addAction(new ChangeAction(self.asset, "name", Editor.prompt("Rename texture", self.asset.name)));
			}
		});
		
		context.addOption(Locale.delete, function()
		{
			if(self.asset !== null && Editor.confirm("Delete texture?"))
			{
				self.asset.dispose();
				Editor.addAction(new RemoveResourceAction(self.asset, Editor.program, "textures"));
			}
		});

		context.addOption(Locale.copy, function()
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
		
		context.addOption(Locale.cut, function()
		{
			if(self.asset !== null)
			{
				try
				{
					Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");

					self.asset.dispose();
					Editor.addAction(new RemoveResourceAction(self.asset, Editor.program, "textures"));
				}
				catch(e){}
			}
		});

		context.addOption(Locale.duplicate, function()
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
					Editor.updateObjectsViewsGUI();
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
			DragBuffer.push(self.asset);
		}
	};

	//Drag end (called after of ondrop)
	this.element.ondragend = function(event)
	{
		DragBuffer.pop(self.asset.uuid);
	};
}

TextureAsset.prototype = Object.create(Asset.prototype);

TextureAsset.prototype.attach = function(asset)
{
	Asset.prototype.attach.call(this, asset);

	this.preview = TextureRenderer.generateElement(asset);

	if(this.preview !== null)
	{
		this.preview.draggable = true;
		this.preview.style.position = "absolute";
		this.preview.style.top = "5%";
		this.preview.style.left = "17%";
		this.preview.style.width = "66%";
		this.preview.style.height = "66%";
		this.element.appendChild(this.preview);	
	}
};
