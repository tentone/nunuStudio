"use strict";

function Panel(parent, obj)
{
	Element.call(this, parent);

	this.element.style.overflow = "auto";
	this.element.style.top = "0px";
	this.element.style.left = "0px";
	this.element.style.width = "100%";
	this.element.style.height = "100%";

	this.attach(obj);
	this.preventDragEvents();

	this.form = new Form(this.element);
	this.form.position.set(5, 5);
	this.form.spacing.set(5, 5);
}

Panel.prototype = Object.create(Element.prototype);

//Attach object to panel
Panel.prototype.attach = function(obj)
{
	this.obj = obj;
};

//Update panel ui
Panel.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.form.updateInterface();
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
};

//Update panel information
Panel.prototype.updatePanel = function(){};