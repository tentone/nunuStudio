"use strict";

function Interface(){}

Interface.initialize = function()
{
	//Main tab container
	Interface.tab = new TabGroup();

	//Message
	//Interface.message = new Message();
	
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

	Interface.explorerResizable = new DualDivisionResizable(Interface.explorer.element);
	Interface.explorerResizable.orientation = DualDivisionResizable.VERTICAL;
	Interface.explorerResizable.tabPosition = 0.6;
	Interface.explorerResizable.setOnResize(function()
	{
		Interface.explorerResizable.updateInterface();
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
	AddObjectSideBar(Interface.sideBar.element);

	//Menu Top Bar
	Interface.topBar = new Bar();
	Interface.topBar.size.y = 25;

	//Editor Logo
	var logo = document.createElement("div");
	logo.style.position = "absolute";
	logo.style.pointerEvents = "none";
	logo.style.width = "108px";
	logo.style.height = "18px";
	logo.style.top = "3px";
	logo.style.right = "3px";
	Interface.topBar.element.appendChild(logo);

	var logoImage = document.createElement("img");
	logoImage.src = Editor.filePath + "logo.png";
	logoImage.style.pointerEvents = "none";
	logoImage.style.position = "absolute";
	logoImage.style.top = "0px";
	logoImage.style.left = "0px";
	logoImage.style.width = "108px";
	logoImage.style.height = "18px";
	logo.appendChild(logoImage);

	//File
	Interface.file = new DropdownMenu(Interface.topBar.element);
	Interface.file.setText("File");
	Interface.file.size.set(120, Interface.topBar.size.y);
	Interface.file.position.set(0,0);

	//New project
	Interface.file.addOption("New", function()
	{
		Interface.newProgram();
	}, Editor.filePath + "icons/misc/new.png");

	//Save project
	Interface.file.addOption("Save", function()
	{
		if(Editor.openFile !== null)
		{
			Editor.saveProgram(undefined, true);
		}
		else
		{
			Interface.saveProgram();
		}
	}, Editor.filePath + "icons/misc/save.png");

	//Save project
	Interface.file.addOption("Save As", function()
	{
		Interface.saveProgram();
	}, Editor.filePath + "icons/misc/save.png");

	//Load Project
	Interface.file.addOption("Load", function()
	{
		Interface.loadProgram();
	}, Editor.filePath + "icons/misc/load.png");

	//Settings
	Interface.file.addOption("Settings", function()
	{
		var tab = Interface.tab.getTab(SettingsTab);
		if(tab === null)
		{
			tab = Interface.tab.addTab(SettingsTab, true);
		}
		tab.select();
	}, Editor.filePath + "icons/misc/settings.png");

	//Publish
	var publish = Interface.file.addMenu("Publish", Editor.filePath + "icons/misc/publish.png");

	if(Nunu.runningOnDesktop())
	{
		//Publish web
		publish.addOption("Web", function()
		{
			FileSystem.chooseFile(function(files)
			{
				try
				{
					Editor.exportWebProject(files[0].path);
					Editor.alert("Project exported");
				}
				catch(e)
				{
					Editor.alert("Error exporting project (" + e + ")");
				}
			}, "", Editor.program.name);
		}, Editor.filePath + "icons/platform/web.png");

		//Publish windows
		if(FileSystem.fileExists(Editor.NWJSPath + "win"))
		{
			publish.addOption("Windows", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Editor.exportWindowsProject(files[0].path);
						Editor.alert("Project exported");
					}
					catch(e)
					{
						Editor.alert("Error exporting project (" + e + ")");
					}
				}, "", Editor.program.name);
			}, Editor.filePath + "icons/platform/windows.png");
		}

		//Publish linux
		if(FileSystem.fileExists(Editor.NWJSPath + "linux"))
		{
			publish.addOption("Linux", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Editor.exportLinuxProject(files[0].path);
						Editor.alert("Project exported");
					}
					catch(e)
					{
						Editor.alert("Error exporting project (" + e + ")");
					}
				}, "", Editor.program.name);
			}, Editor.filePath + "icons/platform/linux.png");
		}

		//Publish macos
		if(FileSystem.fileExists(Editor.NWJSPath + "mac"))
		{
			publish.addOption("macOS", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Editor.exportMacOSProject(files[0].path);
						Editor.alert("Project exported");
					}
					catch(e)
					{
						Editor.alert("Error exporting project (" + e + ")");
					}
				}, "", Editor.program.name);
			}, Editor.filePath + "icons/platform/osx.png");
		}
	}
	//Running on web browser
	else
	{
		publish.addOption("Web", function()
		{
			FileSystem.chooseFileName(function(fname)
			{
				Editor.exportWebProjectZip(fname);
				Editor.alert("Project exported");
			}, ".zip");
		}, Editor.filePath + "icons/platform/web.png");
	}

	//Import
	Interface.file.addOption("Import", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0];
				var binary = file.name.endsWith(".nsp");

				var loader = new ObjectLoader();
				var reader = new FileReader();
				reader.onload = function()
				{
					if(binary)
					{
						var pson = new dcodeIO.PSON.StaticPair();
						var data = pson.decode(reader.result);
						var program = loader.parse(data);
					}
					else
					{
						var program = loader.parse(JSON.parse(reader.result));
					}

					for(var i = 0; i < program.children.length; i++)
					{
						Editor.program.add(program.children[i]);
					}

					Editor.updateObjectViews();
				};

				if(binary)
				{
					reader.readAsArrayBuffer(file);
				}
				else
				{
					reader.readAsText(file);
				}
			}
		}, ".isp, .nsp");

	}, Editor.filePath + "icons/misc/import.png");

	//Export menu
	var exportMenu = Interface.file.addMenu("Export", Editor.filePath + "icons/misc/export.png");

	//Export OBJ
	exportMenu.addOption("Wavefront OBJ", function()
	{
		if(Nunu.runningOnDesktop())
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					var exporter = new THREE.OBJExporter();
					var data = exporter.parse(Editor.program);
					FileSystem.writeFile(files[0].path, data);
				}
			}, ".obj", true);
		}
		else
		{
			FileSystem.chooseFileName(function(fname)
			{
				var exporter = new THREE.OBJExporter();
				var data = exporter.parse(Editor.program);
				FileSystem.writeFile(fname, data);
			}, ".obj");
		}
	}, Editor.filePath + "icons/misc/scene.png");

	//Export GLTF
	exportMenu.addOption("GLTF", function()
	{
		if(Nunu.runningOnDesktop())
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					var renderer = new THREE.WebGLRenderer();
					var exporter = new THREE.GLTFExporter(renderer);
					exporter.parse([Editor.program.scene], function(result)
					{
						var data = JSON.stringify(result, null, 2);
						FileSystem.writeFile(files[0].path, data);

						renderer.dispose();
						renderer.forceContextLoss();
					});
				}
			}, ".gltf", true);
		}
		else
		{
			FileSystem.chooseFileName(function(fname)
			{
				var renderer = new THREE.WebGLRenderer();
				var exporter = new THREE.GLTFExporter(renderer);
				exporter.parse([Editor.program.scene], function(result)
				{
					var data = JSON.stringify(result, null, 2);
					FileSystem.writeFile(fname, data);

					renderer.dispose();
					renderer.forceContextLoss();
				})
			}, ".gltf");
		}
	}, Editor.filePath + "icons/misc/scene.png");

	//Export STL
	exportMenu.addOption("STL", function()
	{
		if(Nunu.runningOnDesktop())
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					var exporter = new THREE.STLExporter();
					var data = exporter.parse(Editor.program);
					FileSystem.writeFile(files[0].path, data);
				}
			}, ".stl", true);
		}
		else
		{
			FileSystem.chooseFileName(function(fname)
			{
				var exporter = new THREE.STLExporter();
				var data = exporter.parse(Editor.program);
				FileSystem.writeFile(fname, data);
			}, ".stl");
		}
	}, Editor.filePath + "icons/misc/scene.png");

	//Export Binary STL
	exportMenu.addOption("Binary STL", function()
	{
		if(Nunu.runningOnDesktop())
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					var exporter = new THREE.STLBinaryExporter();
					var data = exporter.parse(Editor.program);
					FileSystem.writeFileArrayBuffer(files[0].path, data.buffer);
				}
			}, ".stl", true);
		}
		else
		{
			FileSystem.chooseFileName(function(fname)
			{
				var exporter = new THREE.STLBinaryExporter();
				var data = exporter.parse(Editor.program);
				FileSystem.writeFileArrayBuffer(fname, data.buffer);
			}, ".stl");
		}
	}, Editor.filePath + "icons/misc/scene.png");

	//Exit
	if(Nunu.runningOnDesktop())
	{
		Interface.file.addOption("Exit", function()
		{
			if(Editor.confirm("All unsaved changes to the project will be lost! Do you really wanna exit?"))
			{
				Editor.exit();
			}
		}, Editor.filePath + "icons/misc/exit.png");
	}

	Interface.file.updateInterface();

	//Editor
	Interface.editor = new DropdownMenu(Interface.topBar.element);
	Interface.editor.setText("Edit");
	Interface.editor.size.set(100, Interface.topBar.size.y);
	Interface.editor.position.set(120,0);

	Interface.editor.addOption("Undo", function()
	{
		Editor.undo();
	}, Editor.filePath + "icons/misc/undo.png");

	Interface.editor.addOption("Redo", function()
	{
		Editor.redo();
	}, Editor.filePath + "icons/misc/redo.png");

	Interface.editor.addOption("Copy", function()
	{
		Editor.copyObject();
	}, Editor.filePath + "icons/misc/copy.png");
	
	Interface.editor.addOption("Cut", function()
	{
		Editor.cutObject();
	}, Editor.filePath + "icons/misc/cut.png");

	Interface.editor.addOption("Paste", function()
	{
		Editor.pasteObject();
	}, Editor.filePath + "icons/misc/paste.png");

	Interface.editor.addOption("Delete", function()
	{
		Editor.deleteObject();
	}, Editor.filePath + "icons/misc/delete.png");

	var csg = Interface.editor.addMenu("CSG", Editor.filePath + "icons/models/figures.png");

	var createBSP = function(object)
	{
		var geometry = object.geometry;

		if(geometry instanceof THREE.BufferGeometry)
		{
			geometry = new THREE.Geometry().fromBufferGeometry(geometry);
		}
		else
		{
			geometry = geometry.clone();
		}
		
		geometry.applyMatrix(object.matrixWorld);

		return new ThreeBSP(geometry);
	};

	csg.addOption("Intersect", function()
	{
		if(Editor.selectedObjects.length < 2)
		{
			Editor.alert("Operation needs two objects");
			return;
		}

		for(var i = 0; i < 2; i++)
		{
			if(Editor.selectedObjects[i].geometry === undefined)
			{
				Editor.alert("Operation needs two objects with geometries");
				return;
			}
		}

		var a = createBSP(Editor.selectedObjects[0]);
		var b = createBSP(Editor.selectedObjects[1]);
		
		var mesh = a.intersect(b).toMesh();
		mesh.material = Editor.defaultMaterial;

		Editor.addToScene(mesh);
	}, Editor.filePath + "icons/misc/intersect.png");

	csg.addOption("Subtract", function()
	{
		if(Editor.selectedObjects.length < 2)
		{
			Editor.alert("Operation needs two objects");
			return;
		}

		for(var i = 0; i < 2; i++)
		{
			if(Editor.selectedObjects[i].geometry === undefined)
			{
				Editor.alert("Operation needs two objects with geometries");
				return;
			}
		}
		
		var a = createBSP(Editor.selectedObjects[0]);
		var b = createBSP(Editor.selectedObjects[1]);

		var mesh = a.subtract(b).toMesh();
		mesh.material = Editor.defaultMaterial;

		Editor.addToScene(mesh);
	}, Editor.filePath + "icons/misc/subtract.png");

	csg.addOption("Union", function()
	{
		if(Editor.selectedObjects.length < 2)
		{
			Editor.alert("Operation needs two objects");
			return;
		}

		for(var i = 0; i < 2; i++)
		{
			if(Editor.selectedObjects[i].geometry === undefined)
			{
				Editor.alert("Operation needs two objects with geometries.");
				return;
			}
		}
		
		var a = createBSP(Editor.selectedObjects[0]);
		var b = createBSP(Editor.selectedObjects[1]);

		var mesh = a.union(b).toMesh();
		mesh.material = Editor.defaultMaterial;

		Editor.addToScene(mesh);
	}, Editor.filePath + "icons/misc/union.png");

	var modifiers = Interface.editor.addMenu("Modifiers", Editor.filePath + "icons/models/figures.png");

	modifiers.addOption("Simplify", function()
	{
		if(Editor.selectedObjects.length < 1 || Editor.selectedObjects[0].geometry === undefined)
		{
			Editor.alert("Operation needs a object with geometry");
			return;
		}

		var simplifier = new THREE.SimplifyModifier();

		var level = parseFloat(prompt("Simplification level in %")) / 100;

		if(isNaN(level) || level > 100 || level < 0)
		{
			Editor.alert("Level has to be a numeric value");
			return;
		}

		var original = Editor.selectedObjects[0].geometry;

		if(original instanceof THREE.BufferGeometry)
		{
			var vertices = original.getAttribute("position").array.length / 3;
		}
		else
		{
			var vertices = original.vertices.length;
		}


		var geometry = simplifier.modify(original, Math.ceil(vertices * level));
		var mesh = new Mesh(geometry, Editor.defaultMaterial);
		Editor.addToScene(mesh);

		Editor.alert("Reduced from " + vertices + " to " + Math.ceil(vertices * level) + " vertex.");

	}, Editor.filePath + "icons/models/figures.png");

	modifiers.addOption("Subdivide", function()
	{
		if(Editor.selectedObjects.length < 1 || Editor.selectedObjects[0].geometry === undefined)
		{
			Editor.alert("Operation needs a object with geometry");
			return;
		}

		var modifier = new THREE.BufferSubdivisionModifier();
		var geometry = modifier.modify(Editor.selectedObjects[0].geometry);
		var mesh = new Mesh(geometry, Editor.defaultMaterial);
		Editor.addToScene(mesh);
	}, Editor.filePath + "icons/models/figures.png");

	//Compute mesh normals
	Interface.editor.addOption("Compute normals", function()
	{
		if(Editor.selectedObjects.length < 1)
		{
			Editor.alert("Operation needs a mesh object.");
			return;
		}

		Editor.selectedObjects[0].geometry.computeVertexNormals();

	}, Editor.filePath + "icons/misc/probe.png");

	//Apply tranformation
	Interface.editor.addOption("Apply transformation", function()
	{
		if(Editor.selectedObjects.length < 1)
		{
			Editor.alert("Operation needs a mesh object.");
			return;
		}

		var obj = Editor.selectedObjects[0];
		obj.geometry.applyMatrix(obj.matrixWorld);
		obj.position.set(0, 0, 0);
		obj.scale.set(1, 1, 1);
		obj.rotation.set(0, 0, 0);

	}, Editor.filePath + "icons/tools/move.png");

	//Merge geometries
	Interface.editor.addOption("Merge geometries", function()
	{
		if(Editor.selectedObjects.length < 2)
		{
			Editor.alert("Operation needs 2 mesh object.");
			return;
		}

		var geometry = new THREE.Geometry();

		for(var i = 0; i < Editor.selectedObjects.length; i++)
		{	
			var obj = Editor.selectedObjects[i];
			if(obj.geometry !== undefined)
			{
				//Convert to geometry and merge
				if(obj.geometry instanceof THREE.BufferGeometry)
				{
					var converted = new THREE.Geometry();
					converted.fromBufferGeometry(obj.geometry);
					geometry.merge(converted, obj.matrixWorld)
				}
				//Merge geometry
				else
				{
					geometry.merge(obj.geometry, obj.matrixWorld)
				}
			}
		}

		var mesh = new Mesh(geometry, Editor.defaultMaterial);
		mesh.name = "merged";
		Editor.addToScene(mesh);

	}, Editor.filePath + "icons/misc/union.png");

	Interface.editor.updateInterface();

	//Project
	Interface.project = new DropdownMenu(Interface.topBar.element);
	Interface.project.setText("Project");
	Interface.project.size.set(100, Interface.topBar.size.y);
	Interface.project.position.set(220,0);

	Interface.project.addOption("Create Scene", function()
	{
		Editor.program.addDefaultScene();
		Editor.updateObjectViews();
	}, Editor.filePath + "icons/misc/add.png");

	Interface.project.addOption("Execute script", function()
	{
		FileSystem.chooseFile(function(files)
		{
			try
			{
				if(files.length > 0)
				{
					var code = FileSystem.readFile(files[0].path);
					var func = Function(code);
					func();
				}
			}
			catch(error)
			{
				Editor.alert("Error: " + error);
			}
		}, ".js");
	}, Editor.filePath + "icons/script/script.png");

	Interface.project.updateInterface();

	//About
	Interface.about = new ButtonMenu(Interface.topBar.element);
	Interface.about.setText("About");
	Interface.about.size.set(100, Interface.topBar.size.y);
	Interface.about.position.set(320, 0);
	Interface.about.updateInterface();
	Interface.about.setCallback(function()
	{
		var tab = Interface.tab.getTab(AboutTab);
		if(tab === null)
		{
			tab = Interface.tab.addTab(AboutTab, true);
		}

		tab.select();
	});

	//Run
	Interface.run = new ButtonMenu(Interface.topBar.element);
	Interface.run.setText("Run");
	Interface.run.size.set(100, Interface.topBar.size.y);
	Interface.run.position.set(420, 0);
	Interface.run.updateInterface();
	Interface.run.setCallback(function()
	{
		var tab = Interface.tab.getActual();
		if(tab instanceof SceneEditor)
		{
			if(tab.state === SceneEditor.EDITING)
			{
				tab.setState(SceneEditor.TESTING);
			}
			else if(tab.state === SceneEditor.TESTING)
			{
				tab.setState(SceneEditor.EDITING);
			}
		}
	});
};

