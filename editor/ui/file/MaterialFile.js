function MaterialFile(parent)
{
	File.call(this, parent);

	//Material pointer
	this.material = null;

	//Self pointer
	var self = this;
	var color = new THREE.Color(0, 0, 0);

	//Mouse over event
	this.element.onmouseenter = function()
	{
		self.element.className = "button_over";

		if(self.material instanceof THREE.Material)
		{
			if(self.material.color !== undefined)
			{
				color.copy(self.material.color);
				self.material.color.setRGB(1, 0, 0);
			}
		}
	};

	//Mouse leave event
	this.element.onmouseleave = function()
	{
		self.element.className = "";

		if(self.material instanceof THREE.Material)
		{
			if(self.material.color !== undefined)
			{
				self.material.color.copy(color);
			}
		}
	};

	//Double click
	this.element.ondblclick = function()
	{
		if(self.material instanceof THREE.Material)
		{
			//Check if there is already a tab with this script attached
			var found = false;
			for(var i = 0; i < Interface.tab.options.length; i++)
			{
				if(Interface.tab.options[i].component instanceof MaterialEditor)
				{
					if(Interface.tab.options[i].component.material === self.material)
					{
						found = true;
						Interface.tab.selectOption(i);
						break;
					}
				}
			}

			//If not found open new tab
			if(!found)
			{
				var tab = Interface.tab.addOption(self.material.name, Interface.file_dir + "icons/misc/material.png", true);
				var material_editor = new MaterialEditor();
				material_editor.attachMaterial(self.material, self);
				tab.attachComponent(material_editor);
				
				//Select added tab
				tab.select();
			}
		}
	};

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX - 5, event.clientY - 5);
		
		context.addOption("Rename", function()
		{
			if(self.material !== null)
			{
				self.material.name = prompt("Rename material", self.material.name);
				Editor.updateObjectViews();
			}
		});
		
		context.addOption("Delete", function()
		{
			if(self.material !== null)
			{
				if(confirm("Delete material?"))
				{
					//TODO <ADD CODE HERE>	
				}
			}
		});

		context.addOption("Copy", function()
		{
			if(self.material !== null)
			{
				if(self.material instanceof THREE.Material)
				{
					try
					{
						App.clipboard.set(JSON.stringify(self.material.toJSON()), "text");
					}
					catch(e){}
				}
			}
		});
	};

	//Drag start
	this.element.ondragstart = function(event)
	{
		//TODO <ADD CODE HERE>
	};

	//Drag end (called after of ondrop)
	this.element.ondragend = function(event)
	{
		//TODO <ADD CODE HERE>
	};

	//Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
		//TODO <ADD CODE HERE>
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};
}

//Functions Prototype
MaterialFile.prototype = Object.create(File.prototype);
MaterialFile.prototype.setMaterial = setMaterial;
MaterialFile.prototype.updatePreview = updatePreview;

//Set object to file
function setMaterial(material)
{
	if(material instanceof THREE.Material)
	{
		Editor.material_renderer.renderMaterial(material, this.img);
		this.material = material;
		this.setText(material.name);
	}
}

//Update material preview
function updatePreview()
{
	if(this.material !== null)
	{
		Editor.material_renderer.renderMaterial(this.material, this.img);
	}
}
