function ButtonDrawer(parent)
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
	var id = "but_drawer" + ButtonDrawer.id;
	ButtonDrawer.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Image and Callback
	this.image = "";
	this.callback = null;

	//Options
	this.elements_per_line = 3;
	this.options = [];
	this.expanded = false;

	//Click event
	var self = this;
	this.element.onclick = function()
	{
		self.expanded = !self.expanded;
		self.updateInterface();
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

	//Add element to document
	this.parent.appendChild(this.element);
}

//ButtonDrawer ID counter
ButtonDrawer.id = 0;

//Functions Prototype
ButtonDrawer.prototype.setImage = setImage;
ButtonDrawer.prototype.update = update;
ButtonDrawer.prototype.updateInterface = updateInterface;
ButtonDrawer.prototype.setCallback = setCallback;
ButtonDrawer.prototype.destroy = destroy;

//Remove element
function destroy()
{
	for(var k = 0; k < this.options.length; k++)
	{
		this.options[k].destroy();
	}
	this.parent.removeChild(this.element);
}

//Update
function update(){}

//Set button callback function
function setCallback(callback)
{
	this.callback = callback;
}

//Set ButtonDrawer
function setImage(image)
{
	this.image = image;
}

//Update Interface
function updateInterface()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	this.element.innerHTML = '<img src="' + this.image + '" width="' + this.size.x + '" height="' + this.size.y +'">';
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}