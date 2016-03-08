function Division(id)
{
	if(id === undefined)
	{
		var id = "div" + Division.id;
		Division.id++;
	}

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.top = "0px";
	this.element.style.left = "0px";
	this.element.style.backgroundColor = "#444444";

	//Add element to document
	document.body.appendChild(this.element);
}

//Division conter
Division.id = 0;

//Functions Prototype
Division.prototype.setWidth = setWidth;
Division.prototype.setHeight = setHeight;
Division.prototype.getWidth = getWidth;
Division.prototype.getHeight = getHeight;
Division.prototype.setSize = setSize;
Division.prototype.setPosition = setPosition;
Division.prototype.updateSize = updateSize;

//Set division width
function setWidth(value)
{
	this.element.width = value;
}

//Set division height
function setHeight(value)
{
	this.element.height = value;
}

//Get division width
function getWidth()
{
	return this.element.width;
}

//Get division height
function getHeight()
{
	return this.element.height;
}

//Set division Size
function setSize(width, height)
{
	this.setWidth(width);
	this.setHeight(height);
}

//Set Position
function setPosition(left, top)
{
	this.element.style.top = top + "px";
	this.element.style.left = left + "px";
}

//Update division Size
function updateSize()
{
	this.element.style.width = this.element.width + "px";
	this.element.style.height = this.element.height + "px";
}