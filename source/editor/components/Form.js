import {Component} from "./Component.js";

/**
 * DOM form element.
 * 
 * This element should be used to encapsulate input elements that require autocompletion.
 * 
 * @class Form
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function Form(parent)
{
	Component.call(this, parent, "form");

	this.element.autocomplete = true;
	this.element.noValidate = true;
	this.element.action = "javascript:void(0)";
	this.element.addEventListener("submit", function(event)
	{
		event.preventDefault();
		return false;
	});
}

Form.prototype = Object.create(Component.prototype);

/**
 * Simulate the form submission.
 * 
 * Should be called when sending data to the server to trigger the browser autocomplete system.
 * 
 * Some form implementation might actually implement submission login under this method.
 *
 * @method submit
 */
Form.prototype.submit = function()
{
	this.element.submit();
};

export {Form};
