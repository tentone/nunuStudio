function Canvas(parent)
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
	var id = "canvas" + Canvas.id;
	Canvas.id++;

	//Create canvas
	this.element = document.createElement("canvas");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.top = "0px";
	this.element.style.left = "0px";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//Canvas conter
Canvas.id = 0;

//Functions Prototype
Canvas.prototype.update = update;
Canvas.prototype.updateInterface = updateInterface;
Canvas.prototype.destroy = destroy;

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update Canvas
function update(){}

//Update division Size
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

	this.element.width = this.size.x;
	this.element.height = this.size.y;

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}