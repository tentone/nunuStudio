"use strict";

function GeometryAsset(parent)
{
	Asset.call(this, parent);

	this.setIcon(Editor.filePath + "icons/misc/scene.png");
	
	//Self pointer
	var self = this;

	//Image
	this.image = document.createElement("img");
	this.image.style.position = "absolute";
	this.image.style.top = "5%";
	this.image.style.left = "17%";
	this.image.style.width = "66%";
	this.image.style.height = "66%";
	this.element.appendChild(this.image);

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
		context.addOption("Rename", function()
		{
			Editor.history.add(new ChangeAction(self.asset, "name", Editor.prompt("Rename", self.asset.name)));
			Editor.updateObjectsViewsGUI();
		});
		
		context.addOption("Delete", function()
		{
			Editor.program.removeFont(self.asset, Editor.defaultFont);
			Editor.updateObjectsViewsGUI();
		});

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
		var uuid = event.dataTransfer.getData("uuid");
		var obj = DragBuffer.popDragElement(uuid);
	};
}

GeometryAsset.prototype = Object.create(Asset.prototype);

//Set object to file
GeometryAsset.prototype.setAsset = function(geometry)
{
	this.asset = geometry;
	this.updateMetadata();
};

//Update material preview
GeometryAsset.prototype.updateMetadata = function()
{
	if(this.asset !== null)
	{
		this.setText(this.asset.name);

		var image = this.image;

		GeometryRenderer.render(this.asset, function(url)
		{
			image.src = url;
		});
	}
};
