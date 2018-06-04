"use strict";

function Interface()
{
	//Main container
	this.container = new DualContainer(document.body);
	this.container.tabPosition = 0.75;

	//Left
	this.leftContainer = new DualContainer(this.container.element);
	this.leftContainer.orientation = DualContainer.VERTICAL;
	this.leftContainer.tabPosition = 0.7;
	this.container.attachA(this.leftContainer);

	//Top Tab
	this.tab = new TabGroup(this.leftContainer.element);
	this.leftContainer.attachA(this.tab);

	//Bottom tab
	this.bottomTab = new TabGroup(this.leftContainer.element);
	this.bottomTab.mode = TabGroup.LEFT;
	this.bottomTab.element.style.backgroundColor = Editor.theme.barColor;
	this.bottomTab.buttonSize.set(25, 25);
	this.leftContainer.attachB(this.bottomTab);

	//Asset
	var assetExplorer = this.bottomTab.addTab(AssetExplorer, false);
	assetExplorer.button.setAltText("Asset explorer");

	//Console
	if(!Nunu.developmentMode())
	{
		var console = this.bottomTab.addTab(ConsoleTab, false);
		console.button.setAltText("Console");
	}

	//Animations
	var animation = this.bottomTab.addTab(AnimationTab, false);
	animation.button.setAltText("Animation");

	//Right
	this.rightContainer = new DualContainer(this.container.element);
	this.rightContainer.orientation = DualContainer.VERTICAL;
	this.container.attachB(this.rightContainer);

	//Tree view tab
	this.treeTab = new TabGroup(this.rightContainer.element);
	this.rightContainer.attachA(this.treeTab);
	this.treeView = this.treeTab.addTab(TreeView, false)

	//Object panel tab
	this.panelTab = new TabGroup(this.rightContainer.element);
	this.rightContainer.attachB(this.panelTab);
	this.panelContainer = this.panelTab.addTab(PanelContainer, false);

	//Top Bar
	this.menuBar = new MainMenu();

	//Side bar
	this.sideBar = new Bar();
	this.sideBar.position.set(0, this.menuBar.size.y);
	this.sideBar.size.x = 40;
	
	//Tool Bar
	this.toolBar = new ToolBar(this.sideBar.element);
	new AddObjectSideBar(this.sideBar.element);
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
	this.container.position.set(this.sideBar.size.x, this.menuBar.size.y);
	this.container.size.set(size.x - this.sideBar.size.x, size.y - this.menuBar.size.y);
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
