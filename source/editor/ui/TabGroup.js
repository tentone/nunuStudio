"use strict";

function TabGroup(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panel_color;

	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};
	
	//Buttons
	this.buttons = document.createElement("div");
	this.buttons.style.overflow = "hidden";
	this.buttons.style.position = "absolute";
	this.element.appendChild(this.buttons);
	
	this.buttons.ondrop = function(event)
	{
		//TODO <REORDER TABS>
		event.preventDefault();
	};

	this.buttons.ondragover = function(event)
	{
		//TODO <REORDER TABS ICONS>
		event.preventDefault();
	};

	//Tab
	this.tab = document.createElement("div");
	this.tab.style.position = "absolute";
	this.element.appendChild(this.tab);

	//Empty message
	this.empty = document.createElement("div");
	this.empty.style.position = "absolute";
	this.empty.style.textAlign = "center";
	this.empty.style.display = "flex";
	this.empty.style.flexDirection = "column";
	this.empty.style.justifyContent = "center";
	this.empty.style.pointerEvents = "none";
	this.empty.innerHTML = "Open new tab to edit content or create new project";
	this.tab.appendChild(this.empty);

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Options
	this.mode = TabGroup.TOP;
	this.button_size = new THREE.Vector2(150, 30);
	this.selected = -1;
	this.options = [];

	//Add element to document
	this.parent.appendChild(this.element);
}

//Button alignment
TabGroup.TOP = 0;
TabGroup.BOTTOM = 1;
TabGroup.LEFT = 2;
TabGroup.RIGHT = 3;

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
	if(this.selected > -1)
	{
		if(this.options[this.selected] !== null)
		{
			return this.options[this.selected];
		}
	}

	return null;
}

//Close actual tab if its closeable
TabGroup.prototype.closeActual = function()
{
	if(this.selected > -1)
	{
		if(this.options[this.selected].closeable)
		{
			this.removeTab(this.selected);
		}
	}
}

//Select tab
TabGroup.prototype.selectTab = function(index)
{
	if(index > -1 && index < this.options.length)
	{
		this.selected = index;
		this.options[index].activate();
		this.updateInterface();
	}
	else
	{
		this.selected = -1;
	}
}

//Select next tab
TabGroup.prototype.selectNextTab = function()
{
	if(this.options.length > 0)
	{
		this.selectTab((this.selected + 1) % this.options.length);
	}
}

//Select previous tab
TabGroup.prototype.selectPreviousTab = function()
{
	if(this.options.length > 0)
	{
		if(this.selected === 0)
		{
			this.selectTab(this.options.length - 1);
		}
		else
		{
			this.selectTab(this.selected - 1);
		}
	}
}

//Add new option to tab grounp
TabGroup.prototype.addTab = function(TabConstructor, closeable)
{
	var tab = new TabConstructor(this.tab, closeable, this, this.options.length);
	var button = new TabButton(this.buttons, tab);
	tab.button = button;

	this.options.push(tab);
	if(this.selected === -1)
	{
		this.selectTab(0);
	}

	return tab;
}

//Get tab from tab type and attached object is there is any
TabGroup.prototype.getTab = function(type, obj)
{
	for(var i = 0; i < this.options.length; i++)
	{
		if(this.options[i] instanceof type)
		{
			if(obj === undefined || this.options[i].isAttached(obj))
			{
				return this.options[i];
			}
		}
	}

	return null;
}

//Remove tab from group
TabGroup.prototype.removeTab = function(index)
{
	if(index > -1 && index < this.options.length)
	{
		//Remove option from list
		this.options[index].destroy();
		this.options.splice(index, 1);

		//Update tabs index
		this.updateOptionIndex();

		//Select option
		if(this.options.length > 0)
		{
			if(index !== 0)
			{
				this.selectTab(index - 1);
			}
			else
			{
				this.selectTab(0);
			}
		}
		else
		{
			this.selectTab(-1);
		}
	}
}

