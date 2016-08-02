"use strict";

function TextBox(parent)
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
	var id = "txt_box" + TextBox.id;
	TextBox.id++;

	//Create element
	this.element = document.createElement("input");
	this.element.type = "text";
	this.element.style.position = "absolute";
	this.element.style.backgroundColor = Editor.theme.box_color;
	this.element.style.color = Editor.theme.text_color;
	this.element.style.borderStyle = "none";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//TextBox ID counter
TextBox.id = 0;

//Functions Prototype
TextBox.prototype.update = update;
TextBox.prototype.updateInterface = updateInterface;
TextBox.prototype.destroy = destroy;
TextBox.prototype.setText = setText;
TextBox.prototype.getText = getText;
TextBox.prototype.setOnChange = setOnChange;
TextBox.prototype.setDisabled = setDisabled;

//Set if element if disabled
function setDisabled(value)
{
	this.element.disabled = value;
}

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