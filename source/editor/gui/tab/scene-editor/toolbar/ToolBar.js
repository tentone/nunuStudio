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
	
	this.size.y = 52;

	var editor = this.parent.parent;

	// Auxiliar method to select tool
	function selectTool(tool)
	{
		/* self.select.setSelected(tool === SceneEditor.SELECT);
		self.move.setSelected(tool === SceneEditor.MOVE);
		self.scale.setSelected(tool === SceneEditor.SCALE);
		self.rotate.setSelected(tool === SceneEditor.ROTATE); */
		
		self.parent.selectTool(tool);
	};

	var transform = this.addGroup();
	transform.addOption(Locale.selectShortcut, Global.FILE_PATH + "icons/tools/select.png", function()
	{
		selectTool(SceneEditor.SELECT);
	});
	transform.addOption(Locale.moveShortcut, Global.FILE_PATH + "icons/tools/move.png", function()
	{
		selectTool(SceneEditor.MOVE);
	});
	transform.addOption(Locale.scaleShortcut, Global.FILE_PATH + "icons/tools/resize.png", function()
	{
		selectTool(SceneEditor.SCALE);
	});
	transform.addOption(Locale.selectShortcut, Global.FILE_PATH + "icons/tools/rotate.png", function()
	{
		selectTool(SceneEditor.ROTATE);
	});

	this.updateGroups();
}

ToolBar.prototype = Object.create(Component.prototype);

/**
 * Add new group to this tool bar.
 *
 * @method addGroup
 * @return {ToolGroup} The new group created.
 */
ToolBar.prototype.addGroup = function()
{
	var group = new ToolGroup(this);
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
