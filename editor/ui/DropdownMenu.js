function DropdownMenu(parent)
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
	var id = "dropmenu" + Button.id;
	DropdownMenu.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "button";
	this.element.style.zIndex = "100";

	//Text
	this.text = new Text(this.element);
	this.text.setText("text");
	this.text.position.set(0, 0);
	this.text.size.set(0 , 0);

	//Atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Options
	this.options = [];
	this.expanded = false;

	//Click event
	var self = this;

	//Mouse over and mouse out events
	this.element.onmouseover = function()
	{
		self.expanded = true;
		self.updateInterface();
		self.element.className = "button_over";
	};

	this.element.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
		self.element.className = "button";
	};

	//Update element
	this.updateInterface();

	//Add element to document
	this.parent.appendChild(this.element);
}

//DropdownMenu ID counter
DropdownMenu.id = 0;

//Functions Prototype
DropdownMenu.prototype.update = update;
DropdownMenu.prototype.updateInterface = updateInterface;
DropdownMenu.prototype.addOption = addOption;
DropdownMenu.prototype.removeOption = removeOption;
DropdownMenu.prototype.destroy = destroy;
DropdownMenu.prototype.setText = setText;

//Set Text
function setText(text)
{
	this.text.setText(text);
}

//Remove element
function destroy()
{
	try
	{
		for(var k = 0; k < this.options.length; k++)
		{
			this.options[k].destroy();
		}
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
function update(){}

//Remove option from dropdown menu
function removeOption(index)
{
	if(index >= 0 && index < this.options.length)
	{
		this.options[index].destroy();
		this.options.splice(index, 1);
		this.updateInterface();
	}
}

//Add new Option to dropdown menu
function addOption(name, callback)
{
	var button = new Button(this.element);
	button.element.style.zIndex = "10";
	button.setText(name);
	button.visible = this.expanded;
	button.updateInterface();
	
	var self = this;
	button.callback = function()
	{
		callback();
		self.expanded = false;
		self.updateInterface();
	};

	this.options.push(button);
	this.updateInterface();
}

//Update interface
function updateInterface()
{
	//Update Options
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].size.set(this.size.x, this.size.y);
		this.options[i].position.set(0, (this.size.y*(i+1)));
		this.options[i].visible = (this.expanded && this.visible);
		this.options[i].updateInterface();
	}

	//Update text
	this.text.size.set(this.size.x, this.size.y);
	this.text.visible = this.visible;
	this.text.updateInterface();

	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Element position and size
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";

	if(this.expanded)
	{
		this.element.style.height = (this.size.y * (this.options.length + 1))+ "px";
	}
	else
	{
		this.element.style.height = this.size.y + "px";
	}
}