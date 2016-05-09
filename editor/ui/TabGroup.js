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
TabGroup.prototype.removeAllOptions = removeAllOptions;
TabGroup.prototype.updateOptionIndex = updateOptionIndex;
TabGroup.prototype.selectOption = selectOption;
TabGroup.prototype.closeActual = closeActual;

//If actual tab is closeable close it
function closeActual()
{
	if(this.options_selected !== -1)
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
	if(index >= 0 && index < this.options.length)
	{
		this.options_selected = index;
		this.options[index].activate();
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

//Remove tab
function removeAllOptions()
{
	while(this.options.length > 0)
	{
		this.options.pop().destroy();
	}
	
	this.options_selected = -1;	
	this.updateOptionIndex();
	this.updateInterface();
}

//Remove tab
function removeOption(index)
{
	if(index >= 0 && index < this.options.length)
	{
		this.options[index].destroy();
		this.options.splice(index, 1);

		this.updateOptionIndex();
		this.updateInterface();

		if(this.options_selected >= this.options.length)
		{
			this.selectOption(this.options.length - 1);
		}
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
	if(this.options_selected !== -1)
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
