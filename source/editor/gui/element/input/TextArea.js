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
		context.addOption(Locale.selectAll, function()
		{
			self.element.select();
		});
		context.updateInterface();
	};
}

TextArea.prototype = Object.create(Element.prototype);

/**
 * The text in the textarea is not wrapped. This is default.
 *
 * @static
 * @attribute SOFT
 * @type {String}
 */
TextArea.SOFT = "soft";

/**
 * The text in the textarea is wrapped (contains newlines).
 *
 * When "hard" is used, the cols attribute must be specified.
 *
 * @static
 * @attribute HARD
 * @type {String}
 */
TextArea.HARD = "hard";

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
TextArea.prototype.setFont = function(fontFamily, fontWeight, fontStyle)
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
 * Set the wrap mode used for this text area.
 *
 * Only affects the value on form submission.
 *
 * @method setWrap
 * @param {String} mode The wrap mode to use.
 */
TextArea.prototype.setWrap = function(mode)
{
	this.element.wrap = mode;
};

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
 * Set oninput callback called after every letter typed into the box.
 *
 * Should be used only for immediate input effect.
 *
 * @method setOnInput
 * @param {Function} onInput
 */
TextArea.prototype.setOnInput = function(onInput)
{
	this.element.oninput = onInput;
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

/**
 * Set value stored in the input element. Same as setText().
 *
 * @method setValue
 * @param {Object} text
 */
TextArea.prototype.setValue = TextArea.prototype.setText;

/**
 * Get text stored in the input element. Same as getText().
 *
 * @method getValue
 * @return {String} Text stored in the input element.
 */
TextArea.prototype.getValue = TextArea.prototype.getText;
