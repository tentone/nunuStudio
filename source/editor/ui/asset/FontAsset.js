"use strict";

function FontAsset(parent)
{
	Asset.call(this, parent);

	this.font = null;

	//Self pointer
	var self = this;

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
				Editor.program.removeMaterial(self.font, Editor.default_font);
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
		this.image.src = Interface.file_dir + "icons/assets/font.png";
		this.setText(this.font.name);
	}
}
