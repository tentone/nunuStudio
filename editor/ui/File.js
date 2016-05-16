function File(parent)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}
	
	//ID
	var id = "fi" + File.id;
	File.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

	//Image
	this.img = document.createElement("img");
	this.img.style.position = "absolute";
	this.element.appendChild(this.img);

	//Text
	this.text = new Text(this.element);
	this.text.updateInterface();

	//Element atributes
	this.size = new THREE.Vector2(0, 0);
	this.position = new THREE.Vector2(0, 0);
	this.visible = true;

	//Icon scale
	this.scale = new THREE.Vector2(0.6, 0.6);
	
	//Attached object
	this.obj = null;

	//Click event
	var self = this;

	//Mouse over event
	this.element.onmouseover = function()
	{
		self.element.className = "button_over";
	};

	//Mouse leave event
	this.element.onmouseleave = function()
	{
		self.element.className = "";
	};

	//Double click
	this.element.ondblclick = function()
	{
		if(self.obj instanceof THREE.Material)
		{
			//Check if there is already a tab with this script attached
			var found = false;
			for(var i = 0; i < Interface.tab.options.length; i++)
			{
				if(Interface.tab.options[i].component instanceof MaterialEditor)
				{
					if(Interface.tab.options[i].component.material === self.obj)
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
				var tab = Interface.tab.addOption(self.obj.name, Interface.file_dir + "icons/misc/material.png", true);
				var material = new MaterialEditor();
				material.attachMaterial(self.obj);
				tab.attachComponent(material);
				
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
			if(self.obj !== null)
			{
				self.obj.name = prompt("Rename object", self.obj.name);
				Editor.updateObjectPanel();
			}
		});
		context.addOption("Delete", function()
		{
			//TODO <ADD CODE HERE>
		});
		context.addOption("Copy", function()
		{
			//TODO <ADD CODE HERE>
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

	//Add element to document
	this.parent.appendChild(this.element);
}

//File ID counter
File.id = 0;

//Functions Prototype
File.prototype.update = update;
File.prototype.updateInterface = updateInterface;
File.prototype.destroy = destroy;

File.prototype.setIcon = setIcon;
File.prototype.setText = setText;
File.prototype.setCallback = setCallback;
File.prototype.setObject = setObject;

//Set object to file
function setObject(obj)
{
	this.obj = obj;
	this.setText(obj.name);
}

//Set file icon
function setIcon(image)
{
	this.img.src = image;
}

//Set file label
function setText(text)
{
	if(text.length > 8)
	{
		text = text.slice(0,8) + "...";
	}

	this.text.setText(text);
}

//Set button callback function
function setCallback(callback)
{
	this.element.onclick = callback;
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
function update(){}

//Update Interface
function updateInterface()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update element
	this.img.width = this.size.x * this.scale.x;
	this.img.height = this.size.y * this.scale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";
	this.img.style.top = "5px";

	this.text.visible = this.visible;
	this.text.size.x = this.size.x;
	this.text.position.y = (this.size.y - 20);
	this.text.size.y = this.size.y - this.text.position.y;
	this.text.updateInterface();
	
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}