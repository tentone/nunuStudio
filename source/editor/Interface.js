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
	this.tab.attach(new TabGroupSplit());

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
	this.tree = rightTop.addTab(TreeView, false)
	
	//Inspector
	this.inspector = rightBottom.addTab(InspectorContainer, false);

	//Top Bar
	this.menuBar = new MainMenu(DocumentBody);
}

Interface.prototype.updateInterface = function()
{
	var width = window.innerWidth;
	var height = window.innerHeight;

	this.tab.position.set(0, this.menuBar.size.y);
	this.tab.size.set(width, height - this.menuBar.size.y);
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
				Editor.loadProgram(files[0], files[0].name.endsWith(".nsp"));
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
