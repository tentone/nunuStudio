"use strict";

function TabGroup(parent)
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
	var id = "tab_group" + TabGroup.id;
	TabGroup.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.cursor = "default";
	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panel_color;
	
	//Prevent Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};
	
	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Tab mode
	this.mode = TabGroup.TOP;

	//Options
	this.options_size = new THREE.Vector2(150, 30);
	this.options_selected = -1;
	this.options = [];

	//Add element to document
	this.parent.appendChild(this.element);
}

//TabGroup conter
TabGroup.id = 0;

//Tab button displacement mode
TabGroup.TOP = 0;
TabGroup.LEFT = 1;

//Update all tabs object data
TabGroup.prototype.updateMetadata = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].updateMetadata();
	}
}

//Get actual tab
TabGroup.prototype.getActual = function()
{
	if(this.options_selected > -1)
	{
		if(this.options[this.options_selected].component !== null)
		{
			return this.options[this.options_selected].component;
		}
	}

	return null;
}

//If actual tab is closeable close it
TabGroup.prototype.closeActual = function()
{
	if(this.options_selected > -1)
	{
		if(this.options[this.options_selected].closeable)
		{
			this.removeOption(this.options_selected);
		}
	}
}

//Select option
TabGroup.prototype.selectOption = function(index)
{
	if(index > -1 && index < this.options.length)
	{
		this.options_selected = index;
		this.options[index].activate();
	}
	else
	{
		this.options_selected = -1;
		Editor.setState(Editor.STATE_IDLE);
	}

	this.updateInterface();
}

//Add new option to tab grounp
TabGroup.prototype.addOption = function(name, image, closeable)
{
	var option = new TabElement(this.element, name, image, closeable, this, this.options.length);

	this.options.push(option);
	if(this.options_selected === -1)
	{
		this.selectOption(0);
	}

	return option;
}

//Remove all tabs
TabGroup.prototype.clear = function()
{
	while(this.options.length > 0)
	{
		this.options.pop().destroy();
	}

	this.selectOption(-1);
}

//Remove tab from group
TabGroup.prototype.removeOption = function(index)
{
	if(index > -1 && index < this.options.length)
	{
		//Remove option from list
		this.options[index].destroy();
		this.options.splice(index, 1);

		//Update options index
		this.updateOptionIndex();

		//Select option
		if(this.options.length > 0)
		{
			if(index !== 0)
			{
				this.selectOption(index - 1);
			}
			else
			{
				this.selectOption(0);
			}
		}
		else
		{
			this.selectOption(-1);
		}
	}
}

//Update options index
TabGroup.prototype.updateOptionIndex = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].index = i;
	}
}

//Remove element
TabGroup.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
TabGroup.prototype.update = function()
{
	if(this.options_selected > -1)
	{
		this.options[this.options_selected].update();
	}
}

//Update interface
TabGroup.prototype.updateInterface = function()
{
	//Update options
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].visible = this.visible && (this.options_selected === i);
		this.options[i].size.copy(this.size);
		this.options[i].updateInterface();
	}

	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
