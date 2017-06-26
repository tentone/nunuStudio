"use strict";

function Interface(){}

Interface.initialize = function()
{
	//Tab Container
	Interface.tab = new TabGroup();

	//Message
	Interface.message = new Message();
	
	//Asset Manager
	Interface.bottomDiv = new DivisionResizable();
	Interface.bottomDiv.resizableSide = DivisionResizable.TOP;
	Interface.bottomDiv.size.y = 150;
	Interface.bottomDiv.resizeSizeMin = 100;
	Interface.bottomDiv.resizeSizeMax = 400;

	//Asset explorer
	Interface.assetExplorer = new AssetExplorer(Interface.bottomDiv.element);
	Interface.assetExplorer.filesSize.set(Settings.general.filePreviewSize, Settings.general.filePreviewSize);
	
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
		Interface.treeView.updateInterface();
		if(Interface.panel !== null)
		{
			Interface.panel.updateInterface();
		}
	});

	//Project explorer
	Interface.treeView = new TreeView(Interface.explorerResizable.divA);

	//Object panel
	Interface.panel = new Panel(Interface.explorerResizable.divB);

	//Tool Bar
	Interface.toolBar = new Bar();
	Interface.toolBar.size.x = 40;

	//Tools text
	Interface.toolText = new Text(Interface.toolBar.element);
	Interface.toolText.setText("Tools");
	Interface.toolText.position.set(Interface.toolBar.size.x / 2, 40);
	Interface.toolText.updateInterface();

	//Select
	Interface.toolSelect = new ButtonImageToggle();
	Interface.toolSelect.selected = true;
	Interface.toolSelect.setImage(Editor.filePath + "icons/tools/select.png");
	Interface.toolSelect.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.toolSelect.position.set(0, 80);
	Interface.toolSelect.setAltText("Select");
	Interface.toolSelect.updateInterface();
	Interface.toolSelect.setCallback(function()
	{
		Interface.selectTool(Editor.SELECT);
	});

	//Move
	Interface.toolMove = new ButtonImageToggle();
	Interface.toolMove.setImage(Editor.filePath + "icons/tools/move.png");
	Interface.toolMove.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.toolMove.position.set(0, 120);
	Interface.toolMove.setAltText("Move");
	Interface.toolMove.updateInterface();
	Interface.toolMove.setCallback(function()
	{
		Interface.selectTool(Editor.MOVE);
	});

	//Resize
	Interface.toolScale = new ButtonImageToggle();
	Interface.toolScale.setImage(Editor.filePath + "icons/tools/resize.png");
	Interface.toolScale.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.toolScale.position.set(0, 160);
	Interface.toolScale.setAltText("Scale");
	Interface.toolScale.updateInterface();
	Interface.toolScale.setCallback(function()
	{
		Interface.selectTool(Editor.SCALE);
	});

	//Rotate
	Interface.toolRotate = new ButtonImageToggle();
	Interface.toolRotate.setImage(Editor.filePath + "icons/tools/rotate.png");
	Interface.toolRotate.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.toolRotate.position.set(0, 200);
	Interface.toolRotate.setAltText("Rotate");
	Interface.toolRotate.updateInterface();
	Interface.toolRotate.setCallback(function()
	{
		Interface.selectTool(Editor.ROTATE);
	});
 
	//Add Text
	Interface.addText = new Text(Interface.toolBar.element);
	Interface.addText.setText("Add");
	Interface.addText.position.set(Interface.toolBar.size.x / 2, 240);
	Interface.addText.updateInterface();

	//Add Models
	Interface.addModel = new ButtonDrawer();
	Interface.addModel.setImage(Editor.filePath + "icons/models/models.png");
	Interface.addModel.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addModel.position.set(0, 280);
	Interface.addModel.optionsSize.set(40, 40);
	Interface.addModel.updateInterface();

	//Cube
	Interface.addModel.addOption(Editor.filePath + "icons/models/cube.png", function()
	{
		var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cube";
		Editor.addToScene(model);
	}, "Cube");

	//Cylinder
	Interface.addModel.addOption(Editor.filePath + "icons/models/cylinder.png", function()
	{
		var geometry = new THREE.CylinderBufferGeometry(1, 1, 2, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cylinder";
		Editor.addToScene(model);
	}, "Cylinder");

	//Sphere
	Interface.addModel.addOption(Editor.filePath + "icons/models/sphere.png", function()
	{
		var geometry = new THREE.SphereBufferGeometry(1, 32, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "sphere";
		Editor.addToScene(model);
	}, "Sphere");

	//Torus
	Interface.addModel.addOption(Editor.filePath + "icons/models/torus.png", function()
	{
		var geometry = new THREE.TorusBufferGeometry(1, 0.5, 16, 96);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "torus";
		Editor.addToScene(model);
	}, "Torus");

	//Cone
	Interface.addModel.addOption(Editor.filePath + "icons/models/cone.png", function()
	{
		var geometry = new THREE.ConeBufferGeometry(1, 2, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cone";
		Editor.addToScene(model);
	}, "Cone");

	//Text
	Interface.addModel.addOption(Editor.filePath + "icons/models/text.png", function()
	{
		var model = new Text3D("text", Editor.defaultMaterial, Editor.defaultFont);
		Editor.addToScene(model);
	}, "3D Text");

	//Tetrahedron
	Interface.addModel.addOption(Editor.filePath + "icons/models/pyramid.png", function()
	{
		var geometry = new THREE.TetrahedronGeometry(1, 0);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "tetrahedron";
		Editor.addToScene(model);
	}, "Tetrahedron");

	//Plane
	Interface.addModel.addOption(Editor.filePath + "icons/models/plane.png", function()
	{
		var geometry = new THREE.PlaneBufferGeometry(1,1);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "plane";
		Editor.addToScene(model);
	}, "Plane");

	//Circle
	Interface.addModel.addOption(Editor.filePath + "icons/models/circle.png", function()
	{
		var geometry = new THREE.CircleBufferGeometry(1, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "circle";
		Editor.addToScene(model);
	}, "Cicle");

	//Add lights
	Interface.addLight = new ButtonDrawer();
	Interface.addLight.setImage(Editor.filePath + "icons/lights/point.png");
	Interface.addLight.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addLight.position.set(0, 320);
	Interface.addLight.optionsSize.set(40, 40);
	Interface.addLight.updateInterface();

	//Point Light
	Interface.addLight.addOption(Editor.filePath + "icons/lights/point.png", function()
	{
		Editor.addToScene(new PointLight(0x444444));
	}, "Point Light");

	//Ambient Light
	Interface.addLight.addOption(Editor.filePath + "icons/lights/ambient.png", function()
	{
		Editor.addToScene(new AmbientLight(0x444444));
	}, "Ambient Light");

	//Spot Light
	Interface.addLight.addOption(Editor.filePath + "icons/lights/spot.png", function()
	{
		Editor.addToScene(new SpotLight(0x444444));
	}, "Spot Light");

	//Directional Light
	Interface.addLight.addOption(Editor.filePath + "icons/lights/directional.png", function()
	{
		Editor.addToScene(new DirectionalLight(0x444444));
	}, "Directional Light");

	//Hemisphere Light
	Interface.addLight.addOption(Editor.filePath + "icons/lights/hemisphere.png", function()
	{
		Editor.addToScene(new HemisphereLight(0x444444));
	}, "Hemisphere Light");

	//RectArea Light
	Interface.addLight.addOption(Editor.filePath + "icons/lights/rectarea.png", function()
	{
		Editor.addToScene(new RectAreaLight(0x444444, 100, 1, 1));
	}, "RectArea Light");

	//Sky
	Interface.addLight.addOption(Editor.filePath + "icons/lights/sky.png", function()
	{
		Editor.addToScene(new Sky());
	}, "Sky");

	//Add camera
	Interface.addCamera = new ButtonDrawer();
	Interface.addCamera.setImage(Editor.filePath + "icons/camera/camera.png");
	Interface.addCamera.optionsPerLine = 2;
	Interface.addCamera.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addCamera.position.set(0, 360);
	Interface.addCamera.optionsSize.set(40, 40);
	Interface.addCamera.updateInterface();

	//Prespective camera
	Interface.addCamera.addOption(Editor.filePath + "icons/camera/prespective.png", function()
	{
		Editor.addToScene(new PerspectiveCamera(60, 1));
	}, "Prespective Camera");

	//Orthographic camera
	Interface.addCamera.addOption(Editor.filePath + "icons/camera/orthographic.png", function()
	{
		Editor.addToScene(new OrthographicCamera(3, 2, OrthographicCamera.RESIZE_HORIZONTAL));
	}, "Othographic Camera");

	//Add script
	Interface.addScript = new ButtonDrawer();
	Interface.addScript.setImage(Editor.filePath + "icons/script/script.png");
	Interface.addScript.optionsPerLine = 1;
	Interface.addScript.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addScript.position.set(0, 400);
	Interface.addScript.optionsSize.set(40, 40);
	Interface.addScript.updateInterface();

	//Javascript script
	Interface.addScript.addOption(Editor.filePath + "icons/script/script.png", function()
	{
		Editor.addToScene(new Script());
	}, "JS Script");

	//Sprites and effects
	Interface.addEffects = new ButtonDrawer();
	Interface.addEffects.setImage(Editor.filePath + "icons/misc/particles.png");
	Interface.addEffects.optionsPerLine = 3;
	Interface.addEffects.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addEffects.position.set(0, 440);
	Interface.addEffects.optionsSize.set(40, 40);
	Interface.addEffects.updateInterface();

	//Sprite
	Interface.addEffects.addOption(Editor.filePath + "icons/misc/sprite.png", function()
	{
		Editor.addToScene(new Sprite(Editor.defaultSpriteMaterial));
	}, "Sprite");

	//Particle emitter
	Interface.addEffects.addOption(Editor.filePath + "icons/misc/particles.png", function()
	{
		var particle = new ParticleEmitter()
		particle.texture = Editor.defaultTextureParticle;
		Editor.addToScene(particle);
	}, "Particle Emitter");

	//Container
	Interface.addEffects.addOption(Editor.filePath + "icons/misc/container.png", function()
	{
		Editor.addToScene(new Container());
	}, "Container");

	//Cube Camera
	Interface.addEffects.addOption(Editor.filePath + "icons/misc/probe.png", function()
	{
		Editor.addToScene(new CubeCamera());
	}, "Cube Camera")

	//Audio
	Interface.addEffects.addOption(Editor.filePath + "icons/misc/audio.png", function()
	{
		Editor.addToScene(new AudioEmitter(Editor.defaultAudio));
	}, "Audio");

	//Positional Audio
	Interface.addEffects.addOption(Editor.filePath + "icons/misc/audio_positional.png", function()
	{
		Editor.addToScene(new PositionalAudio(Editor.defaultAudio));
	}, "Positional Audio");

	//Physics
	Interface.addPhysics = new ButtonDrawer();
	Interface.addPhysics.setImage(Editor.filePath + "icons/misc/physics.png");
	Interface.addPhysics.optionsPerLine = 3;
	Interface.addPhysics.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addPhysics.position.set(0, 480);
	Interface.addPhysics.optionsSize.set(40, 40);
	Interface.addPhysics.updateInterface();

	//Physics box
	Interface.addPhysics.addOption(Editor.filePath + "icons/models/cube.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
		obj.name = "box";
		Editor.addToScene(obj);
	}, "Box");

	//Physics sphere
	Interface.addPhysics.addOption(Editor.filePath + "icons/models/sphere.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Sphere(1.0));
		obj.name = "sphere";
		Editor.addToScene(obj);
	}, "Sphere");

	//Physics Cylinder
	Interface.addPhysics.addOption(Editor.filePath + "icons/models/cylinder.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Cylinder(1.0, 1.0, 2.0, 8));
		obj.name = "cylinder";
		Editor.addToScene(obj);
	}, "Cylinder");

	//Physics Plane
	Interface.addPhysics.addOption(Editor.filePath + "icons/models/plane.png", function()
	{
		var obj = new PhysicsObject();
		obj.rotation.x = -1.57;
		obj.body.addShape(new CANNON.Plane());
		obj.body.type = CANNON.Body.KINEMATIC;
		obj.name = "ground";
		Editor.addToScene(obj);
	}, "Ground");

	//Physics Particle
	Interface.addPhysics.addOption(Editor.filePath + "icons/models/point.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Particle());
		obj.name = "particle";
		Editor.addToScene(obj);
	}, "Particle");

	//Add device
	Interface.addDevice = new ButtonDrawer();
	Interface.addDevice.setImage(Editor.filePath + "icons/hw/hw.png");
	Interface.addDevice.optionsPerLine = 2;
	Interface.addDevice.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addDevice.position.set(0, 520);
	Interface.addDevice.optionsSize.set(40, 40);
	Interface.addDevice.updateInterface();

	//Leap Hand
	Interface.addDevice.addOption(Editor.filePath + "icons/hw/leap.png", function()
	{
		Editor.addToScene(new LeapMotion());
	}, "Leap Motion");

	//Kinect Skeleton
	Interface.addDevice.addOption(Editor.filePath + "icons/hw/kinect.png", function()
	{
		Editor.addToScene(new KinectDevice());
	}, "Microsoft Kinect");

	//Menu Top Bar
	Interface.topBar = new Bar();
	Interface.topBar.size.y = 25 ;

	//Editor Logo
	Interface.image = new ImageBox();
	Interface.image.setImage(Editor.filePath + "logo.png");
	Interface.image.size.set(108, 18);
	Interface.image.updateInterface();

	//File
	Interface.file = new DropdownMenu();
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

	//Editor
	Interface.editor = new DropdownMenu();
	Interface.editor.setText("Edit");
	Interface.editor.size.set(100, Interface.topBar.size.y);
	Interface.editor.position.set(120,0);

	Interface.editor.addOption("Undo", function()
	{
		Editor.undo();
	}, Editor.filePath + "icons/misc/undo.png");

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

	//Project
	Interface.project = new DropdownMenu();
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

	//About
	Interface.about = new Button();
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
	Interface.run = new Button();
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

	//Logo
	Interface.image.position.set(size.x - Interface.image.size.x, 3);
	Interface.image.updateInterface();

	//Tool Bar
	Interface.toolBar.position.set(0, Interface.topBar.size.y);
	Interface.toolBar.size.y = size.y - Interface.topBar.size.y;
	Interface.toolBar.updateInterface();

	//Project Explorer
	Interface.explorer.size.y = (size.y - Interface.topBar.size.y);
	Interface.explorer.position.set(size.x - Interface.explorer.size.x, Interface.topBar.size.y);
	Interface.explorer.resizeSizeMax = size.x * 0.7;
	Interface.explorer.updateInterface();

	Interface.explorerResizable.size.set(Interface.explorer.size.x - Interface.explorer.resizeTabSize, Interface.explorer.size.y);
	Interface.explorerResizable.updateInterface();

	Interface.treeView.updateInterface();

	if(Interface.panel !== null)
	{
		Interface.panel.updateInterface();
	}
	
	//Bottom division
	Interface.bottomDiv.size.x = size.x - Interface.explorer.size.x - Interface.toolBar.size.x;
	Interface.bottomDiv.position.set(Interface.toolBar.size.x, size.y - Interface.bottomDiv.size.y);
	Interface.bottomDiv.resizeSizeMax = size.y * 0.6;
	Interface.bottomDiv.updateInterface();

	//Asset explorere
	Interface.assetExplorer.size.x = Interface.bottomDiv.size.x;
	Interface.assetExplorer.size.y = Interface.bottomDiv.size.y;
	Interface.assetExplorer.updateInterface();

	//Tab Container
	Interface.tab.position.set(Interface.toolBar.size.x, Interface.topBar.size.y);
	Interface.tab.size.x = (size.x - Interface.toolBar.size.x - Interface.explorer.size.x);
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
		}, ".isp", true);
	}
	else
	{
		FileSystem.chooseFileName(function(fname)
		{
			Editor.saveProgram(fname, true);
		}, ".isp", Editor.openFile !== null ? Editor.openFile : "file");
	}
};

//Open to load program window
Interface.loadProgram = function()
{
	if(Editor.confirm("All unsaved changes to the project will be lost! Load file?"))
	{
		FileSystem.chooseFile(function(files)
		{
			Editor.loadProgram(files[0]);
		}, ".isp");
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
