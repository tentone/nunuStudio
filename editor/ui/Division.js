function Division(parent, id)
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
	this.element.style.backgroundColor = "#333333";
	
	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);

	//Add element to document
	document.body.appendChild(this.element);
}

//Division conter
Division.id = 0;

//Functions Prototype
Division.prototype.update = update;
Division.prototype.updateInterface = updateInterface;

function update(){}

//Update division Size
function updateInterface()
{
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}