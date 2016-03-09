function DropdownMenu(parent, id)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = null;
	}
	else
	{
		this.parent = parent;
	}

	//Id
	var id = "dropdownmenu" + Button.id;
	DropdownMenu.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "button";

	//Atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Button text
	this.text = "text";

	//Options
	this.options = [];
	this.expanded = false;

	//Click event
	var self = this;
	this.element.onclick = function()
	{
		this.expanded = !this.expanded;
	};

	//Mouse over and mouse out events
	this.element.onmouseover = function()
	{
		self.element.className = "button_over";
	};

	this.element.onmouseout = function()
	{
		self.element.className = "button";
	};

	//Update element
	this.updateInterface();

	//Add element to document
	document.body.appendChild(this.element);
}

//DropdownMenu conter
DropdownMenu.id = 0;

//Functions Prototype
DropdownMenu.prototype.update = update;
DropdownMenu.prototype.updateInterface = updateInterface;
DropdownMenu.prototype.addOption = addOption;

//Update status
function update(){}

//Set dropdown
function addOption(name, callback)
{
	var button = new Button(this);
	button.text = name;
	button.callback = callback;
	button.visible = true;
	button.updateInterface();

	this.options.push(button);
	this.updateInterface();
}

//Update interface
function updateInterface()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].size.set(this.size.x, this.size.y);
		this.options[i].position.set(this.position.x, this.position.y + (this.size.y*(i+1)));
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
	this.element.innerHTML = "<span>" + this.text + "</span>";
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}