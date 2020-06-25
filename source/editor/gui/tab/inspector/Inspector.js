import {Interface} from "../../Interface.js";
import {TableForm} from "../../../components/TableForm.js";
import {Form} from "../../../components/Form.js";
import {Component} from "../../../components/Component.js";

/**
 * A panel inspector is used to inspect and change the attributes of an object.
 *
 * The panel has a form element that should be used to place the object attribute editing GUI.
 *
 * @constructor
 * @class Inspector
 * @extends {Component}
 * @param {Component} parent
 * @param {Object} object Object to be edited by this inspector panel.
 */
function Inspector(parent, object)
{
	Component.call(this, parent, "div");

	this.element.style.overflow = "auto";
	this.preventDragEvents();

	/**
	 * Object attached to this panel.
	 * 
	 * @property object
	 * @type {Object3D}
	 */ 
	this.object = null;
	this.attach(object);

	/**
	 * Inspector form.
	 *
	 * @property form
	 * @type {TableForm}
	 */
	this.form = new TableForm(this);
	this.form.setAutoSize(false);
}

Inspector.prototype = Object.create(Component.prototype);

/** 
 * Attach object to panel.
 *
 * @method attach
 * @param {Object3D} object
 */
Inspector.prototype.attach = function(object)
{
	this.object = object;
};

/**
 * Update panel information to match the attached object.
 *
 * @method updateInspector
 */
Inspector.prototype.updateInspector = function(){};

Inspector.prototype.updateSize = function()
{
	Component.prototype.updateSize.call(this);

	this.form.size.copy(this.size);
	this.form.updateInterface();
};

export {Inspector};