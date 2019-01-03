"use strict";

function ToolBar(parent)
{
	var self = this;
	var size = parent.size.x;

	//Text
	this.text = new Text(parent);
	this.text.setText("Tools");
	this.text.size.set(40, 20);
	this.text.position.set(0, 20);
	this.text.updateInterface();
	
	//Select
	this.toolSelect = new ButtonImageToggle(parent);
	this.toolSelect.setSelected(true);
	this.toolSelect.setImage(Editor.FILE_PATH + "icons/tools/select.png");
	this.toolSelect.size.set(size, size);
	this.toolSelect.position.set(0, 40);
	this.toolSelect.setAltText("Select (CTRL+1)");
	this.toolSelect.updateInterface();
	this.toolSelect.setOnClick(function()
	{
		self.selectTool(Editor.SELECT);
	});

	//Move
	this.toolMove = new ButtonImageToggle(parent);
	this.toolMove.setImage(Editor.FILE_PATH + "icons/tools/move.png");
	this.toolMove.size.set(size, size);
	this.toolMove.position.set(0, 80);
	this.toolMove.setAltText("Move (CTRL+2)");
	this.toolMove.updateInterface();
	this.toolMove.setOnClick(function()
	{
		self.selectTool(Editor.MOVE);
	});

	//Resize
	this.toolScale = new ButtonImageToggle(parent);
	this.toolScale.setImage(Editor.FILE_PATH + "icons/tools/resize.png");
	this.toolScale.size.set(size, size);
	this.toolScale.position.set(0, 120);
	this.toolScale.setAltText("Scale (CTRL+3)");
	this.toolScale.updateInterface();
	this.toolScale.setOnClick(function()
	{
		self.selectTool(Editor.SCALE);
	});

	//Rotate
	this.toolRotate = new ButtonImageToggle(parent);
	this.toolRotate.setImage(Editor.FILE_PATH + "icons/tools/rotate.png");
	this.toolRotate.size.set(size, size);
	this.toolRotate.position.set(0, 160);
	this.toolRotate.setAltText("Rotate (CTRL+4)");
	this.toolRotate.updateInterface();
	this.toolRotate.setOnClick(function()
	{
		self.selectTool(Editor.ROTATE);
	});
}

ToolBar.prototype.destroy = function()
{
	this.text.destroy();
	this.toolSelect.destroy();
	this.toolMove.destroy();
	this.toolScale.destroy();
	this.toolRotate.destroy();
};

//Select object manipulation tool
ToolBar.prototype.selectTool = function(tool)
{
	this.toolSelect.setSelected(tool === Editor.SELECT);
	this.toolMove.setSelected(tool === Editor.MOVE);
	this.toolScale.setSelected(tool === Editor.SCALE);
	this.toolRotate.setSelected(tool === Editor.ROTATE);
	Editor.selectTool(tool);
};
