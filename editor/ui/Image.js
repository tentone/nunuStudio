function Image(parent)
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
	var id = "img" + Image.id;
	Image.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

	//Image
	this.img = document.createElement("img");
	this.img.style.position = "absolute";
	this.img.style.top = "0px";
	this.img.style.left = "0px";

	//Add image to div
	this.element.appendChild(this.img);

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.image = "";
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//Image ID counter
Image.id = 0;

//Functions Prototype
Image.prototype.setImage = setImage;
Image.prototype.update = update;
Image.prototype.updateInterface = updateInterface;
Image.prototype.destroy = destroy;

//Remove element
function destroy()
{
	this.parent.removeChild(this.element);
}

//Update
function update(){}

//Set Image
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

	this.img.src = this.image;
	this.img.width = this.size.x;
	this.img.height = this.size.y;

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}