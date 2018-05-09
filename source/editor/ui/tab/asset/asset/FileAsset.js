"use strict";

function FileAsset(parent)
{
	Asset.call(this, parent);

	this.setIcon(Editor.filePath + "icons/misc/file.png");
	
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
			if(self.asset !== null)
			{
				Editor.history.add(new ChangeAction(self.asset, "name", Editor.prompt("Rename file", self.asset.name)));
				Editor.updateObjectsViewsGUI();
			}
		});
		
		context.addOption("Delete", function()
		{
			if(self.asset !== null && confirm("Delete file?"))
			{
				Editor.program.removeResource(self.asset);
				Editor.updateObjectsViewsGUI();
			}
		});

		context.addOption("Export", function()
		{
			if(Nunu.runningOnDesktop())
			{
				FileSystem.chooseFile(function(files)
				{
					if(files.length > 0)
					{
						self.asset.export(files[0].path);
					}
				}, "." + self.asset.encoding, true);
			}
			else
			{
				FileSystem.chooseFileName(function(file)
				{
					self.asset.export(file);
				}, "." + self.asset.encoding);
			}
		});

		context.updateInterface();
	};


	//Open text editor
	this.element.ondblclick = function()
	{
		var tab = Editor.gui.tab.getTab(TextEditor, self.asset);

		if(tab === null)
		{
			tab = Editor.gui.tab.addTab(TextEditor, true);
			tab.attach(self.asset, self);
		}
		
		tab.select();
	}
}

FileAsset.prototype = Object.create(Asset.prototype);

//Set object to file
FileAsset.prototype.setAsset = function(file)
{
	this.asset = file;
	this.updateMetadata();
};

//Update material preview
FileAsset.prototype.updateMetadata = function()
{
	this.setText(this.asset.name);

	if(this.asset.encoding === "js" || this.asset.encoding === "glsl")
	{
		this.image.src = Editor.filePath + "icons/script/script.png";
	}
	else
	{
		this.image.src = Editor.filePath + "icons/misc/file.png";
	}
};

//Update interface
FileAsset.prototype.updateInterface = function()
{
	Asset.prototype.updateInterface.call(this);

	this.image.width = this.size.x * this.scale.x;
	this.image.height = this.size.y * this.scale.y;
	this.image.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";
};