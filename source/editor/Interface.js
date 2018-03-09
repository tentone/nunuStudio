"use strict";

function Interface(){}

Interface.initialize = function()
{
	Interface.container = new DualContainer(document.body);

	//Left
	Interface.leftContainer = new DualContainer(Interface.container.element);
	Interface.leftContainer.orientation = DualContainer.VERTICAL;
	Interface.container.attachA(Interface.leftContainer);

	//Top Tab
	Interface.tab = new TabGroup(Interface.leftContainer.element);
	Interface.leftContainer.attachA(Interface.tab);

	//Bottom tab
	Interface.bottomTab = new TabGroup(Interface.leftContainer.element);
	Interface.leftContainer.attachB(Interface.bottomTab);

	//Asset
	Interface.assetExplorer = Interface.bottomTab.addTab(AssetExplorer, false);
	//Interface.assetExplorer.button.setAltText("Asset explorer");

	//Console
	var console = Interface.bottomTab.addTab(ConsoleTab, false);
	//console.button.setAltText("Console");

	//Animations
	var animation = Interface.bottomTab.addTab(AnimationTab, false);
	//animation.button.setAltText("Animation");

	//Right
	Interface.rightContainer = new DualContainer(Interface.container.element);
	Interface.container.attachB(Interface.rightContainer);

	//Tree tab
	Interface.treeTab = new TabGroup(Interface.rightContainer.element);
	Interface.rightContainer.attachA(Interface.treeTab);

	//Tree view
	Interface.treeView = Interface.treeTab.addTab(TreeView, false)

	//Object panel
	Interface.panelTab = new TabGroup(Interface.rightContainer.element);
	Interface.rightContainer.attachB(Interface.panelTab);

	Interface.panelContainer = Interface.panelTab.addTab(PanelContainer, false);
	
	Interface.panel = null;

	//Top Bar
	Interface.topBar = new MainMenu();

	//Side bar
	Interface.sideBar = new Bar();
	Interface.sideBar.position.set(0, Interface.topBar.size.y);
	Interface.sideBar.size.x = 40;
	
	//Tool Bar
	Interface.toolBar = new ToolBar(Interface.sideBar.element);
	new AddObjectSideBar(Interface.sideBar.element);

};

//Update interface
Interface.updateInterface = function()
{
	//Window size
	var size = new THREE.Vector2(window.innerWidth, window.innerHeight);

	//Side bar
	Interface.sideBar.size.y = size.y - Interface.topBar.size.y;
	Interface.sideBar.updateInterface();

	//Container
	Interface.container.position.set(Interface.sideBar.size.x, Interface.topBar.size.y);
	Interface.container.size.set(size.x - Interface.sideBar.size.x, size.y - Interface.topBar.size.y);
	Interface.container.updateInterface();
};

//Open to save program window
Interface.saveProgram = function()
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
Interface.loadProgram = function()
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

//Interface elemento to create new program
Interface.newProgram = function()
{
	if(Editor.confirm("All unsaved changes to the project will be lost! Create new File?"))
	{
		Editor.createNewProgram();
	}
};
