function File(parent)
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
	var id = "file" + File.id;
	File.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

	//Image
	this.img = document.createElement("img");
	this.img.style.position = "absolute";
	this.img.style.top = "0px";
	this.img.style.left = "0px";
	this.element.appendChild(this.img);

	//Text
	this.span = document.createElement("span");
	this.span.style.position = "absolute";
	this.span.style.top = "0px";
	this.span.style.left = "0px";
	this.element.appendChild(this.span);

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Image and Callback
	this.scale = new THREE.Vector2(1,1);

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

//File ID counter
File.id = 0;

//Functions Prototype
File.prototype.setIcon = setIcon;
File.prototype.update = update;
File.prototype.updateInterface = updateInterface;
File.prototype.setCallback = setCallback;
File.prototype.destroy = destroy;

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

//Set file label
function setLabel(text)
{
	this.span.innerHTML = this.text;
}

//Set file icon
function setIcon(image)
{
	this.img.src = this.image;
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

	this.img.width = this.size.x * this.scale.x;
	this.img.height = this.size.y * this.scale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";
	this.img.style.top = ((this.size.y - (this.size.y * this.scale.y))/2) + "px";
	
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}