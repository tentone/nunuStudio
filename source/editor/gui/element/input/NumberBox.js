"use strict";

function NumberBox(parent)
{
	Element.call(this, parent, "input");

	this.element.type = "number";
	this.element.step = "0.1";
	this.element.style.backgroundColor = Editor.theme.boxColor;
	this.element.style.color = Editor.theme.textColor;
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.textIndent = "4px";
	this.element.style.borderRadius = "4px";
	this.element.style.boxShadow = "none";
	this.element.style.MozAppearance = "textfield";
	this.element.style.webkitAppearance = "caret";
	this.element.style.appearance = "textfield";
}

NumberBox.prototype = Object.create(Element.prototype);

//Set if element if disabled
NumberBox.prototype.setDisabled = function(value)
{
	this.element.disabled = value;
};

//Set numberbox range
NumberBox.prototype.setRange = function(min, max)
{
	this.element.min = String(min);
	this.element.max = String(max);
};

//Set step
NumberBox.prototype.setStep = function(value)
{
	this.element.step = String(value);
};

//Set onchange onChange
NumberBox.prototype.setOnChange = function(onChange)
{
	this.element.onchange = onChange;
};

//Set value
NumberBox.prototype.setValue = function(value)
{
	this.element.value = value;
};

//Get text
NumberBox.prototype.getValue = function()
{
	return Number.parseFloat(this.element.value);
};

NumberBox.prototype.updateVisibility = function()
{
	this.element.style.visibility = this.visible ? "visible" : "hidden";
};