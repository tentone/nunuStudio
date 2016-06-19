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
	this.img.style.top = "5px";
	this.element.appendChild(this.img);

	//Text
	this.text = new Text(this.element);
	this.text.updateInterface();

	//Element atributes
	this.size = new THREE.Vector2(0, 0);
	this.position = new THREE.Vector2(0, 0);
	this.visible = true;

	//Icon scale
	this.scale = new THREE.Vector2(0.7, 0.7);

	//Mouse over event
	this.element.onmouseenter = function()
	{
		self.element.className = "button_over";
	};

	//Mouse leave event
	this.element.onmouseleave = function()
	{
		self.element.className = "";
	};

	//Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
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
File.prototype.setParent = setParent;

//Set parent
function setParent(parent)
{
	if(parent !== this.parent)
	{
		this.parent = parent;
		this.parent.appendChild(this.element);
	}
}

//Set file icon
function setIcon(image)
{
	this.img.src = image;
}

//Set file label
function setText(text)
{
	if(text.length > 8)
	{
		text = text.slice(0,8) + "...";
	}

	this.text.setText(text);
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

	//Update image
	this.img.width = this.size.x * this.scale.x;
	this.img.height = this.size.y * this.scale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";

	//Update file text
	this.text.visible = this.visible;
	this.text.size.x = this.size.x;
	this.text.position.y = (this.size.y - 20);
	this.text.size.y = this.size.y - this.text.position.y;
	this.text.updateInterface();
	
	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}