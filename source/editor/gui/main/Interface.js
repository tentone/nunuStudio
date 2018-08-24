"use strict";

function Interface()
{
	//Top Tab
	this.tab = new TabGroupNew(); //TabGroupNew

	//Asset
	this.assetExplorer = this.tab.addTab(AssetExplorer, false);

	//Console
	//this.console = this.tab.addTab(ConsoleTab, false);

	//Animations
	this.animation = this.tab.addTab(AnimationTab, false);

	//Tree view
	this.treeView = this.tab.addTab(TreeView, false)
	
	//Inspector
	this.panelContainer = this.tab.addTab(PanelContainer, false);

	//Top Bar
	this.menuBar = new MainMenu();

	//Side bar
	this.sideBar = new Bar();
	this.sideBar.position.set(0, this.menuBar.size.y);
	this.sideBar.size.x = 40;
	
	//Tool Bar
	this.toolBar = new ToolBar(this.sideBar);
	
	new AddObjectSideBar(this.sideBar);
}

//Update this
Interface.prototype.updateInterface = function()
{
	//Window size
	var size = new THREE.Vector2(window.innerWidth, window.innerHeight);

	//Side bar
	this.sideBar.size.y = size.y - this.menuBar.size.y;
	this.sideBar.updateInterface();

	//Container
	this.tab.position.set(this.sideBar.size.x, this.menuBar.size.y);
	this.tab.size.set(size.x - this.sideBar.size.x, size.y - this.menuBar.size.y);
	this.tab.updateInterface();
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
