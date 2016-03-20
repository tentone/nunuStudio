function ThreeElement(parent)
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
	var id = "div" + ThreeElement.id;
	ThreeElement.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "panel";
	
	//Elements	
	this.icon = document.createElement("img");
	this.icon.style.left = "0px";
	this.icon.style.top = "0px";
	this.icon.style.width = "8px";
	this.icon.style.height = "8px";

	this.text = document.createElement("span");
	this.text.style.left = "10px";
	this.text.style.top = "0px";

	this.arrow = document.createElement("img");

	//Elements
	this.element.appendChild(this.icon);
	this.element.appendChild(this.text);
	this.element.appendChild(this.arrow);

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Childs
	this.childs = [];

	//Add element to document
	this.parent.appendChild(this.element);
}

//ThreeElement conter
ThreeElement.id = 0;

//Functions Prototype
ThreeElement.prototype.update = update;
ThreeElement.prototype.updateInterface = updateInterface;
ThreeElement.prototype.destroy = destroy;

//Remove element
function destroy()
{
	this.parent.removeChild(this.element);
}

//Update ThreeElement
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
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}