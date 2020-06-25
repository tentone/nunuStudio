"use strict";

function DropdownList(parent)
{
	Component.call(this, parent, "div");

	// Select
	this.select = document.createElement("select");
	this.select.style.backgroundColor = "var(--box-color)";
	this.select.style.color = "var(--color-light)";
	this.select.style.left = "0px";
	this.select.style.top = "0px";
	this.select.style.textIndent = "5px";
	this.select.style.borderStyle = "none";
	this.select.style.boxSizing = "border-box";
	this.select.style.borderRadius = "4px";
	this.select.style.outline = "none";
	this.select.style.cursor = "pointer";
	this.select.style.MozAppearance = "textfield";
	this.select.style.webkitAppearance = "caret";
	this.select.style.appearance = "textfield";
	this.element.appendChild(this.select);

	// Arrow
	this.arrow = document.createElement("img");
	this.arrow.style.display = "block";
	this.arrow.style.position = "absolute";
	this.arrow.style.pointerEvents = "none";
	this.arrow.style.right = "6px";
	this.arrow.style.width = "10px";
	this.arrow.style.height = "10px";
	this.arrow.src = Global.FILE_PATH + "icons/misc/arrow_down.png";
	this.element.appendChild(this.arrow);

	// Attributes
	this.values = [];
}

DropdownList.prototype = Object.create(Component.prototype);

/**
 * Set the disabled state of the element.
 *
 * @method setDisabled
 * @param {boolean} disabled
 */
DropdownList.prototype.setDisabled = function(value)
{
	this.select.disabled = value;
}

/**
 * Set onchange callback, called after changes.
 *
 * @method setOnChange
 * @param {Function} onChange
 */
DropdownList.prototype.setOnChange = function(onChange)
{
	this.select.onchange = onChange;
}

/**
 * Add option to the dropdown list.
 *
 * @method addValue
 * @param {string} text Label of the option.
 * @param {Object} value Value of the option.
 */
DropdownList.prototype.addValue = function(text, value)
{
	var option = document.createElement("option");
	option.appendChild(document.createTextNode(text));
	this.values.push(value);
	this.select.appendChild(option);
}

/**
 * Remove all element from dropdown
 *
 * @method clearValues
 */
DropdownList.prototype.clearValues = function()
{
	this.values = [];
	for(var i = 0; i < this.select.children.length; i++)
	{
		this.select.removeChild(this.select.children[i]);
	}
};

/**
 * Get value stored in the input element.
 *
 * @method setValue
 * @return {Object} Value stored in the input element.
 */
DropdownList.prototype.getValue = function()
{
	if(this.select.selectedIndex > -1)
	{
		return this.values[this.select.selectedIndex];
	}
	return null;
}

/**
 * Set value stored in the input element.
 *
 * @method setValue
 * @param {Object} value
 */
DropdownList.prototype.setValue = function(value)
{
	// Get value index
	for(var i = 0; i < this.values.length; i++)
	{
		if(this.values[i] === value)
		{
			this.select.selectedIndex = i;
			break;
		}
	}

	// If value not found set selectedIndex to -1
	if(i === this.values.length)
	{
		this.select.selectedIndex = -1;
	}
}

// Get dropdownlist selected index
DropdownList.prototype.getSelectedIndex = function()
{
	return this.select.selectedIndex;
}

// Set dropdownlist selected index
DropdownList.prototype.setSelectedIndex = function(index)
{
	this.select.selectedIndex = index;
}

DropdownList.prototype.updateVisibility = function()
{
	this.element.style.visibility = this.visible ? "visible" : "hidden";
};

DropdownList.prototype.updateSize = function()
{
	Component.prototype.updateSize.call(this);

	this.select.style.width = this.size.x + "px";
	this.select.style.height = this.size.y + "px";

	this.arrow.style.top = ((this.size.y - 10) / 2) + "px";
};
