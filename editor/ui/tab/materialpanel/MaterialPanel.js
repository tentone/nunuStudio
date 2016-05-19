function MaterialPanel(parent)
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
	Panel.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.className = "panel";

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
	this.fit_parent = true;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Object attached
	this.obj = null;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Panel conter
Panel.id = 0;

//Functions Prototype
Panel.prototype.update = update;
Panel.prototype.updateInterface = updateInterface;
Panel.prototype.destroy = destroy;
Panel.prototype.attachObject = attachObject;
Panel.prototype.updatePanel = updatePanel;

//Update panel with object data
function updatePanel(){}

//Attach object to panel
function attachObject(obj)
{
	this.obj = obj;
	this.updatePanel();
	this.updateInterface();
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

//Update Panel
function update(){}

//Update division Size
function updateInterface()
{
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
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
