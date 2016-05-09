function ContextMenu(parent)
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
	var id = "ctx" + Button.id;
	ContextMenu.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "button";
	this.element.style.zIndex = "300";

	//Atributes
	this.size = new THREE.Vector2(100,20);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Options
	this.options = [];

	//Click event
	var self = this;

	//Mouse over and mouse out events
	this.element.onmouseleave = function()
	{
		self.destroy();
	};

	//Update element
	this.updateInterface();

	//Add element to document
	this.parent.appendChild(this.element);
}

//ContextMenu ID counter
ContextMenu.id = 0;

//Functions Prototype
ContextMenu.prototype.update = update;
ContextMenu.prototype.updateInterface = updateInterface;
ContextMenu.prototype.addOption = addOption;
ContextMenu.prototype.removeOption = removeOption;
ContextMenu.prototype.destroy = destroy;
ContextMenu.prototype.setText = setText;

//Set Text
function setText(text)
{
	this.text.setText(text);
}

//Remove element
function destroy()
{
	for(var k = 0; k < this.options.length; k++)
	{
		this.options[k].destroy();
	}
	
	try
	{
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
	button.element.style.zIndex = "10000";
	button.text.setAlignment(Text.LEFT);
	button.text.position.x = 25;
	button.setText(name);
	button.visible = this.expanded;
	button.updateInterface();

	var self = this;
	button.setCallback(function()
	{
		callback();
		self.destroy();
		self.updateInterface();
	});

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
		this.options[i].position.set(0, (this.size.y*i));
		this.options[i].visible = this.visible;
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

	//Element position and size
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = (this.size.y * this.options.length)+ "px";
}