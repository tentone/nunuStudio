function TabContainer(parent)
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
	var id = "tab_container" + TabContainer.id;
	TabContainer.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "panel";
	
	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Tab Options
	this.options_size = new THREE.Vector2(120, 30);
	this.options_selected = 0;
	this.options_closeable = false;
	this.options = [];

	//Add element to document
	this.parent.appendChild(this.element);
}

function TabOption(name, image, container, index)
{
	this.name = name;
	this.image = image;
	this.force_fill = false;

	//Button
	this.button = new Button(container.element);
	this.button.text = this.name;
	this.button.visible = true;
	this.button.position.set(container.options_size.x*index, 0);
	this.button.size.set(container.options_size.x, container.options_size.y);
	this.button.callback = function()
	{
		container.selected_option = index;
		container.updateInterface();
	};
	this.button.updateInterface();

	//Division
	this.division = new Division(container.element);
	this.division.element.className = "bar";
	this.division.visible = false;
	this.division.position.set(0, container.options_size.y);
	this.division.updateInterface();
}

//TabContainer conter
TabContainer.id = 0;

//Functions Prototype
TabContainer.prototype.update = update;
TabContainer.prototype.updateInterface = updateInterface;
TabContainer.prototype.destroy = destroy;
TabContainer.prototype.addOption = addOption;
TabContainer.prototype.removeOption = removeOption;

//Add tab
function addOption(name, image)
{
	this.options.push(new TabOption(name, image, this, this.options.length));
}

//Remove tab
function removeOption()
{
	//TODO <ADD CODE HERE>
}

//Remove element
function destroy()
{
	this.parent.removeChild(this.element);
}

//Update TabContainer
function update(){}

//Update division Size
function updateInterface()
{
	for(var i = 0; i < this.options.length; i++)
	{
		if(this.options_selected == i)
		{
			this.options[i].division.visible = true;
		}
		else
		{
			this.options[i].division.visible = false;
		}
		this.options[i].division.size.set(this.size.x, this.size.y - this.options_size.y);
		this.options[i].division.updateInterface();
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
