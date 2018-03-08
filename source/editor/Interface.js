"use strict";

function Interface(){}

Interface.initialize = function()
{
	//Main tab container
	Interface.tab = new TabGroup();

	//Bottom resizable division
	Interface.bottomDiv = new DivisionResizable();
	Interface.bottomDiv.resizableSide = DivisionResizable.TOP;
	Interface.bottomDiv.size.y = 150;
	Interface.bottomDiv.resizeSizeMin = 100;
	Interface.bottomDiv.resizeSizeMax = 400;

	//Bottom tab
	Interface.bottomTab = new TabGroup(Interface.bottomDiv.element);
	Interface.bottomTab.mode = TabGroup.LEFT;
	Interface.bottomTab.buttonSize.set(25, 25);
	Interface.bottomTab.element.style.backgroundColor = Editor.theme.barColor;

	//Asset
	Interface.assetExplorer = Interface.bottomTab.addTab(AssetExplorer, false);
	Interface.assetExplorer.button.setAltText("Asset explorer");

	//Console
	Interface.console = Interface.bottomTab.addTab(ConsoleTab, false);
	Interface.console.button.setAltText("Console");

	//Animations
	Interface.animation = Interface.bottomTab.addTab(AnimationTab, false);
	Interface.animation.button.setAltText("Animation");

	//Explorer
	Interface.explorer = new DivisionResizable();
	Interface.explorer.size.x = 300;
	Interface.explorer.resizeSizeMin = 100;
	Interface.explorer.setOnResize(function()
	{
		Interface.updateInterface();
	});

	Interface.explorerResizable = new DualDivision(Interface.explorer.element);
	Interface.explorerResizable.orientation = DualDivision.VERTICAL;
	Interface.explorerResizable.tabPosition = 0.6;
	Interface.explorerResizable.setOnResize(function()
	{
		Interface.explorerResizable.updateInterface();
		
		Interface.treeTab.size.copy(Interface.explorerResizable.divASize);
		Interface.treeTab.updateInterface();

		if(Interface.panel !== null)
		{
			Interface.panel.updateInterface();
		}
	});

	Interface.treeTab = new TabGroup(Interface.explorerResizable.divA);	
	Interface.treeView = Interface.treeTab.addTab(TreeView, false)

	//Object panel
	Interface.panel = new Panel(Interface.explorerResizable.divB);

	//Side bar
	Interface.sideBar = new Bar();
	Interface.sideBar.size.x = 40;
	
	//Tool Bar
	Interface.toolBar = new ToolBar(Interface.sideBar.element);

	//Add object bar
	Interface.addObjectBar = new AddObjectSideBar(Interface.sideBar.element);

	//Top Bar
	Interface.topBar = new MainMenu();
};

//Update interface
Interface.updateInterface = function()
{
	//Window size
	var size = new THREE.Vector2(window.innerWidth, window.innerHeight);

	//Tool Bar
	Interface.sideBar.position.set(0, Interface.topBar.size.y);
	Interface.sideBar.size.y = size.y - Interface.topBar.size.y;
	Interface.sideBar.updateInterface();

	//Project Explorer
	Interface.explorer.size.y = (size.y - Interface.topBar.size.y);
	Interface.explorer.position.set(size.x - Interface.explorer.size.x, Interface.topBar.size.y);
	Interface.explorer.resizeSizeMax = size.x * 0.7;
	Interface.explorer.updateInterface();

	Interface.explorerResizable.size.set(Interface.explorer.size.x - Interface.explorer.resizeTabSize, Interface.explorer.size.y);
	Interface.explorerResizable.updateInterface();
	Interface.explorerResizable.onResize();

	//Bottom division
	Interface.bottomDiv.size.x = size.x - Interface.explorer.size.x - Interface.sideBar.size.x;
	Interface.bottomDiv.position.set(Interface.sideBar.size.x, size.y - Interface.bottomDiv.size.y);
	Interface.bottomDiv.resizeSizeMax = size.y * 0.7;
	Interface.bottomDiv.updateInterface();

	//Bottom tab group
	Interface.bottomTab.size.x = Interface.bottomDiv.size.x;
	Interface.bottomTab.size.y = Interface.bottomDiv.size.y - 5;
	Interface.bottomTab.updateInterface();
	
	//Tab Container
	Interface.tab.position.set(Interface.sideBar.size.x, Interface.topBar.size.y);
	Interface.tab.size.x = (size.x - Interface.sideBar.size.x - Interface.explorer.size.x);
	Interface.tab.size.y = (size.y - Interface.topBar.size.y - Interface.bottomDiv.size.y); 
	Interface.tab.updateInterface();
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
