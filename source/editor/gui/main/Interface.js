"use strict";

function Interface()
{
	this.container = new TabContainer(DocumentBody);

	this.tab = new TabGroupNew();
	this.container.attach(this.tab);

	//Asset
	this.assetExplorer = this.tab.addTab(AssetExplorer, false);

	//Console
	this.console = this.tab.addTab(ConsoleTab, false);

	//Animations
	this.animation = this.tab.addTab(AnimationTab, false);

	//Tree view
	this.treeView = this.tab.addTab(TreeView, false)
	
	//Inspector
	this.panelContainer = this.tab.addTab(PanelContainer, false);

	//Top Bar
	this.menuBar = new MainMenu(DocumentBody);

	//Side bar
	this.sideBar = new Bar(DocumentBody);
	this.sideBar.position.set(0, this.menuBar.size.y);
	this.sideBar.size.x = 40;
	
	//Tool Bar
	this.toolBar = new ToolBar(this.sideBar);
	
	new AddObjectSideBar(this.sideBar);
}

Interface.prototype.updateInterface = function()
{
	var width = window.innerWidth;
	var height = window.innerHeight;

	//Side bar
	this.sideBar.size.y = height - this.menuBar.size.y;
	this.sideBar.updateInterface();

	//Container
	this.container.position.set(this.sideBar.size.x, this.menuBar.size.y);
	this.container.size.set(width - this.sideBar.size.x, height - this.menuBar.size.y);
	this.container.updateInterface();
};

//Open to save program window
Interface.prototype.saveProgram = function()
{
	if(Nunu.runningOnDesktop())
	{
		FileSystem.chooseFile(function(files)
		{
			Editor.saveProgram(files[0].path, true);
		}, ".nsp", true);
	}
	else
	{
		FileSystem.chooseFileName(function(fname)
		{
			Editor.saveProgram(fname, true);
		}, ".nsp", Editor.openFile !== null ? Editor.openFile : "file");
	}
};

//Open to load program window
Interface.prototype.loadProgram = function()
{
	if(Editor.confirm("All unsaved changes to the project will be lost! Load file?"))
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0];

				Editor.loadProgram(file, file.name.endsWith(".nsp"));
			}
		}, ".isp, .nsp");
	}
};

//Create new program
Interface.prototype.newProgram = function()
{
	if(Editor.confirm("All unsaved changes to the project will be lost! Create new File?"))
	{
		Editor.createNewProgram();
	}
};
