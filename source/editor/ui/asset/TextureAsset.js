"use strict";

function TextureAsset(parent)
{
	Asset.call(this, parent);

	this.texture = null;

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
			if(self.texture !== null)
			{
				self.texture.name = prompt("Rename texture", self.texture.name);
				Editor.updateObjectViews();
			}
		});
		
		context.addOption("Delete", function()
		{
			if(self.texture !== null)
			{
				if(confirm("Delete texture?"))
				{
					self.texture.dispose();
					Editor.program.removeTexture(self.texture, Editor.default_texture);
					Editor.updateObjectViews();
				}
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
	};
}

TextureAsset.prototype = Object.create(Asset.prototype);

//Set object to file
TextureAsset.prototype.setTexture = function(texture)
{
	if(texture instanceof THREE.Texture)
	{
		this.texture = texture;
		this.updateMetadata();
	}
}

//Update material preview
TextureAsset.prototype.updateMetadata = function()
{
	if(this.texture !== null)
	{
		this.image.src = this.texture.image.src;
		this.setText(this.texture.name);
	}
}
