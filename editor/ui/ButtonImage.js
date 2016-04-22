function ButtonImage(parent)
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
	var id = "but_img" + ButtonImage.id;
	ButtonImage.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

	//Image
	this.img = document.createElement("img");
	this.img.style.position = "absolute";
	this.img.style.top = "0px";
	this.img.style.left = "0px";

	//Add image to button
	this.element.appendChild(this.img);

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Image and Callback
	this.image_scale = new THREE.Vector2(1,1);
	this.image = "";

	//Click event
	var self = this;

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

//ButtonImage ID counter
ButtonImage.id = 0;

//Functions Prototype
ButtonImage.prototype.setImage = setImage;
ButtonImage.prototype.update = update;
ButtonImage.prototype.updateInterface = updateInterface;
ButtonImage.prototype.setCallback = setCallback;
ButtonImage.prototype.destroy = destroy;
ButtonImage.prototype.setAltText = setAltText;

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
function update(){}

//Set button callback function
function setCallback(callback)
{
	this.element.onclick = callback;
}

//Set ButtonImage
function setImage(image)
{
	this.image = image;
	this.img.src = this.image;
}

//Set alt text
function setAltText(text)
{
	this.img.alt = text;
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
	this.img.width = this.size.x * this.image_scale.x;
	this.img.height = this.size.y * this.image_scale.y;

	this.img.style.left = ((this.size.x - (this.size.x * this.image_scale.x))/2) + "px";
	this.img.style.top = ((this.size.y - (this.size.y * this.image_scale.y))/2) + "px";
	
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}