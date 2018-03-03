"use strict";

function ToolBar(element)
{
	//Tools text
	Interface.toolText = new Text(element);
	Interface.toolText.setText("Tools");
	Interface.toolText.size.set(40, 20);
	Interface.toolText.position.set(0, 20);
	Interface.toolText.updateInterface();

	//Select
	Interface.toolSelect = new ButtonImageToggle(element);
	Interface.toolSelect.selected = true;
	Interface.toolSelect.setImage(Editor.filePath + "icons/tools/select.png");
	Interface.toolSelect.size.set(Interface.sideBar.size.x, Interface.sideBar.size.x);
	Interface.toolSelect.position.set(0, 40);
	Interface.toolSelect.setAltText("Select (CTRL+1)");
	Interface.toolSelect.updateInterface();
	Interface.toolSelect.setCallback(function()
	{
		Interface.selectTool(Editor.SELECT);
	});

	//Move
	Interface.toolMove = new ButtonImageToggle(element);
	Interface.toolMove.setImage(Editor.filePath + "icons/tools/move.png");
	Interface.toolMove.size.set(Interface.sideBar.size.x, Interface.sideBar.size.x);
	Interface.toolMove.position.set(0, 80);
	Interface.toolMove.setAltText("Move (CTRL+2)");
	Interface.toolMove.updateInterface();
	Interface.toolMove.setCallback(function()
	{
		Interface.selectTool(Editor.MOVE);
	});

	//Resize
	Interface.toolScale = new ButtonImageToggle(element);
	Interface.toolScale.setImage(Editor.filePath + "icons/tools/resize.png");
	Interface.toolScale.size.set(Interface.sideBar.size.x, Interface.sideBar.size.x);
	Interface.toolScale.position.set(0, 120);
	Interface.toolScale.setAltText("Scale (CTRL+3)");
	Interface.toolScale.updateInterface();
	Interface.toolScale.setCallback(function()
	{
		Interface.selectTool(Editor.SCALE);
	});

	//Rotate
	Interface.toolRotate = new ButtonImageToggle(element);
	Interface.toolRotate.setImage(Editor.filePath + "icons/tools/rotate.png");
	Interface.toolRotate.size.set(Interface.sideBar.size.x, Interface.sideBar.size.x);
	Interface.toolRotate.position.set(0, 160);
	Interface.toolRotate.setAltText("Rotate (CTRL+4)");
	Interface.toolRotate.updateInterface();
	Interface.toolRotate.setCallback(function()
	{
		Interface.selectTool(Editor.ROTATE);
	});
}


