"use strict";

/**
 * DOM text input element.
 * 
 * @class TextBox
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function TextBox(parent)
{
	Element.call(this, parent, "input");

	this.element.type = "text";
	this.element.style.backgroundColor = Editor.theme.boxColor;
	this.element.style.color = Editor.theme.textColor;
	this.element.style.margin = "0";
	this.element.style.outline = "none";
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.textIndent = "4px";
	this.element.style.borderRadius = "4px";

	var self = this;
	
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu(DocumentBody);
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		context.addOption(Locale.copy, function()
		{
			var value = self.element.value;
			Editor.clipboard.set(value.slice(self.element.selectionStart, self.element.selectionEnd), "text");
		});
		context.addOption(Locale.cut, function()
		{
			var value = self.element.value;
			Editor.clipboard.set(value.slice(self.element.selectionStart, self.element.selectionEnd), "text");
			self.element.value = value.slice(0, self.element.selectionStart) + value.slice(self.element.selectionEnd, value.length);
		});
		context.addOption(Locale.paste, function()
		{
			var value = self.element.value;
			var paste = Editor.clipboard.get("text");
			if(paste !== undefined)
			{
				self.element.value = value.slice(0, self.element.selectionStart) + paste + value.slice(self.element.selectionEnd, value.length);
			}
		});
		context.addOption(Locale.selectAll, function()
		{
			console.log(self.element);
			self.element.select();
		});
		context.updateInterface();
	};
}

TextBox.prototype = Object.create(Element.prototype);

/**
 * Set font configuration to use for the text presented in this component.
 *
 * May also affect some types of children components. 
 * 
 * @method setFont
 * @param {String} fontFamily Font family.
 * @param {Number} fontWeight Font weigth, sets how thick or thin characters in text should be displayed.
 * @param {String} fontStyle Font style, specifies the font style for a text.
 */
TextBox.prototype.setFont = function(fontFamily, fontWeight, fontStyle)
{
	this.element.style.fontFamily = fontFamily;

	if(fontWeight !== undefined)
	{
		this.element.style.fontWeight = fontWeight;
	}

	if(fontStyle !== undefined)
	{
		this.element.style.fontStyle = fontStyle;
	}
};

/**
 * Set the disabled state of the element.
 *
 * @method setDisabled
 * @param {Boolean} disabled
 */
TextBox.prototype.setDisabled = function(value)
{
	this.element.disabled = value;
};

/**
 * Set onchange callback, called after changes.
 *
 * @method setOnChange
 * @param {Function} onChange
 */
TextBox.prototype.setOnChange = function(onChange)
{
	this.element.onchange = onChange;
};

/**
 * Set value stored in the input element.
 *
 * @method setText
 * @param {Object} text
 */
TextBox.prototype.setText = function(text)
{
	this.element.value = text;
};

/**
 * Get text stored in the input element.
 *
 * @method getText
 * @return {String} Text stored in the input element.
 */
TextBox.prototype.getText = function()
{
	return this.element.value;
};
