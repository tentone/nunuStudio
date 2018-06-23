"use strict";

/**
 * DOM division element.
 * 
 * @class Division
 * @extends {Element}
 * @param {DOM} parent Parent element.
 */
function Division(parent)
{
	Element.call(this, parent);

	this.element.style.overflow = "visible";
	this.element.style.pointerEvents = "none";
	this.element.style.backgroundColor = Editor.theme.panelColor;
}

Division.prototype = Object.create(Element.prototype);
