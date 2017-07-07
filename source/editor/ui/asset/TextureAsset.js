"use strict";

function TextureAsset(parent)
{
	Asset.call(this, parent);

	this.texture = null;
	this.setIcon(Editor.filePath + "icons/misc/image.png");

	//Self pointer
	var self = this;

	this.element.ondblclick = function()
	{
		var Constructor = TextureEditor;

		if(self.texture instanceof VideoTexture)
		{
			Constructor = VideoTextureEditor;
		}
		else if(self.texture instanceof CanvasTexture)
		{
			Constructor = CanvasTextureEditor;
		}
		else if(self.texture instanceof CubeTexture)
		{
			Constructor = CubeTextureEditor;
		}
		else if(self.texture instanceof SpriteSheetTexture)
		{
			Constructor = SpriteSheetTextureEditor;
		}

		var tab = Interface.tab.getTab(Constructor, self.texture);
		
		if(tab === null)
		{
			tab = Interface.tab.addTab(Constructor, true);
			tab.attach(self.texture);
		}

		tab.select();
	}

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX - 5, event.clientY - 5);
		
		context.addOption("Rename", function()
		{
			if(self.texture !== null)
			{
				self.texture.name = prompt("Rename texture", self.texture.name);
				Editor.updateObjectViews();
			}
		});
		
		context.addOption("Delete", function()
		{
			if(self.texture !== null && confirm("Delete texture?"))
			{
				self.texture.dispose();
				Editor.program.removeTexture(self.texture, Editor.defaultTexture);
				Editor.updateObjectViews();
			}
		});

		context.addOption("Copy", function()
		{
			if(self.texture !== null)
			{
				try
				{
					Editor.clipboard.set(JSON.stringify(self.texture.toJSON()), "text");
				}
				catch(e){}
			}
		});

		if(self.texture instanceof Texture)
		{
			context.addOption("Export Image", function()
			{
				var image = self.texture.img;
				image.encodeData();

				if(Nunu.runningOnDesktop())
				{
					FileSystem.chooseFile(function(files)
					{
						if(files.length > 0)
						{
							var file = files[0].path;
							FileSystem.writeFileBase64(file, image.data);
						}
					}, "." + image.encoding, true);
				}
				else
				{
					FileSystem.chooseFileName(function(file)
					{
						FileSystem.writeFileBase64(file, image.data);
					}, "." + image.encoding);
				}
			});

			context.addOption("Fit aspect ratio", function()
			{
				var image = self.texture.image;
				var aspect = image.width / image.height;

				if(aspect > 1)
				{
					self.texture.repeat.y = aspect;
					self.texture.offset.y = -(1 - 1/aspect);
				}
				else
				{
					self.texture.repeat.x = 1/aspect;
					self.texture.offset.x = -(1 - aspect)
				}

			});
		}
		else if(self.texture instanceof VideoTexture)
		{
			context.addOption("Export Video", function()
			{
				var video = self.texture.video;
				
				if(Nunu.runningOnDesktop())
				{
					FileSystem.chooseFile(function(files)
					{
						if(files.length > 0)
						{
							var file = files[0].path;
							FileSystem.writeFileBase64(file, video.data);
						}
					}, "." + video.encoding , true);
				}
				else
				{
					FileSystem.chooseFileName(function(file)
					{
						FileSystem.writeFileBase64(file, video.data);
					}, "." + video.encoding);
				}
			});
		}

		context.addOption("Cut", function()
		{
			if(self.texture !== null)
			{
				try
				{
					Editor.clipboard.set(JSON.stringify(self.texture.toJSON()), "text");

					self.texture.dispose();
					Editor.program.removeTexture(self.texture, Editor.defaultTexture);
					Editor.updateObjectViews();
				}
				catch(e){}
			}
		});

		context.addOption("Duplicate", function()
		{
			if(self.texture !== null)
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
					var json = self.texture.toJSON(resources);
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
					Editor.updateAssetExplorer();
				}
				catch(e)
				{
					alert("Texture duplication failed\n" + e.stack);
				}
			}
		});
		context.updateInterface();
	};

	//Drag start
	this.element.ondragstart = function(event)
	{
		//Insert into drag buffer
		if(self.texture !== null)
		{
			event.dataTransfer.setData("uuid", self.texture.uuid);
			DragBuffer.pushDragElement(self.texture);
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
TextureAsset.prototype.setTexture = function(texture)
{
	this.texture = texture;
	this.preview = TexturePreview.generate(texture);

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

//Update material preview
TextureAsset.prototype.updateMetadata = function()
{
	if(this.texture !== null)
	{
		this.setText(this.texture.name);
	}
};
