"use strict";

function Slider(parent)
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
	var id = "slider" + Slider.id;
	Slider.id++;

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
	this.text.style.color = Editor.theme.text_color;
	this.parent.appendChild(this.text);

	//On Change callback
	this.onchange = null;

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Slider ID counter
Slider.id = 0;

//Functions Prototype
Slider.prototype.update = update;
Slider.prototype.updateInterface = updateInterface;
Slider.prototype.destroy = destroy;
Slider.prototype.getValue = getValue;
Slider.prototype.setValue = setValue;
Slider.prototype.setOnChange = setOnChange;
Slider.prototype.setRange = setRange;
Slider.prototype.setStep = setStep;
Slider.prototype.setDisabled = setDisabled;

//Set if element if disabled
function setDisabled(value)
{
	this.element.disabled = value;
}

//Set slider min step
function setStep(step)
{
	this.element.step = String(step);
}

//Set slider range
function setRange(min, max)
{
	this.element.min = String(min);
	this.element.max = String(max);
}

//Set onchange callback
function setOnChange(callback)
{
	this.onchange = callback;
}

//Get Slider value
function setValue(value)
{
	this.element.value = value;
	this.text.innerHTML = value;
}

//Get Slider value
function getValue()
{
	return this.element.value;
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
		this.parent.removeChild(this.text);
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

	this.text.style.top = this.position.y + "px";
	this.text.style.left = (this.position.x + this.size.x) + "px";
	this.text.style.height = this.size.y + "px";

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}