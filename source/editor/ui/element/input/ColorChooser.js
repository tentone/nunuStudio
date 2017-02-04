"use strict";

function ColorChooser(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Create element
	this.element = document.createElement("input");
	this.element.type = "text";
	this.element.style.position = "absolute";
	this.element.style.backgroundColor = Editor.theme.boxColor;
	this.element.style.color = Editor.theme.textColor;
	this.element.style.borderStyle = "none";

	//Color chooser
	this.color = new jscolor(this.element);
	this.color.backgroundColor = Editor.theme.boxColor;
	this.color.insetColor = Editor.theme.boxColor;
	this.color.shadow = false;
	this.color.borderWidth = 0;
	this.color.borderRadius = 0;
	this.color.zIndex = 2000;

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	this.onChange = null;

	//Click event
	var self = this;
	this.element.onchange = function()
	{
		if(self.onChange !== null)
		{
			self.onChange();
		}
	};

	//Add element to document
	this.parent.appendChild(this.element);
}

//Set onchange onChange
ColorChooser.prototype.setOnChange = function(onChange)
{
	this.element.onchange = onChange;
}

//Set color
ColorChooser.prototype.setValue = function(r, g, b)
{
	this.color.fromRGB(r*255, g*255, b*255);
}

//Set color value hex
ColorChooser.prototype.setValueHex = function(hex)
{
	hex = Math.floor(hex);
	this.color.fromRGB(hex >> 16 & 255, hex >> 8 & 255, hex & 255);
}

//Get color value
ColorChooser.prototype.getValue = function()
{
	return {r: this.color.rgb[0]/255, g: this.color.rgb[1]/255, b: this.color.rgb[2]/255};
}

//Get color value hex
ColorChooser.prototype.getValueHex = function()
{
	return (this.color.rgb[0] << 16 ^ this.color.rgb[1] << 8 ^ this.color.rgb[2] << 0);
}

//Remove element
ColorChooser.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
ColorChooser.prototype.update = function(){}

//Update Interface
ColorChooser.prototype.updateInterface = function()
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