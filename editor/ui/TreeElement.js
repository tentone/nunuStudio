function TreeElement(container)
{
	//ID
	var id = "tree_elem" + TreeElement.id;
	TreeElement.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "button_left_light";

	//Elements	
	this.icon = document.createElement("img");
	this.icon.style.left = "00px";
	this.icon.style.top = "0px";
	this.icon.style.width = "10px";
	this.icon.style.height = "10px";

	this.span = document.createElement("span");
	this.span.style.left = "50px";
	this.span.style.top = "0px";
	this.span.innerHTML = "text";

	this.arrow = document.createElement("img");
	this.arrow.style.width = "10px";
	this.arrow.style.height = "10px";

	//Elements
	this.element.appendChild(this.icon);
	this.element.appendChild(this.span);
	this.element.appendChild(this.arrow);

	//Element atributes
	this.size = new THREE.Vector2(0, 0);
	this.position = new THREE.Vector2(0, 0);
	this.visible = true;
	
	//Icon and arrow size
	this.icon_size = new THREE.Vector2(15, 15);

	//Content
	this.folded = false;
	this.text = "text";
	this.icon_image = "editor/files/icons/models/models.png";
	this.obj = null;
	this.container = container;
	this.childs = [];

	//Mouse events
	var self = this;
	this.element.onmouseover = function()
	{
		self.element.className = "button_left_over";
	};
	this.element.onmouseout = function()
	{
		self.element.className = "button_left_light";
	};
	this.element.onclick = function()
	{
		Editor.selected_object = self.obj;
	};

	//Add element to document
	this.container.div_a.appendChild(this.element);
}

//TreeElement conter
TreeElement.id = 0;

//Functions Prototype
TreeElement.prototype.update = update;
TreeElement.prototype.updateInterface = updateInterface;
TreeElement.prototype.destroy = destroy;
TreeElement.prototype.setText = setText;
TreeElement.prototype.setIcon = setIcon;

//Set text
function setText(text)
{
	this.text = text;
	this.span.innerHTML = this.text;
}

//Set Icon
function setIcon(image)
{
	this.icon_image = image;
	this.icon.src = this.icon_image;
}

//Remove element
function destroy()
{
	this.parent.removeChild(this.element);
}

//Update TreeElement
function update(){}

//Update division Size
function updateInterface()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.span.style.visibility = "visible";
		this.icon.style.visibility = "visible";
		this.arrow.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.span.style.visibility = "hidden";
		this.icon.style.visibility = "hidden";
		this.arrow.style.visibility = "hidden";
	}

	if(this.container.size !== undefined)
	{
		this.size.x = this.container.size.x;
	}

	this.icon.src = this.icon_image;
	this.icon.style.left = "0px";
	this.icon.style.top = ((this.size.y - this.icon_size.y)/2) + "px";
	this.icon.style.width = this.icon_size.x + "px";
	this.icon.style.height = this.icon_size.y + "px";

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
