"use strict";

function TextBox(parent)
{
	Element.call(this, parent, "input");

	this.element.type = "text";
	this.element.style.backgroundColor = Editor.theme.boxColor;
	this.element.style.color = Editor.theme.textColor;
	this.element.style.margin = "0";
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.textIndent = "4px";
	this.element.style.borderRadius = "4px";

	var self = this;
	
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		context.addOption("Copy", function()
		{
			var value = self.element.value;
			Editor.clipboard.set(value.slice(self.element.selectionStart, self.element.selectionEnd), "text");
		});
		context.addOption("Cut", function()
		{
			var value = self.element.value;
			Editor.clipboard.set(value.slice(self.element.selectionStart, self.element.selectionEnd), "text");
			self.element.value = value.slice(0, self.element.selectionStart) + value.slice(self.element.selectionEnd, value.length);
		});
		context.addOption("Paste", function()
		{
			var value = self.element.value;
			var paste = Editor.clipboard.get("text");
			self.element.value = value.slice(0, self.element.selectionStart) + paste + value.slice(self.element.selectionEnd, value.length);
		});
		context.addOption("Select all", function()
		{
			console.log(self.element);
			self.element.select();
		});
		context.updateInterface();
	};
}

TextBox.prototype = Object.create(Element.prototype);

//Set if element if disabled
TextBox.prototype.setDisabled = function(value)
{
	this.element.disabled = value;
};

//Set onchange onChange
TextBox.prototype.setOnChange = function(onChange)
{
	this.element.onchange = onChange;
};

//Set text
TextBox.prototype.setText = function(text)
{
	this.element.value = text;
};

//Get text
TextBox.prototype.getText = function()
{
	return this.element.value;
};

//Update Interface
TextBox.prototype.updateInterface = function()
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
};