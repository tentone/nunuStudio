"use strict";

function Slider(parent)
{
	Element.call(this, parent, "input");

	//Self pointer
	var self = this;

	//Slider
	this.element.style.boxSizing = "border-box";
	this.element.type = "range";
	this.element.min = "0";
	this.element.max = "100";
	this.element.onchange = function()
	{
		self.text.innerHTML = self.element.value;

		if(self.onchange !== null)
		{
			self.onchange();
		}
	};

	//Label
	this.text = document.createElement("div");
	this.text.style.position = "absolute";
	this.text.style.pointerEvents = "none";
	this.text.style.display = "flex";
	this.text.style.flexDirection = "column";
	this.text.style.justifyContent = "center";
	this.text.style.textAlign = "center";
	this.text.style.color = Editor.theme.textColor;
	this.parent.appendChild(this.text);

	//onChange
	this.onchange = null;
}

Slider.prototype = Object.create(Element.prototype);

//Set if element if disabled
Slider.prototype.setDisabled = function(value)
{
	this.element.disabled = value;
}

//Set slider min step
Slider.prototype.setStep = function(step)
{
	this.element.step = String(step);
}

//Set slider range
Slider.prototype.setRange = function(min, max)
{
	this.element.min = String(min);
	this.element.max = String(max);
}

//Set onchange onChange
Slider.prototype.setOnChange = function(onChange)
{
	this.onchange = onChange;
}

//Get Slider value
Slider.prototype.setValue = function(value)
{
	this.element.value = value;
	this.text.innerHTML = value;
}

//Get Slider value
Slider.prototype.getValue = function()
{
	return Number.parseFloat(this.element.value);
}

//Remove element
Slider.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
	
	if(this.parent.contains(this.text))
	{
		this.parent.removeChild(this.text);
	}
}

//Update Interface
Slider.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.text.style.visibility = "visible";
		this.text.style.top = this.position.y + "px";
		this.text.style.left = (this.position.x + this.size.x + 13) + "px";
		this.text.style.height = this.size.y + "px";

		this.element.style.visibility = "visible";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.text.style.visibility = "hiden";
	}
}