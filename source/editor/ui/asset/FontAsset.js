"use strict";

function FontAsset(parent)
{
	Asset.call(this, parent);

	this.font = null;
	this.setIcon(Interface.fileDir + "icons/misc/font.png");
	
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
				Editor.program.removeFont(self.font, Editor.defaultFont);
				Editor.updateObjectViews();
			}
		});

		if(self.font !== null && self.font.format === "arraybuffer")
		{
			context.addOption("Reverse", function()
			{
				if(confirm("Reverse font glyphs?"))
				{
					self.font.reverseGlyphs();
					self.updateMetadata();
				}
			});
		}

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
};

//Update material preview
FontAsset.prototype.updateMetadata = function()
{
	if(this.font !== null)
	{
		var image = this.image;
		Editor.fontRenderer.renderFont(this.font, function(url)
		{
			image.src = url;
		});

		this.setText(this.font.name);
	}
};

//Update interface
FontAsset.prototype.updateInterface = function()
{
	Asset.prototype.updateInterface.call(this);

	this.image.width = this.size.x * this.scale.x;
	this.image.height = this.size.y * this.scale.y;
	this.image.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";
};