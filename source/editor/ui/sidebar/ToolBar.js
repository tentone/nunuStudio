"use strict";

function ToolBar(element)
{
	this.element = element;

	//Text
	this.text = new Text(element);
	this.text.setText("Tools");
	this.text.size.set(40, 20);
	this.text.position.set(0, 20);
	this.text.updateInterface();

	var self = this;

	//Select
	this.toolSelect = new ButtonImageToggle(element);
	this.toolSelect.selected = true;
	this.toolSelect.setImage(Editor.filePath + "icons/tools/select.png");
	this.toolSelect.size.set(Interface.sideBar.size.x, Interface.sideBar.size.x);
	this.toolSelect.position.set(0, 40);
	this.toolSelect.setAltText("Select (CTRL+1)");
	this.toolSelect.updateInterface();
	this.toolSelect.setCallback(function()
	{
		self.selectTool(Editor.SELECT);
	});

	//Move
	this.toolMove = new ButtonImageToggle(element);
	this.toolMove.setImage(Editor.filePath + "icons/tools/move.png");
	this.toolMove.size.set(Interface.sideBar.size.x, Interface.sideBar.size.x);
	this.toolMove.position.set(0, 80);
	this.toolMove.setAltText("Move (CTRL+2)");
	this.toolMove.updateInterface();
	this.toolMove.setCallback(function()
	{
		self.selectTool(Editor.MOVE);
	});

	//Resize
	this.toolScale = new ButtonImageToggle(element);
	this.toolScale.setImage(Editor.filePath + "icons/tools/resize.png");
	this.toolScale.size.set(Interface.sideBar.size.x, Interface.sideBar.size.x);
	this.toolScale.position.set(0, 120);
	this.toolScale.setAltText("Scale (CTRL+3)");
	this.toolScale.updateInterface();
	this.toolScale.setCallback(function()
	{
		self.selectTool(Editor.SCALE);
	});

	//Rotate
	this.toolRotate = new ButtonImageToggle(element);
	this.toolRotate.setImage(Editor.filePath + "icons/tools/rotate.png");
	this.toolRotate.size.set(Interface.sideBar.size.x, Interface.sideBar.size.x);
	this.toolRotate.position.set(0, 160);
	this.toolRotate.setAltText("Rotate (CTRL+4)");
	this.toolRotate.updateInterface();
	this.toolRotate.setCallback(function()
	{
		self.selectTool(Editor.ROTATE);
	});
}

ToolBar.prototype.destroy = function()
{	this.text.destroy();
	this.toolSelect.destroy();
	this.toolMove.destroy();
	this.toolScale.destroy();
	this.toolRotate.destroy();

};

//Select object manipulation tool
ToolBar.prototype.selectTool = function(tool)
{
	this.toolSelect.selected = tool === Editor.SELECT;
	this.toolSelect.updateInterface();

	this.toolMove.selected = tool === Editor.MOVE;
	this.toolMove.updateInterface();

	this.toolScale.selected = tool === Editor.SCALE;
	this.toolScale.updateInterface();
	
	this.toolRotate.selected = tool === Editor.ROTATE;
	this.toolRotate.updateInterface();

	Editor.selectTool(tool);
};
