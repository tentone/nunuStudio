function Button(parent)
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
	var id = "but" + Button.id;
	Button.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "button";

	//Text
	this.text = new Text(this.element);
	this.text.setText("text");

	//Children elements
	this.children = [];

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Self pointer
	var self = this;

	//Mouse over and mouse out events
	this.element.onmouseover = function()
	{
		self.element.className = "button_over";
	};

	this.element.onmouseleave = function()
	{
		self.element.className = "button";
	};

	//Update element
	this.updateInterface();

	//Add element to document
	this.parent.appendChild(this.element);
}

//Button conter
Button.id = 0;

//Functions Prototype
Button.prototype.update = update;
Button.prototype.updateInterface = updateInterface;
Button.prototype.destroy = destroy;
Button.prototype.setClass = setClass;
Button.prototype.setText = setText;
Button.prototype.setCallback = setCallback;
Button.prototype.add = add;

//Add extra element to button
function add(element)
{
	this.children.push(element);
}

//Set Button text
function setText(text)
{
	this.text.setText(text);
}

//Set element class
function setClass(name)
{
	this.element.className = name;
}

//Remove element from document
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
		for(var i = 0; i < this.children.length; i++)
		{
			this.children[i].destroy();
		}
	}
	catch(e){}
}

//Update status
function update(){}

//Set button callback function
function setCallback(callback)
{
	this.element.onclick = callback;
}

//Update Button Size
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

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].visible = this.visible;
		this.children[i].updateInterface();
	}

	this.text.size.set(this.size.x, this.size.y);
	this.text.visible = this.visible;
	this.text.updateInterface();

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}