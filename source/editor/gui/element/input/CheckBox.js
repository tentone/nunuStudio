"use strict";

function CheckBox(parent)
{
	Element.call(this, parent, "div");

	var self = this;

	this.element.style.display = "block";
	this.element.style.boxSizing = "border-box";
	this.element.style.cursor = "pointer";
	this.element.style.backgroundColor = Editor.theme.boxColor;
	this.element.style.borderRadius = "4px";
	this.element.onclick = function()
	{
		self.setValue(!self.value);
		
		if(self.onChange !== null)
		{
			self.onChange(self.value);
		}
	};

	this.check = document.createElement("img");
	this.check.style.pointerEvents = "none";
	this.check.style.visibility = "hidden";
	this.check.style.position = "absolute";
	this.check.style.top = "15%";
	this.check.style.left = "15%";
	this.check.style.width = "70%";
	this.check.style.height = "70%";
	this.check.src = Editor.filePath + "icons/misc/check.png";
	this.element.appendChild(this.check);

	this.value = false;

	this.onChange = null;
};

CheckBox.prototype = Object.create(Element.prototype);

//Set if element if disabled
CheckBox.prototype.setDisabled = function(value)
{
	this.element.disabled = value;
};

//Set checkbox value
CheckBox.prototype.setValue = function(value)
{
	this.value = value;
	this.check.style.visibility = this.value ? "visible" : "hidden";
};

//Get checkbox value
CheckBox.prototype.getValue = function()
{
	return this.value;
};

//Set onchange onChange
CheckBox.prototype.setOnChange = function(onChange)
{
	this.onChange = onChange;
};

CheckBox.prototype.updateVisibility = function()
{
	this.element.style.visibility = this.visible ? "visible" : "hidden";
};
