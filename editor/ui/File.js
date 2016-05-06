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
	var id = "fi" + File.id;
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
	this.text = new Text(this.element);
	this.text.updateInterface();

	//Element atributes
	this.size = new THREE.Vector2(50, 50);
	this.position = new THREE.Vector2(0, 0);
	this.visible = true;

	//Image and Callback
	this.scale = new THREE.Vector2(0.6, 0.6);

	//Click event
	var self = this;

	//Mouse over event
	this.element.onmouseover = function()
	{
		self.element.className = "button_over";
	};

	//Mouse leave event
	this.element.onmouseleave = function()
	{
		self.element.className = "";
	};

	//Add element to document
	this.parent.appendChild(this.element);
}

//File ID counter
File.id = 0;

//Functions Prototype
File.prototype.update = update;
File.prototype.updateInterface = updateInterface;
File.prototype.destroy = destroy;

File.prototype.setIcon = setIcon;
File.prototype.setText = setText;
File.prototype.setCallback = setCallback;

//Set file icon
function setIcon(image)
{
	this.img.src = image;
}

//Set file label
function setText(text)
{
	this.text.setText(text);
}

//Set button callback function
function setCallback(callback)
{
	this.element.onclick = callback;
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

//Update
function update(){}

//Update Interface
function updateInterface()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update element
	this.img.width = this.size.x * this.scale.x;
	this.img.height = this.size.y * this.scale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";

	this.text.visible = this.visible;
	this.text.size.x = this.size.x;
	this.text.position.y = (this.size.y * this.scale.y);
	this.text.size.y = this.size.y - this.text.position.y;
	this.text.updateInterface();
	
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}