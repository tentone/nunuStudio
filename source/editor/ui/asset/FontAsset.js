"use strict";

function FontAsset(parent)
{
	Asset.call(this, parent);

	this.font = null;
	this.setIcon(Interface.file_dir + "icons/misc/font.png");
	
	//Self pointer
	var self = this;

	//Image
	this.image = document.createElement("img");
	this.image.style.position = "absolute";
	this.image.style.top = "5px";
	this.element.appendChild(this.image);

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX - 5, event.clientY - 5);
		
		context.addOption("Rename", function()
		{
			if(self.font !== null)
			{
				self.font.name = prompt("Rename font", self.font.name);
				Editor.updateObjectViews();
			}
		});
		
		context.addOption("Delete", function()
		{
			if(self.font !== null && confirm("Delete font?"))
			{
				Editor.program.removeFont(self.font, Editor.default_font);
				Editor.updateObjectViews();
			}
		});

		context.addOption("Copy", function()
		{
			if(self.font !== null)
			{
				try
				{
					Editor.clipboard.set(JSON.stringify(self.font.toJSON()), "text");
				}
				catch(e){}
			}
		});
	};

	//Drag start
	this.element.ondragstart = function(event)
	{
		//Insert into drag buffer
		if(self.font !== null)
		{
			event.dataTransfer.setData("uuid", self.font.uuid);
			DragBuffer.pushDragElement(self.font);
		}

		//To avoid camera movement
		Mouse.updateKey(Mouse.LEFT, Key.UP);
	};

	//Drag end (called after of ondrop)
	this.element.ondragend = function(event)
	{
		//Try to remove font from drag buffer
		var uuid = event.dataTransfer.getData("uuid");
		var obj = DragBuffer.popDragElement(uuid);
	};
}

FontAsset.prototype = Object.create(Asset.prototype);

//Set object to file
FontAsset.prototype.setFont = function(font)
{
	if(font instanceof Font)
	{
		this.font = font;
		this.updateMetadata();
	}
}

//Update material preview
FontAsset.prototype.updateMetadata = function()
{
	if(this.font !== null)
	{
		Editor.font_renderer.renderFont(this.font, this.image);

		this.setText(this.font.name);
	}
}

//Update interface
FontAsset.prototype.updateInterface = function()
{
	Asset.prototype.updateInterface.call(this);

	//Update image
	this.image.width = this.size.x * this.scale.x;
	this.image.height = this.size.y * this.scale.y;
	this.image.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";
}