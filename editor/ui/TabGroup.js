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
	this.element.className = "container";
	
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
	
	//Tab Options
	this.options_size = new THREE.Vector2(150, 30);
	this.options_selected = -1;
	this.options = [];

	//Add element to document
	this.parent.appendChild(this.element);
}

//TabGroup conter
TabGroup.id = 0;

//Functions Prototype
TabGroup.prototype.update = update;
TabGroup.prototype.updateInterface = updateInterface;
TabGroup.prototype.destroy = destroy;
TabGroup.prototype.addOption = addOption;
TabGroup.prototype.removeOption = removeOption;
TabGroup.prototype.clear = clear;
TabGroup.prototype.updateOptionIndex = updateOptionIndex;
TabGroup.prototype.selectOption = selectOption;
TabGroup.prototype.closeActual = closeActual;
TabGroup.prototype.getActual = getActual;

//Get actual tab
function getActual()
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
function closeActual()
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
function selectOption(index)
{
	if(index > -1 && index < this.options.length)
	{
		this.options_selected = index;
		this.options[index].activate();
		this.updateInterface();
	}
	else
	{
		this.options_selected = -1;
		this.updateInterface();
	}
}

//Add tab
function addOption(name, image, closeable)
{
	var option = new TabElement(name, image, closeable, this, this.options.length);
	this.options.push(option);
	if(this.options_selected === -1)
	{
		this.selectOption(0);
	}

	return option;
}

//Remove all tabs
function clear()
{
	while(this.options.length > 0)
	{
		this.options.pop().destroy();
	}
	
	this.selectOption(-1);
	this.updateOptionIndex();
	this.updateInterface();
}

//Remove tab from group
function removeOption(index)
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
			this.selectOption(index - 1);
		}
		else
		{
			this.selectOption(-1);
		}

		//Update interface
		this.updateInterface();
	}
}

//Update options index
function updateOptionIndex()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].index = i;
	}
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

//Update TabGroup
function update()
{
	if(this.options_selected > -1)
	{
		this.options[this.options_selected].update();
	}
}

//Update division Size
function updateInterface()
{
	for(var i = 0; i < this.options.length; i++)
	{
		if(this.options_selected == i)
		{
			this.options[i].visible = true;
		}
		else
		{
			this.options[i].visible = false;
		}
		
		this.options[i].size.set(this.size.x, this.size.y);
		this.options[i].updateInterface();
	}

	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
