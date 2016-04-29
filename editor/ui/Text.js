function Text(parent)
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
	var id = "txt" + Text.id;
	Text.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "text";
	
	//Text
	this.span = document.createElement("span");
	this.span.innerHTML = "text";
	this.element.appendChild(this.span);

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	this.text = "text";
	this.text_size = 12;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Text conter
Text.id = 0;

//Text alignment
Text.CENTER = 0;
Text.LEFT = 1;

//Functions Prototype
Text.prototype.update = update;
Text.prototype.updateInterface = updateInterface;
Text.prototype.destroy = destroy;
Text.prototype.setAlignment = setAlignment;
Text.prototype.setText = setText;
Text.prototype.setTextSize = setTextSize;

//Set Text
function setText(text)
{
	this.text = text;
	this.span.innerHTML = this.text;
}

//Set Text Size
function setTextSize(size)
{
	this.text_size = size;
	this.element.style.fontSize = size + "px";
}

//Set text alignment
function setAlignment(align)
{
	if(align === Text.CENTER)
	{
		this.element.className = "text";
	}
	else if(align === Text.LEFT)
	{
		this.element.className = "text_left";
	}
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
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.span.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.span.style.visibility = "hidden";
	}

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}