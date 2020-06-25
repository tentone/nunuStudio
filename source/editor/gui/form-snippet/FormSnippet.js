import {Form} from "../../components/Form.js";

/**
 * A form template can be used to describe a small group of properties of a form that are common to multiple objects.
 *
 * @class FormSnippet
 * @param {Form} form Base form object to place the template fields.
 * @param {Object} object Object that contains the attributes being edited.
 */
function FormSnippet(form, object)
{
	/**
	 * Form object to place the GUI elements.
	 *
	 * @property form
	 * @type {Form}
	 */
	this.form = form;

	/**
	 * Object to edit the attributes.
	 *
	 * @property object
	 * @type {Object}
	 */
	this.object = object;
}

/** 
 * Attach a new object to the form template and update the template values.
 *
 * @method attach
 * @param {Object} object
 */
FormSnippet.prototype.attach = function(object)
{
	this.object = object;
	this.updateValues();
};

/** 
 * Update the value of the attributes edited by this template reading them from the object.
 *
 * @method updateValues
 */
FormSnippet.prototype.updateValues = function(){};

export {FormSnippet};