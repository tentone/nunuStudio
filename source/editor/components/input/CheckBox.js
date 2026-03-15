import {Global} from "../../Global.js";
import {Component} from "../Component.js";

/**
 * Check box input element.
 * 
 * @class CheckBox
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
class CheckBox extends Component {
	constructor(parent) {
	super(parent, "div");

	var self = this;

	this.element.style.display = "block";
	this.element.style.boxSizing = "border-box";
	this.element.style.cursor = "pointer";
	this.element.style.backgroundColor = "var(--box-color)";
	this.element.style.borderRadius = "4px";
	this.element.onclick = function()
	{
		self.setValue(!self.value);
		
		if (self.onChange !== null)
		{
			self.onChange(self.value);
		}
	};

	this.check = document.createElement("img");
	this.check.style.visibility = "hidden";
	this.check.style.pointerEvents = "none";
	this.check.style.position = "absolute";
	this.check.style.top = "20%";
	this.check.style.left = "20%";
	this.check.style.width = "60%";
	this.check.style.height = "60%";
	this.check.src = Global.FILE_PATH + "icons/misc/check.png";
	this.element.appendChild(this.check);

	/**
	 * Value stored in the checkbox.
	 *
	 * @property value
	 * @type {boolean}
	 */
	this.value = false;

	/**
	 * On change callback function.
	 *
	 * @property onChange
	 * @type {Function}
	 */
	this.onChange = null;

	/** 
	 * If the checkbox is disabled the value cannot be edited.
	 *
	 * @attribute disabled
	 * @type {boolean}
	 */
	this.disabled = false;
	};

/**
 * Set if element is disabled.
 *
 * When disabled the checkbox value cannot be edited.
 *
 * @method setDisabled
 */
	setDisabled(value) {
	this.disabled = value;
	
	if (this.disabled === true)
	{
		this.element.style.cursor = "initial";
		this.element.style.pointerEvents = "none";
	}
	else
	{
		this.element.style.cursor = "pointer";
		this.element.style.pointerEvents = "auto";
	}
	}

/**
 * Set checkbox value.
 * 
 * @method setValue
 * @param {boolean} value
 */
	setValue(value) {
	this.value = value;
	this.check.style.visibility = this.value ? "visible" : "hidden";
	}

/**
 * Get checkbox value.
 * 
 * @method getValue
 * @return {boolean} Value from the element.
 */
	getValue() {
	return this.value;
	}

/**
 * Set onchange callback.
 * 
 * @method setOnChange
 * @param {Function} callback
 */
	setOnChange(callback) {
	this.onChange = callback;
	}

	updateVisibility() {
	this.element.style.visibility = this.visible ? "visible" : "hidden";
	}

	updateSize() {
	this.element.style.width = this.size.y + "px";
	this.element.style.height = this.size.y + "px";
	}

}

export {CheckBox};