//Remove all tabs
TabGroup.prototype.clear = function()
{
	while(this.options.length > 0)
	{
		this.options.pop().destroy();
	}

	this.selectTab(-1);
}

//Update tabs index
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
	if(this.selected > -1)
	{
		this.options[this.selected].update();
	}
}

//Update interface
TabGroup.prototype.updateInterface = function()
{
	var tab_size = this.size.clone();
	var button_size = this.button_size.clone();
	var offset = this.button_size.clone();
	
	if(this.mode === TabGroup.TOP || this.mode === TabGroup.BOTTOM)
	{
		if(button_size.x * this.options.length > this.size.x)
		{
			button_size.x = this.size.x / this.options.length;
			offset.x = button_size.x;
		}
		tab_size.y -= this.button_size.y;
		offset.y = 0;
	}
	else if(this.mode === TabGroup.LEFT || this.mode === TabGroup.RIGHT)
	{
		if(button_size.y * this.options.length > this.size.y)
		{
			button_size.y = this.size.y / this.options.length;
			offset.y = button_size.y;
		}
		tab_size.x -= this.button_size.x;
		offset.x = 0;
	}

	//Update tabs
	for(var i = 0; i < this.options.length; i++)
	{
		var tab = this.options[i];
		tab.visible = this.visible && (this.selected === i);
		tab.size.copy(tab_size);
		tab.updateInterface();

		var button = tab.button;
		button.visible = this.visible;
		button.size.copy(button_size);
		button.position.copy(offset);
		button.position.multiplyScalar(i);
		button.updateInterface();
	}

	//Visibility
	if(this.visible)
	{
		this.tab.style.visibility = "visible";
		this.buttons.style.visibility = "visible";
		this.element.style.visibility = "visible";
	}
	else
	{
		this.tab.style.visibility = "hidden";
		this.buttons.style.visibility = "hidden";
		this.element.style.visibility = "hidden";
	}

	if(this.mode === TabGroup.TOP)
	{
		this.buttons.style.top = "0px";
		this.buttons.style.left = "0px";
		this.buttons.style.width = this.size.x + "px";
		this.buttons.style.height = this.button_size.y + "px";

		this.tab.style.left = "0px";
		this.tab.style.top = this.button_size.y + "px";
		this.tab.style.width = this.size.x + "px";
		this.tab.style.height = (this.size.y - this.button_size.y) + "px";
	}
	else if(this.mode === TabGroup.LEFT)
	{
		this.buttons.style.top = "0px";
		this.buttons.style.left = "0px";
		this.buttons.style.width = this.button_size.x + "px";
		this.buttons.style.height = this.size.y + "px";

		this.tab.style.left = this.button_size.x + "px";
		this.tab.style.top = "0px";
		this.tab.style.width = (this.size.x - this.button_size.x) + "px";
		this.tab.style.height = this.size.y + "px";
	}
	else if(this.mode === TabGroup.RIGHT)
	{
		this.buttons.style.top = "0px";
		this.buttons.style.left = (this.size.x - this.button_size.x) + "px";
		this.buttons.style.width = this.button_size.x + "px";
		this.buttons.style.height = this.size.y + "px";

		this.tab.style.left = "0px";
		this.tab.style.top = "0px";
		this.tab.style.width = (this.size.x - this.button_size.x) + "px";
		this.tab.style.height = this.size.y + "px";
	}
	else if(this.mode === TabGroup.BOTTOM)
	{
		this.buttons.style.top = (this.size.y - this.button_size.y) + "px";
		this.buttons.style.left = "0px";
		this.buttons.style.width = this.size.x + "px";
		this.buttons.style.height = this.button_size.y + "px";

		this.tab.style.left = "0px";
		this.tab.style.top = "0px";
		this.tab.style.width = this.size.x + "px";
		this.tab.style.height = (this.size.y - this.button_size.y) + "px";
	}

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
	this.empty.style.width = this.size.x + "px";
	this.empty.style.height = this.size.y + "px";
}
