function Text(parent)
{
	//ID
	var id = "text" + Text.id;
	Text.id++;

	//Create element
	this.element = document.createElement("p");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "text";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	this.text = "text";
	
	//Add element to document
	document.body.appendChild(this.element);
}

//Text conter
Text.id = 0;

//Functions Prototype
Text.prototype.update = update;
Text.prototype.updateInterface = updateInterface;

//Update
function update(){}

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

	this.element.innerHTML = "<span>" + this.text + "</span>";
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}