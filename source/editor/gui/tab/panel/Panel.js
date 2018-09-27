"use strict";

function Panel(parent, obj)
{
	Element.call(this, parent, "div");

	this.element.style.overflow = "auto";
	this.preventDragEvents();

	/**
	 * Object attached to this panel.
	 * 
	 * @property obj
	 * @type {Object3D}
	 */ 
	this.obj = null;
	this.attach(obj);

	/**
	 * Panel form.
	 *
	 * @property form
	 * @type {TableForm}
	 */
	this.form = new TableForm(this);
	this.form.setAutoSize(false);
}

Panel.prototype = Object.create(Element.prototype);

/** 
 * Attach object to panel.
 *
 * @method attach
 * @param {Object3D} obj
 */
Panel.prototype.attach = function(obj)
{
	this.obj = obj;
};

/**
 * Update panel information to match the attached object.
 *
 * @method updatePanel
 */
Panel.prototype.updatePanel = function(){};

Panel.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	this.form.size.copy(this.size);
	this.form.updateInterface();
};
