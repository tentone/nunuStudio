"use strict";

function DropdownList(parent)
{
	Element.call(this, parent, "div");

	//Select
	this.select = document.createElement("select");
	this.select.style.backgroundColor = Editor.theme.boxColor;
	this.select.style.color = Editor.theme.textColor;
	this.select.style.left = "0px";
	this.select.style.top = "0px";
	this.select.style.borderStyle = "none";
	this.select.style.boxSizing = "border-box";
	this.select.style.borderRadius = "4px";
	this.select.style.outline = "none";
	this.select.style.cursor = "pointer";
	this.select.style.MozAppearance = "textfield";
	this.select.style.webkitAppearance = "caret";
	this.select.style.appearance = "textfield";
	this.element.appendChild(this.select);

	//Arrow
	this.arrow = document.createElement("img");
	this.arrow.style.display = "block";
	this.arrow.style.position = "absolute";
	this.arrow.style.pointerEvents = "none";
	this.arrow.style.right = "6px";
	this.arrow.style.top = "5px";
	this.arrow.style.width = "10px";
	this.arrow.style.height = "10px";
	this.arrow.src = Editor.filePath + "icons/misc/arrow_down.png";
	this.element.appendChild(this.arrow);

	//Attributes
	this.values = [];
}

DropdownList.prototype = Object.create(Element.prototype);

//Set if element if disabled
DropdownList.prototype.setDisabled = function(value)
{
	this.select.disabled = value;
}

//Set onchange onChange
DropdownList.prototype.setOnChange = function(onChange)
{
	this.select.onchange = onChange;
}

//Add element
DropdownList.prototype.addValue = function(text, value)
{
	var option = document.createElement("option");
	option.appendChild(document.createTextNode(text));
	this.values.push(value);
	this.select.appendChild(option);
}

//Remove all element from dropdown
DropdownList.prototype.clearValues = function()
{
	this.values = [];
	for(var i = 0; i < this.select.children.length; i++)
	{
		this.select.removeChild(this.select.children[i]);
	}
};


//Get DropdownList value
DropdownList.prototype.getValue = function()
{
	if(this.select.selectedIndex > -1)
	{
		return this.values[this.select.selectedIndex];
	}
	return null;
}

//Set dropdown list value
DropdownList.prototype.setValue = function(value)
{
	//Get value index
	for(var i = 0; i < this.values.length; i++)
	{
		if(this.values[i] === value)
		{
			this.element.selectedIndex = i;
			break;
		}
	}

	//If value not found set selectedIndex to -1
	if(i === this.values.length)
	{
		this.element.selectedIndex = -1;
	}
}

//Get dropdownlist selected index
DropdownList.prototype.getSelectedIndex = function()
{
	return this.element.selectedIndex;
}

//Set dropdownlist selected index
DropdownList.prototype.setSelectedIndex = function(index)
{
	this.element.selectedIndex = index;
}

//Update Interface
DropdownList.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";

		this.select.style.width = this.size.x + "px";
		this.select.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
}