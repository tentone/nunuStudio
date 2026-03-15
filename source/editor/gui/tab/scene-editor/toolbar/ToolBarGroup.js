import {Component} from "../../../../components/Component.js";
import {ButtonIcon} from "../../../../components/buttons/ButtonIcon.js";
import {ToolBarToogleButton} from "./ToolBarToogleButton.js";
import {ToolBarButton} from "./ToolBarButton.js";

/**
 * Group of tools contained inside of the ToolBar object.
 * 
 * @class ToolBarGroup
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
class ToolBarGroup extends Component {
	constructor(parent) {
	super(parent, "div");

	this.setStyle("overflow", "visible");
	this.setStyle("backgroundColor", "var(--bar-color)");
	this.setStyle("borderRadius", "5px");

	this.buttons = [];
	}

/**
 * Add new toggle button to this tool bar group.
 *
 * @method addOption
 * @return {ButtonIcon} The button created for the new option
 */
	addToggleOption(text, icon, callback) {
	var button = new ToolBarToogleButton(this);
	button.text.setText(text);
	button.setImage(icon);
	button.size.set(this.size.y, this.size.y);
	button.position.set(this.buttons.length * this.size.y, 0);
	button.updateInterface();
	button.element.onclick = callback;
	this.buttons.push(button);

	this.size.x = this.buttons.length * this.size.y;

	return button;
	}

/**
 * Add new button to this tool bar group.
 *
 * @method addOption
 * @return {ButtonIcon} The button created for the new option
 */
	addOption(text, icon, callback) {
	var button = new ToolBarButton(this);
	button.text.setText(text);
	button.setImage(icon);
	button.size.set(this.size.y, this.size.y);
	button.position.set(this.buttons.length * this.size.y, 0);
	button.updateInterface();
	button.element.onclick = callback;
	this.buttons.push(button);

	this.size.x = this.buttons.length * this.size.y;

	return button;
	}

}

export {ToolBarGroup};
