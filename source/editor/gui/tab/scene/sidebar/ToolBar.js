"use strict";

function ToolBar(parent, editor, size, position)
{
	var self = this;

	this.editor = editor;
	
	//Text
	var text = new Text(parent);
	text.setText(Locale.tools);
	text.size.set(40, 20);
	text.position.set(0, position);
	text.updateInterface();
	position += text.size.y;

	//Select
	this.select = new ButtonImageToggle(parent);
	this.select.setSelected(true);
	this.select.setImage(Editor.FILE_PATH + "icons/tools/select.png");
	this.select.size.set(size, size);
	this.select.position.set(0, position);
	this.select.setAltText(Locale.selectShortcut);
	this.select.updateInterface();
	this.select.setOnClick(function()
	{
		self.selectTool(Editor.SELECT);
	});
	position += size;

	//Move
	this.move = new ButtonImageToggle(parent);
	this.move.setImage(Editor.FILE_PATH + "icons/tools/move.png");
	this.move.size.set(size, size);
	this.move.position.set(0, position);
	this.move.setAltText(Locale.moveShortcut);
	this.move.updateInterface();
	this.move.setOnClick(function()
	{
		self.selectTool(Editor.MOVE);
	});
	position += size;

	//Resize
	this.scale = new ButtonImageToggle(parent);
	this.scale.setImage(Editor.FILE_PATH + "icons/tools/resize.png");
	this.scale.size.set(size, size);
	this.scale.position.set(0, position);
	this.scale.setAltText(Locale.scaleShortcut);
	this.scale.updateInterface();
	this.scale.setOnClick(function()
	{
		self.selectTool(Editor.SCALE);
	});
	position += size;

	//Rotate
	this.rotate = new ButtonImageToggle(parent);
	this.rotate.setImage(Editor.FILE_PATH + "icons/tools/rotate.png");
	this.rotate.size.set(size, size);
	this.rotate.position.set(0, position);
	this.rotate.setAltText(Locale.rotateShortcut);
	this.rotate.updateInterface();
	this.rotate.setOnClick(function()
	{
		self.selectTool(Editor.ROTATE);
	});
	position += size;
}

ToolBar.prototype.destroy = function()
{
	this.text.destroy();
	this.select.destroy();
	this.move.destroy();
	this.scale.destroy();
	this.rotate.destroy();
};

/**
 * Select object manipulation tool.
 *
 * @method selectTool
 * @param {Number} tool
 */
ToolBar.prototype.selectTool = function(tool)
{
	this.select.setSelected(tool === Editor.SELECT);
	this.move.setSelected(tool === Editor.MOVE);
	this.scale.setSelected(tool === Editor.SCALE);
	this.rotate.setSelected(tool === Editor.ROTATE);

	this.editor.selectTool(tool);
};
