"use strict";

function DropdownList(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("select");
	this.element.style.position = "absolute";
	this.element.style.backgroundColor = Editor.theme.boxColor;
	this.element.style.color = Editor.theme.textColor;
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.borderRadius = "4px";
	this.element.style.outline = "none";
	
	//Attributes
	this.values = [];
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Set if element if disabled
DropdownList.prototype.setDisabled = function(value)
{
	this.element.disabled = value;
}

//Set onchange onChange
DropdownList.prototype.setOnChange = function(onChange)
{
	this.element.onchange = onChange;
}

//Add element
DropdownList.prototype.addValue = function(text, value)
{
	var option = document.createElement("option");
	option.innerHTML = text;
	this.values.push(value);
	this.element.appendChild(option);
}

//Remove all element from dropdown
DropdownList.prototype.clearValues = function()
{
	this.values = [];
	for(var i = 0; i < this.element.children.length; i++)
	{
		this.element.removeChild(this.element.children[i]);
	}
};


//Get DropdownList value
DropdownList.prototype.getValue = function()
{
	if(this.element.selectedIndex > -1)
	{
		return this.values[this.element.selectedIndex];
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

//Remove element
DropdownList.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
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
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
}