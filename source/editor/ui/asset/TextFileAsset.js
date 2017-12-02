"use strict";

function TextFileAsset(parent)
{
	Asset.call(this, parent);

	this.file = null;
	this.setIcon(Editor.filePath + "icons/misc/file.png");
	
	//Self pointer
	var self = this;

	//Image
	this.image = document.createElement("img");
	this.image.src = Editor.filePath + "icons/misc/file.png";
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
			if(self.file !== null)
			{
				Editor.history.add(new ChangeAction(self.file, "name", prompt("Rename file", self.file.name)));
				Editor.updateObjectViews();
			}
		});
		
		context.addOption("Delete", function()
		{
			if(self.file !== null && confirm("Delete file?"))
			{
				Editor.program.removeFile(self.file, Editor.defaultFile);
				Editor.updateObjectViews();
			}
		});

		context.updateInterface();
	};
}

TextFileAsset.prototype = Object.create(Asset.prototype);

//Set object to file
TextFileAsset.prototype.setFile = function(file)
{
	if(file instanceof File)
	{
		this.file = file;
		this.updateMetadata();
	}
};

//Update material preview
TextFileAsset.prototype.updateMetadata = function()
{
	if(this.file !== null)
	{
		this.setText(this.file.name);
	}
};

//Update interface
TextFileAsset.prototype.updateInterface = function()
{
	Asset.prototype.updateInterface.call(this);

	this.image.width = this.size.x * this.scale.x;
	this.image.height = this.size.y * this.scale.y;
	this.image.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";
};