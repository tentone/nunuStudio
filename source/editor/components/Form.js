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
class Form extends Component {
	constructor(parent) {
	super(parent, "form");

	this.element.autocomplete = true;
	this.element.noValidate = true;
	this.element.action = "javascript:void(0)";
	this.element.addEventListener("submit", function(event)
	{
		event.preventDefault();
		return false;
	});
	}

/**
 * Simulate the form submission.
 * 
 * Should be called when sending data to the server to trigger the browser autocomplete system.
 * 
 * Some form implementation might actually implement submission login under this method.
 *
 * @method submit
 */
	submit() {
	this.element.submit();
	}

}

export {Form};
