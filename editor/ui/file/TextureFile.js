function TextureFile(parent)
{
	File.call(this, parent);

	//Material pointer
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
					//TODO <ADD CODE HERE>	
				}
			}
		});

		context.addOption("Copy", function()
		{
			if(self.texture !== null)
			{
				if(self.texture instanceof THREE.Texture)
				{
					try
					{
						App.clipboard.set(JSON.stringify(self.texture.toJSON()), "text");
					}
					catch(e){}
				}
			}
		});
	};
}

//Functions Prototype
TextureFile.prototype = Object.create(File.prototype);
TextureFile.prototype.setTexture = setTexture;

//Set object to file
function setTexture(texture)
{
	if(texture instanceof THREE.Texture)
	{
		this.texture = texture;
		this.setText(texture.name);
	}
}
