"use strict";

/**
 * Group of tools contained inside a ToolBar object.
 * 
 * @class ToolGroup
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function ToolGroup(parent)
{
	Component.call(this, parent, "div");

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = Palette.getColorAlpha("black", 0.7);

	this.buttons = [];
}

ToolGroup.prototype = Object.create(Component.prototype);

/**
 * Add new group to this tool bar.
 *
 * @method addOption
 * @return {ButtonIcon} The button created for the new option
 */
ToolGroup.prototype.addOption = function(text, icon, callback)
{
	var button = new ToolBarButton(this);
	button.setText(text);
	button.setIcon(icon);
	button.size.set(this.size.y, this.size.y);
	button.position.set(this.buttons.length * this.size.y, 0);
	button.updateInterface();
	button.element.onclick = callback;
	this.buttons.push(button);

	this.size.x = this.buttons.length * this.size.y;

	return button;
};

ToolGroup.prototype.updateInterface = function()
{
	Component.prototype.updateInterface.call(this);

	this.element.style.borderRadius =  this.size.y * 0.07 + "px";
};