//Update interface
Interface.updateInterface = function()
{
	//Window size
	var size = new THREE.Vector2(window.innerWidth, window.innerHeight);

	//Menu Top Bar
	Interface.topBar.size.x = size.x;
	Interface.topBar.updateInterface();

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

	Interface.treeTab.size.copy(Interface.explorerResizable.size);
	Interface.treeTab.updateInterface();

	//Interface.panelTab.size.copy(Interface.explorerResizable.size);
	//Interface.panelTab.updateInterface();
		
	if(Interface.panel !== null)
	{
		Interface.panel.updateInterface();
	}
	
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

//Select object manipulation tool
Interface.selectTool = function(tool)
{
	Interface.toolSelect.selected = false;
	Interface.toolMove.selected = false;
	Interface.toolScale.selected = false;
	Interface.toolRotate.selected = false;

	if(tool === Editor.SELECT)
	{
		Interface.toolSelect.selected = true;
	}
	else if(tool === Editor.MOVE)
	{
		Interface.toolMove.selected = true;
	}
	else if(tool === Editor.ROTATE)
	{
		Interface.toolRotate.selected = true;
	}
	else if(tool === Editor.SCALE)
	{
		Interface.toolScale.selected = true;
	}

	Editor.selectTool(tool);

	Interface.toolRotate.updateInterface();
	Interface.toolMove.updateInterface();
	Interface.toolScale.updateInterface();
	Interface.toolSelect.updateInterface();
};
