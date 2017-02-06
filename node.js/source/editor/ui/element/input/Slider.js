"use strict";

function Slider(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Self pointer
	var self = this;

	//Slider
	this.element = document.createElement("input");
	this.element.style.position = "absolute";
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
	this.text.style.marginLeft = "5px";
	this.text.style.display = "flex";
	this.text.style.flexDirection = "column";
	this.text.style.justifyContent = "center";
	this.text.style.textAlign = "center";
	this.text.style.color = Editor.theme.textColor;
	this.parent.appendChild(this.text);

	//On Change onChange
	this.onchange = null;

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Add element to document
	this.parent.appendChild(this.element);
}

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
	return this.element.value;
}

//Remove element
Slider.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
		this.parent.removeChild(this.text);
	}
	catch(e){}
}

//Update
Slider.prototype.update = function(){}

//Update Interface
Slider.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	this.text.style.top = this.position.y + "px";
	this.text.style.left = (this.position.x + this.size.x) + "px";
	this.text.style.height = this.size.y + "px";

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}