function ButtonImageToggle(parent)
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
	var id = "but_img_tog" + ButtonImageToggle.id;
	ButtonImageToggle.id++;

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
	this.selected = false;
	this.image_scale = new THREE.Vector2(1,1);
	this.image = "";
	this.callback = function()
	{
		self.selected = !self.selected;
	};

	//Click event
	var self = this;
	this.element.onclick = function()
	{
		if(self.callback != null)
		{
			self.callback();
		}
	};

	//Mouse over and mouse out events
	this.element.onmouseover = function()
	{
		self.element.className = "button_over";
	};

	this.element.onmouseout = function()
	{
		if(!self.selected)
		{
			self.element.className = "button";
		}
	};

	//Add element to document
	this.parent.appendChild(this.element);
}

//ButtonImageToggle ID counter
ButtonImageToggle.id = 0;

//Functions Prototype
ButtonImageToggle.prototype.setImage = setImage;
ButtonImageToggle.prototype.update = update;
ButtonImageToggle.prototype.updateInterface = updateInterface;
ButtonImageToggle.prototype.setCallback = setCallback;
ButtonImageToggle.prototype.destroy = destroy;

//Remove element
function destroy()
{
	this.parent.removeChild(this.element);
}

//Update
function update(){}

//Set button callback function
function setCallback(callback)
{
	this.callback = callback;
}

//Set ButtonImageToggle
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

	if(this.selected)
	{
		this.element.className = "button_over";
	}
	else
	{
		this.element.className = "button";
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