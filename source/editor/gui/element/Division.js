"use strict";

/**
 * DOM division element.
 * 
 * @class Division
 * @extends {Element}
 * @param {Element} parent Parent element.
 */
function Division(parent)
{
	Element.call(this, parent, "div");

	this.element.style.overflow = "visible";
}

Division.prototype = Object.create(Element.prototype);
