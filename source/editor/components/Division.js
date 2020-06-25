"use strict";

/**
 * DOM division element container.
 * 
 * @class Division
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function Division(parent)
{
	Component.call(this, parent, "div");

	this.element.style.overflow = "visible";
}

Division.prototype = Object.create(Component.prototype);
