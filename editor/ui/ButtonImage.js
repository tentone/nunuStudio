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
	this.img.style.pointerEvents = "none";
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

	//Mouse over event
	this.element.onmouseenter = function()
	{
		self.element.style.cursor = "pointer";
		self.element.style.backgroundColor = Editor.theme.button_over_color;
	};

	//Mouse leave event
	this.element.onmouseleave = function()
	{
		self.element.style.cursor = "default";
		self.element.style.backgroundColor = "";
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
ButtonImage.prototype.setClass = setClass;
ButtonImage.prototype.setVisibility = setVisibility;

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
function setAltText(alt_text)
{
	var text = new Text(this.element);
	text.element.style.background = Editor.theme.bar_color;
	text.element.style.zIndex = "300";
	text.setText(alt_text);
	text.visible = false;

	text.updateInterface();

	//Mouse mouse move event
	this.element.onmousemove = function(event)
	{
		text.size.set(text.span.clientWidth + 20, 20);
		text.position.set(event.offsetX - text.size.x/2, event.offsetY - 30);
		text.visible = true;
		text.updateInterface();
	};

	//Mouse out event (to avoid overlap with mouse leave event)
	this.element.onmouseout = function()
	{
		text.visible = false;
		text.updateInterface();
	}
}

//Set element class
function setClass(name)
{
	this.element.className = name;
}

//Set button image visibility
function setVisibility(visible)
{
	this.visible = visible;

	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.img.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.img.style.visibility = "hidden";
	}
}

//Update Interface
function updateInterface()
{
	//Update visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.img.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.img.style.visibility = "hidden";
	}

	//Update image
	this.img.width = this.size.x * this.image_scale.x;
	this.img.height = this.size.y * this.image_scale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.image_scale.x))/2) + "px";
	this.img.style.top = ((this.size.y - (this.size.y * this.image_scale.y))/2) + "px";
	
	//Update main element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}