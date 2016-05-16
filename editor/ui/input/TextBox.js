function Textbox(parent)
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
	var id = "txt_box" + Textbox.id;
	Textbox.id++;

	//Create element
	this.element = document.createElement("input");
	this.element.type = "text";
	this.element.className = "text_box";
	this.element.style.position = "absolute";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//Textbox ID counter
Textbox.id = 0;

//Functions Prototype
Textbox.prototype.update = update;
Textbox.prototype.updateInterface = updateInterface;
Textbox.prototype.destroy = destroy;
Textbox.prototype.setText = setText;
Textbox.prototype.getText = getText;
Textbox.prototype.setOnChange = setOnChange;

//Set onchange callback
function setOnChange(callback)
{
	this.element.onchange = callback;
}

//Set text
function setText(text)
{
	this.element.value = text;
}

//Get text
function getText()
{
	return this.element.value;
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
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}