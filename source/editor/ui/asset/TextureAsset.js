"use strict";

function TextureAsset(parent)
{
	Asset.call(this, parent);

	this.texture = null;
	this.setIcon(Interface.fileDir + "icons/misc/image.png");

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

				FileSystem.chooseFile(function(files)
				{
					if(files.length > 0)
					{
						var file = files[0].path;
						FileSystem.writeFileBase64(file, image.data);
					}
				}, "." + image.encoding , true);
			});
		}
		else if(self.texture instanceof VideoTexture)
		{
			context.addOption("Export Video", function()
			{
				var video = self.texture.video;
				
				FileSystem.chooseFile(function(files)
				{
					if(files.length > 0)
					{
						var file = files[0].path;
						FileSystem.writeFileBase64(file, video.data);
					}
				}, "." + video.encoding , true);
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

		//To avoid camera movement
		Editor.mouse.updateKey(Mouse.LEFT, Key.UP);
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

	//Video
	if(texture instanceof VideoTexture || texture instanceof WebcamTexture)
	{
		this.preview = document.createElement("video");
		this.preview.volume = 0.0;
		this.preview.loop = true;
		this.preview.autostart = true;
		this.preview.src = texture.image.src;
	}
	//Cube texture
	else if(texture instanceof CubeTexture)
	{
		this.preview = document.createElement("canvas");
		this.preview.width = 128;
		this.preview.height = 128;

		var context = this.preview.getContext("2d");

		for(var i = 0; i < texture.images.length; i++)
		{
			var image = document.createElement("img");
			image.index = i;
			image.onload = function()
			{
				if(this.index === 2)
				{
					context.drawImage(this, 32, 16, 32, 32);
				}
				else if(this.index === 3)
				{
					context.drawImage(this, 32, 80, 32, 32);
				}
				else
				{
					var order = [2, 0, null, null, 1, 3]
					context.drawImage(this, order[this.index] * 32, 48, 32, 32);
				}
			}
			image.src = texture.images[i].data;
		}
	}
	//Canvas texture
	else if(texture instanceof CanvasTexture)
	{
		this.preview = document.createElement("img");
		this.preview.src = texture.image.toDataURL();
	}
	//Image
	else if(texture instanceof THREE.Texture)
	{
		this.preview = document.createElement("img");
		this.preview.src = texture.image.src;
	}

	//Add preview to parent
	if(this.preview !== null)
	{
		this.preview.draggable = true;
		this.preview.style.position = "absolute";
		this.preview.style.top = "5%";
		this.preview.style.left = "17%";
		this.preview.style.width = "65%";
		this.element.appendChild(this.preview);	
	}

	this.updateMetadata();
}

//Update material preview
TextureAsset.prototype.updateMetadata = function()
{
	if(this.texture !== null)
	{
		this.setText(this.texture.name);
	}
}
