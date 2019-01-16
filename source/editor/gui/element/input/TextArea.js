"use strict";

/**
 * Text area input is used to handle multi line string values.
 *
 * @class TextArea
 * @extends {Component}
 */
function TextArea(parent)
{
	Element.call(this, parent, "textarea");

	this.element.style.overflow = "auto";
	this.element.style.resize = "none";
	this.element.style.backgroundColor = Editor.theme.boxColor;
	this.element.style.fontFamily = Editor.theme.font;
	this.element.style.color = Editor.theme.textColor;
	this.element.style.outline = "none";
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
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
		context.addOption("Select all", function()
		{
			self.element.select();
		});
		context.updateInterface();
	};
}

TextArea.prototype = Object.create(Element.prototype);

/**
 * Set the disabled state of the element.
 *
 * @method setDisabled
 * @param {Boolean} disabled
 */
TextArea.prototype.setDisabled = function(value)
{
	this.element.disabled = value;
};

/**
 * Set onchange callback, called after changes.
 *
 * @method setOnChange
 * @param {Function} onChange
 */
TextArea.prototype.setOnChange = function(onChange)
{
	this.element.onchange = onChange;
};

/**
 * Set value stored in the input element.
 *
 * @method setText
 * @param {Object} text
 */
TextArea.prototype.setText = function(text)
{
	this.element.value = text;
};

/**
 * Get text stored in the input element.
 *
 * @method getText
 * @return {String} Text stored in the input element.
 */
TextArea.prototype.getText = function()
{
	return this.element.value;
};

TextArea.prototype.updateVisibility = function()
{
	this.element.style.visibility = this.visible ? "visible" : "hidden";
};