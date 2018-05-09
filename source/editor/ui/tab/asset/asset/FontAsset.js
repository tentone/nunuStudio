"use strict";

function FontAsset(parent)
{
	Asset.call(this, parent);

	this.setIcon(Editor.filePath + "icons/misc/font.png");
	
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
		context.position.set(event.clientX, event.clientY);
		
		context.addOption("Rename", function()
		{
			Editor.history.add(new ChangeAction(self.asset, "name", Editor.prompt("Rename font", self.asset.name)));
			Editor.updateObjectsViews();
		});
		
		context.addOption("Delete", function()
		{
			Editor.program.removeFont(self.asset, Editor.defaultFont);
			Editor.updateObjectsViews();
		});

		if(self.asset.format === "arraybuffer")
		{
			context.addOption("Reverse", function()
			{
				if(confirm("Reverse font glyphs?"))
				{
					self.asset.reverseGlyphs();
					self.updateMetadata();
				}
			});
		}

		context.addOption("Copy", function()
		{
			try
			{
				Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
			}
			catch(e){}
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

FontAsset.prototype = Object.create(Asset.prototype);

//Set object to file
FontAsset.prototype.setAsset = function(font)
{
	if(font instanceof Font)
	{
		this.asset = font;
		this.updateMetadata();
	}
};

//Update material preview
FontAsset.prototype.updateMetadata = function()
{
	var image = this.image;
	
	FontRenderer.render(this.asset, function(url)
	{
		image.src = url;
	});

	this.setText(this.asset.name);
};

//Update interface
FontAsset.prototype.updateInterface = function()
{
	Asset.prototype.updateInterface.call(this);

	this.image.width = this.size.x * this.scale.x;
	this.image.height = this.size.y * this.scale.y;
	this.image.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";
};