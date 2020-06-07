"use strict";

/**
 * Group of tools contained inside a ToolBar object.
 * 
 * @class ToolBarGroup
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function ToolBarGroup(parent)
{
	Component.call(this, parent, "div");

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = "#000000BB";

	this.buttons = [];
}

ToolBarGroup.prototype = Object.create(Component.prototype);

/**
 * Add new group to this tool bar.
 *
 * @method addOption
 * @return {ButtonIcon} The button created for the new option
 */
ToolBarGroup.prototype.addOption = function(text, icon, callback)
{
	var button = new ToolBarButton(this);
	button.setText(text);
	button.setImage(icon);
	button.size.set(this.size.y, this.size.y);
	button.position.set(this.buttons.length * this.size.y, 0);
	button.updateInterface();
	button.element.onclick = callback;
	this.buttons.push(button);

	this.size.x = this.buttons.length * this.size.y;

	return button;
};

ToolBarGroup.prototype.updateInterface = function()
{
	Component.prototype.updateInterface.call(this);

	this.element.style.borderRadius =  this.size.y * 0.07 + "px";
};