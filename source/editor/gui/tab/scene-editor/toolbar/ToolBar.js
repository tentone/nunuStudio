"use strict";

/**
 * The tool bar is used to store tool groups.
 * 
 * Tools are organized by category, the toolbar size is automatically calculated from the amount of elements.
 * 
 * @class ToolBar
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function ToolBar(parent)
{
	Component.call(this, parent, "div");

	this.element.style.overflow = "visible";

	/**
	 * Spacing in px between the tool groups.
	 * 
	 * @attribute spacing
	 * @type {Number}
	 */
	this.spacing = 10;

	/**
	 * Groups contained inside this tool bar.
	 * 
	 * @attribute groups
	 * @type {Array}
	 */
	this.groups = [];
	
	this.size.y = 45;

	var self = this;

	var tool = this.addGroup();
	this.select = tool.addToggleOption(Locale.selectShortcut, Global.FILE_PATH + "icons/tools/select.png", function()
	{
		self.selectTool(SceneEditor.SELECT);
	});
	this.move = tool.addToggleOption(Locale.moveShortcut, Global.FILE_PATH + "icons/tools/move.png", function()
	{
		self.selectTool(SceneEditor.MOVE);
	});
	this.scale = tool.addToggleOption(Locale.scaleShortcut, Global.FILE_PATH + "icons/tools/resize.png", function()
	{
		self.selectTool(SceneEditor.SCALE);
	});
	this.rotate = tool.addToggleOption(Locale.selectShortcut, Global.FILE_PATH + "icons/tools/rotate.png", function()
	{
		self.selectTool(SceneEditor.ROTATE);
	});

	this.updateGroups();
}

ToolBar.prototype = Object.create(Component.prototype);

ToolBar.prototype.selectTool = function(tool)
{
	this.select.setSelected(tool === SceneEditor.SELECT);
	this.move.setSelected(tool === SceneEditor.MOVE);
	this.scale.setSelected(tool === SceneEditor.SCALE);
	this.rotate.setSelected(tool === SceneEditor.ROTATE);
};

/**
 * Add new group to this tool bar.
 *
 * @method addGroup
 * @return {ToolBarGroup} The new group created.
 */
ToolBar.prototype.addGroup = function()
{
	var group = new ToolBarGroup(this);
	group.size.y = this.size.y;
	this.groups.push(group);
	return group;
};

/**
 * Update the groups position and recalculate the bar size.
 *
 * Should be manually called after adding new elements to the toolbar.
 * 
 * @method updateGroups
 */
ToolBar.prototype.updateGroups = function()
{
	this.size.x = 0;

	for(var i = 0; i < this.groups.length; i++)
	{
		this.groups[i].position.x = this.size.x;
		this.groups[i].updateInterface();

		this.size.x += this.groups[i].size.x;
	
		if(i + 1 < this.groups.length)
		{
			this.size.x += this.spacing;
		}
	}
};
