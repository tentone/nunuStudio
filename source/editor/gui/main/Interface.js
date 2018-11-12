"use strict";

function Interface()
{
	/**
	 * Tab container.
	 * 
	 * @attribute tab
	 * @type {TabContainer}
	 */
	this.tab = new TabContainer(DocumentBody);
	this.tab.attach(new TabGroupNew());

	var main = this.tab.split(TabGroup.RIGHT).parent;
	main.tabPosition = 0.7;

	var left = main.elementA.split(TabGroup.BOTTOM).parent;
	left.tabPosition = 0.7;
	var leftTop = left.elementA;
	var leftBottom = left.elementB;

	var right = main.elementB.split(TabGroup.BOTTOM).parent;
	var rightTop = right.elementA;
	var rightBottom = right.elementB;

	//Asset
	this.assetExplorer = leftBottom.addTab(AssetExplorer, false);

	//Console
	this.console = leftBottom.addTab(ConsoleTab, false);

	//Animations
	this.animation = leftBottom.addTab(AnimationTab, false);

	//Tree view
	this.treeView = rightTop.addTab(TreeView, false)
	
	//Inspector
	this.panelContainer = rightBottom.addTab(PanelContainer, false);

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
	this.tab.position.set(this.sideBar.size.x, this.menuBar.size.y);
	this.tab.size.set(width - this.sideBar.size.x, height - this.menuBar.size.y);
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
	if(Editor.confirm(Locale.loadProjectChangesLost + " " + Locale.loadProject))
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
	if(Editor.confirm(Locale.loadProjectChangesLost + " " + Locale.createProject))
	{
		Editor.createNewProgram();
	}
};
