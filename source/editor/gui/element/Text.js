"use strict";

/**
 * Text element without background.
 * 
 * @class Text
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function Text(parent)
{
	Component.call(this, parent, "div");

	this.element.style.pointerEvents = "none";
	this.element.style.color = Editor.theme.textColor;
	this.element.style.display = "flex";

	/** 
	 * Span DOM element used to represent the text.
	 *
	 * @attribute span
	 * @type {Component}
 	 */
	this.span = document.createElement("span");
	this.span.style.overflow = "hidden";
	this.element.appendChild(this.span);

	// Text
	this.text = document.createTextNode("");
	this.span.appendChild(this.text);

	/**
	 * If set to true the text container will automatically fit the text size.
	 *
	 * @attribute fitContent
	 * @type {boolean}
	 */
	this.fitContent = false;

	this.allowWordBreak(false);
	this.setVerticalAlignment(Text.CENTER);
	this.setAlignment(Text.CENTER);
}

Text.CENTER = 0;
Text.LEFT = 1;
Text.RIGHT = 2;
Text.TOP = 3;
Text.BOTTOM = 4;

Text.CLIP = 10;
Text.ELLIPSIS = 11;

Text.prototype = Object.create(Component.prototype);

/**
 * Set font to use for the text.
 * 
 * @method setFont
 * @param {string} fontFamily Font family.
 * @param {number} fontWeight Font weigth, sets how thick or thin characters in text should be displayed.
 * @param {string} fontStyle Font style, specifies the font style for a text.
 */
Text.prototype.setFont = function(fontFamily, fontWeight, fontStyle)
{
	this.span.style.fontFamily = fontFamily;

	if(fontWeight !== undefined)
	{
		this.span.style.fontWeight = fontWeight;
	}

	if(fontStyle !== undefined)
	{
		this.span.style.fontStyle = fontStyle;
	}
};

/**
 * Enable of disable word breaking.
 *
 * @method allowWordBreak
 * @param {boolean} line If true words can be breaked.
 */
Text.prototype.allowWordBreak = function(value)
{
	if(value === true)
	{
		this.span.style.whiteSpace = "normal";
		this.span.style.wordBreak = "break-word";
	}
	else
	{
		this.span.style.whiteSpace = "pre";
		this.span.style.wordBreak = "normal";
	}
};

/**
 * Set text.
 *
 * @method setText
 * @param {string} text Text. 
 */
Text.prototype.setText = function(text)
{
	this.text.data = text;
};

/**
 * Set text border.
 *
 * @method setTextBorder
 * @param {number} size Border size in pixels.
 * @param {string} color CSS Color. 
 */
Text.prototype.setTextBorder = function(size, color)
{
	this.span.style.textShadow = "-" + size + "px 0 " + color + ", 0 " + size + "px " + color + ", " + size + "px 0 " + color + ", 0 -" + size + "px " + color;
};

/**
 * Set Text size, in pixels.
 * 
 * @method setTextSize
 * @param {number} size Size in pixel for this text element.
 */
Text.prototype.setTextSize = function(size)
{
	this.element.style.fontSize = size + "px";
};

/**
 * Set text color.
 * 
 * @method setTextColor
 * @param {string} color Color code.
 */
Text.prototype.setTextColor = function(color)
{
	this.span.style.color = color;
};

/**
 * Set text overflow handling
 *
 * @method setOverflow
 * @param {number} overflow
 */
Text.prototype.setOverflow = function(overflow)
{
	if(overflow === Text.ELLIPSIS)
	{
		this.span.style.whiteSpace = "nowrap";
		this.span.style.textOverflow = "ellipsis";
	}
	else
	{
		this.span.style.whiteSpace = "pre";
		this.span.style.textOverflow = "clip";
	}
};

/**
 * Set text horizontal alignment.
 *  - Text.CENTER
 *  - Text.LEFT
 *  - Text.RIGHT
 * 
 * @method setAlignment
 * @param {number} align Alingment mode.
 */
Text.prototype.setAlignment = function(align)
{
	if(align === Text.CENTER)
	{
		this.element.style.justifyContent = "center";
		this.element.style.textAlign = "center";
	}
	else if(align === Text.LEFT)
	{
		this.element.style.justifyContent = "flex-start";
		this.element.style.textAlign = "left";
	}
	else if(align === Text.RIGHT)
	{
		this.element.style.justifyContent = "flex-end";
		this.element.style.textAlign = "right";
	}
};

/**
 * Set text vertical alignment.
 *  - Text.CENTER
 *  - Text.TOP
 *  - Text.BOTTOM
 * 
 * @method setVerticalAlignment
 * @param {number} align Alingment mode.
 */
Text.prototype.setVerticalAlignment = function(align)
{
	if(align === Text.CENTER)
	{
		this.element.style.alignItems = "center";
	}
	else if(align === Text.TOP)
	{
 		this.element.style.alignItems = "flex-start";
	}
	else if(align === Text.BOTTOM)
	{
		this.element.style.alignItems = "flex-end";
	}
};

/**
 * Get size of the text inside of this component in px.
 * 
 * @method measure
 * @return {THREE.Vector2} A vector with the size of the text. 
 */
Text.prototype.measure = function()
{
 	return new THREE.Vector2(this.span.offsetWidth, this.span.offsetHeight);
};

/**
 * Set text internal margin in pixels.
 * 
 * @method setMargin
 * @param {number} margin Margin size in pixels.
 */
Text.prototype.setMargin = function(margin)
{
	this.span.style.margin = margin + "px";
};

Text.prototype.updateVisibility = function()
{
	this.element.style.display = this.visible ? "flex" : "none";
}

Text.prototype.updateSize = function()
{
	if(this.fitContent)
	{
		this.size.x = this.span.clientWidth;
		this.size.y = this.span.clientHeight;
	}
	
	Component.prototype.updateSize.call(this);
};