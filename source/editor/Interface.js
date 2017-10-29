"use strict";

function Interface(){}

Interface.initialize = function()
{
	//Main tab container
	Interface.tab = new TabGroup();

	//Message
	Interface.message = new Message();
	
	//Bottom resizable division
	Interface.bottomDiv = new DivisionResizable();
	Interface.bottomDiv.resizableSide = DivisionResizable.TOP;
	Interface.bottomDiv.size.y = 150;
	Interface.bottomDiv.resizeSizeMin = 100;
	Interface.bottomDiv.resizeSizeMax = 400;

	//Bottom tab
	Interface.bottomTab = new TabGroup(Interface.bottomDiv.element);
	Interface.bottomTab.mode = TabGroup.LEFT;
	Interface.bottomTab.buttonSize = new THREE.Vector2(25, 25);
	Interface.bottomTab.element.style.backgroundColor = Editor.theme.barColor;

	//Asset explorer
	Interface.assetExplorer = Interface.bottomTab.addTab(AssetExplorer, false);
	Interface.assetExplorer.filesSize.set(Settings.general.filePreviewSize, Settings.general.filePreviewSize);
	Interface.assetExplorer.button.setAltText("Asset explorer");

	Interface.console = Interface.bottomTab.addTab(ConsoleTab, false);
	Interface.console.button.setAltText("Console");

	//Interface.animation = Interface.bottomTab.addTab(AnimationTab, false);
	//Interface.animation.button.setAltText("Animation");
	
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
	Interface.toolText.size.set(40, 20);
	Interface.toolText.position.set(0, 20);
	Interface.toolText.updateInterface();

	//Select
	Interface.toolSelect = new ButtonImageToggle(Interface.toolBar.element);
	Interface.toolSelect.selected = true;
	Interface.toolSelect.setImage(Editor.filePath + "icons/tools/select.png");
	Interface.toolSelect.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.toolSelect.position.set(0, 40);
	Interface.toolSelect.setAltText("Select (CTRL+1)");
	Interface.toolSelect.updateInterface();
	Interface.toolSelect.setCallback(function()
	{
		Interface.selectTool(Editor.SELECT);
	});

	//Move
	Interface.toolMove = new ButtonImageToggle(Interface.toolBar.element);
	Interface.toolMove.setImage(Editor.filePath + "icons/tools/move.png");
	Interface.toolMove.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.toolMove.position.set(0, 80);
	Interface.toolMove.setAltText("Move (CTRL+2)");
	Interface.toolMove.updateInterface();
	Interface.toolMove.setCallback(function()
	{
		Interface.selectTool(Editor.MOVE);
	});

	//Resize
	Interface.toolScale = new ButtonImageToggle(Interface.toolBar.element);
	Interface.toolScale.setImage(Editor.filePath + "icons/tools/resize.png");
	Interface.toolScale.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.toolScale.position.set(0, 120);
	Interface.toolScale.setAltText("Scale (CTRL+3)");
	Interface.toolScale.updateInterface();
	Interface.toolScale.setCallback(function()
	{
		Interface.selectTool(Editor.SCALE);
	});

	//Rotate
	Interface.toolRotate = new ButtonImageToggle(Interface.toolBar.element);
	Interface.toolRotate.setImage(Editor.filePath + "icons/tools/rotate.png");
	Interface.toolRotate.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.toolRotate.position.set(0, 160);
	Interface.toolRotate.setAltText("Rotate (CTRL+4)");
	Interface.toolRotate.updateInterface();
	Interface.toolRotate.setCallback(function()
	{
		Interface.selectTool(Editor.ROTATE);
	});
 
	//Add Text
	var add = new Text(Interface.toolBar.element);
	add.setText("Add");
	add.size.set(40, 20);
	add.position.set(0, 210);
	add.updateInterface();

	//Add Models
	var addModel = new ButtonDrawer(Interface.toolBar.element);
	addModel.setImage(Editor.filePath + "icons/models/models.png");
	addModel.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addModel.position.set(0, 230);
	addModel.optionsSize.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addModel.updateInterface();

	//Cube
	addModel.addOption(Editor.filePath + "icons/models/cube.png", function()
	{
		var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cube";
		Editor.addToScene(model);
	}, "Cube");

	//Cylinder
	addModel.addOption(Editor.filePath + "icons/models/cylinder.png", function()
	{
		var geometry = new THREE.CylinderBufferGeometry(1, 1, 2, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cylinder";
		Editor.addToScene(model);
	}, "Cylinder");

	//Sphere
	addModel.addOption(Editor.filePath + "icons/models/sphere.png", function()
	{
		var geometry = new THREE.SphereBufferGeometry(1, 32, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "sphere";
		Editor.addToScene(model);
	}, "Sphere");

	//Torus
	addModel.addOption(Editor.filePath + "icons/models/torus.png", function()
	{
		var geometry = new THREE.TorusBufferGeometry(1, 0.5, 16, 96);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "torus";
		Editor.addToScene(model);
	}, "Torus");

	//Cone
	addModel.addOption(Editor.filePath + "icons/models/cone.png", function()
	{
		var geometry = new THREE.ConeBufferGeometry(1, 2, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cone";
		Editor.addToScene(model);
	}, "Cone");

	//Text
	addModel.addOption(Editor.filePath + "icons/models/text.png", function()
	{
		var model = new Text3D("text", Editor.defaultMaterial, Editor.defaultFont);
		Editor.addToScene(model);
	}, "3D Text");

	//Tetrahedron
	addModel.addOption(Editor.filePath + "icons/models/pyramid.png", function()
	{
		var geometry = new THREE.TetrahedronGeometry(1, 0);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "tetrahedron";
		Editor.addToScene(model);
	}, "Tetrahedron");

	//Plane
	addModel.addOption(Editor.filePath + "icons/models/plane.png", function()
	{
		var geometry = new THREE.PlaneBufferGeometry(1, 1);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "plane";
		Editor.addToScene(model);
	}, "Plane");

	//Circle
	addModel.addOption(Editor.filePath + "icons/models/circle.png", function()
	{
		var geometry = new THREE.CircleBufferGeometry(1, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "circle";
		Editor.addToScene(model);
	}, "Cicle");

	//Add lights
	var addLight = new ButtonDrawer(Interface.toolBar.element);
	addLight.setImage(Editor.filePath + "icons/lights/point.png");
	addLight.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addLight.position.set(0, 270);
	addLight.optionsSize.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addLight.updateInterface();

	//Point Light
	addLight.addOption(Editor.filePath + "icons/lights/point.png", function()
	{
		Editor.addToScene(new PointLight(0x444444));
	}, "Point Light");

	//Ambient Light
	addLight.addOption(Editor.filePath + "icons/lights/ambient.png", function()
	{
		Editor.addToScene(new AmbientLight(0x444444));
	}, "Ambient Light");

	//Spot Light
	addLight.addOption(Editor.filePath + "icons/lights/spot.png", function()
	{
		Editor.addToScene(new SpotLight(0x444444));
	}, "Spot Light");

	//Directional Light
	addLight.addOption(Editor.filePath + "icons/lights/directional.png", function()
	{
		Editor.addToScene(new DirectionalLight(0x444444));
	}, "Directional Light");

	//Hemisphere Light
	addLight.addOption(Editor.filePath + "icons/lights/hemisphere.png", function()
	{
		Editor.addToScene(new HemisphereLight(0x444444));
	}, "Hemisphere Light");

	//RectArea Light
	addLight.addOption(Editor.filePath + "icons/lights/rectarea.png", function()
	{
		Editor.addToScene(new RectAreaLight(0x444444, 100, 1, 1));
	}, "RectArea Light");

	//Sky
	addLight.addOption(Editor.filePath + "icons/lights/sky.png", function()
	{
		Editor.addToScene(new Sky());
	}, "Sky");

	//Add camera
	var addCamera = new ButtonDrawer(Interface.toolBar.element);
	addCamera.setImage(Editor.filePath + "icons/camera/camera.png");
	addCamera.optionsPerLine = 2;
	addCamera.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addCamera.position.set(0, 310);
	addCamera.optionsSize.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addCamera.updateInterface();

	//Perspective camera
	addCamera.addOption(Editor.filePath + "icons/camera/prespective.png", function()
	{
		Editor.addToScene(new PerspectiveCamera(60, 1));
	}, "Perspective Camera");

	//Orthographic camera
	addCamera.addOption(Editor.filePath + "icons/camera/orthographic.png", function()
	{
		Editor.addToScene(new OrthographicCamera(3, 2, OrthographicCamera.RESIZE_HORIZONTAL));
	}, "Orthographic Camera");

	//Add script
	var addScript = new ButtonDrawer(Interface.toolBar.element);
	addScript.setImage(Editor.filePath + "icons/script/script.png");
	addScript.optionsPerLine = 1;
	addScript.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addScript.position.set(0, 350);
	addScript.optionsSize.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addScript.updateInterface();

	//Javascript script
	addScript.addOption(Editor.filePath + "icons/script/script.png", function()
	{
		Editor.addToScene(new Script());
	}, "JS Script");

	//Effects
	var addEffects = new ButtonDrawer(Interface.toolBar.element);
	addEffects.setImage(Editor.filePath + "icons/misc/particles.png");
	addEffects.optionsPerLine = 3;
	addEffects.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addEffects.position.set(0, 390);
	addEffects.optionsSize.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addEffects.updateInterface();

	//Sprite
	addEffects.addOption(Editor.filePath + "icons/misc/sprite.png", function()
	{
		Editor.addToScene(new Sprite(Editor.defaultSpriteMaterial));
	}, "Sprite");

	//Particle emitter
	addEffects.addOption(Editor.filePath + "icons/misc/particles.png", function()
	{
		var particle = new ParticleEmitter()
		particle.texture = Editor.defaultTextureParticle;
		Editor.addToScene(particle);
	}, "Particle Emitter");

	//Container
	addEffects.addOption(Editor.filePath + "icons/misc/container.png", function()
	{
		Editor.addToScene(new Container());
	}, "Container");

	//Cube Camera
	addEffects.addOption(Editor.filePath + "icons/misc/probe.png", function()
	{
		Editor.addToScene(new CubeCamera());
	}, "Cube Camera")

	//Audio
	addEffects.addOption(Editor.filePath + "icons/misc/audio.png", function()
	{
		Editor.addToScene(new AudioEmitter(Editor.defaultAudio));
	}, "Audio");

	//Positional Audio
	addEffects.addOption(Editor.filePath + "icons/misc/audio_positional.png", function()
	{
		Editor.addToScene(new PositionalAudio(Editor.defaultAudio));
	}, "Positional Audio");

	//Lens flare
	addEffects.addOption(Editor.filePath + "icons/misc/flare.png", function()
	{
		var lensFlare = new LensFlare(Editor.defaultTextureLensFlare[0], 700, 0.0, THREE.AdditiveBlending, new THREE.Color(0xFFFFFF));

		lensFlare.addFlare(Editor.defaultTextureLensFlare[2], 512, 0.0, THREE.AdditiveBlending);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[2], 512, 0.0, THREE.AdditiveBlending);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[2], 512, 0.0, THREE.AdditiveBlending);

		lensFlare.addFlare(Editor.defaultTextureLensFlare[3], 60, 0.6, THREE.AdditiveBlending);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[3], 70, 0.7, THREE.AdditiveBlending);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[3], 120, 0.9, THREE.AdditiveBlending);
		lensFlare.addFlare(Editor.defaultTextureLensFlare[3], 70, 1.0, THREE.AdditiveBlending);

		Editor.addToScene(lensFlare);
	}, "Lens flare");

	//Physics
	var addPhysics = new ButtonDrawer(Interface.toolBar.element);
	addPhysics.setImage(Editor.filePath + "icons/misc/physics.png");
	addPhysics.optionsPerLine = 3;
	addPhysics.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addPhysics.position.set(0, 430);
	addPhysics.optionsSize.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addPhysics.updateInterface();

	//Physics box
	addPhysics.addOption(Editor.filePath + "icons/models/cube.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
		obj.name = "box";
		Editor.addToScene(obj);
	}, "Box");

	//Physics sphere
	addPhysics.addOption(Editor.filePath + "icons/models/sphere.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Sphere(1.0));
		obj.name = "sphere";
		Editor.addToScene(obj);
	}, "Sphere");

	//Physics Cylinder
	addPhysics.addOption(Editor.filePath + "icons/models/cylinder.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Cylinder(1.0, 1.0, 2.0, 8));
		obj.name = "cylinder";
		Editor.addToScene(obj);
	}, "Cylinder");

	//Physics Plane
	addPhysics.addOption(Editor.filePath + "icons/models/plane.png", function()
	{
		var obj = new PhysicsObject();
		obj.rotation.x = -Math.PI / 2;
		obj.body.addShape(new CANNON.Plane());
		obj.body.type = CANNON.Body.KINEMATIC;
		obj.name = "ground";
		Editor.addToScene(obj);
	}, "Ground");

	//Physics Particle
	addPhysics.addOption(Editor.filePath + "icons/models/point.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Particle());
		obj.name = "particle";
		Editor.addToScene(obj);
	}, "Particle");

	//Add device
	var addControls = new ButtonDrawer(Interface.toolBar.element);
	addControls.setImage(Editor.filePath + "icons/misc/controller.png");
	addControls.optionsPerLine = 3;
	addControls.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addControls.position.set(0, 470);
	addControls.optionsSize.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	addControls.updateInterface();

	//Orbit controls
	addControls.addOption(Editor.filePath + "icons/misc/orbit.png", function()
	{
		Editor.addToScene(new OrbitControls());
	}, "Orbit Controls");

	//FPS controls
	addControls.addOption(Editor.filePath + "icons/misc/crosshair.png", function()
	{
		Editor.addToScene(new FirstPersonControls());
	}, "First Person Controls");

	//Leap Hand
	addControls.addOption(Editor.filePath + "icons/hw/leap.png", function()
	{
		Editor.addToScene(new LeapMotion());
	}, "Leap Motion");

	//Kinect Skeleton
	addControls.addOption(Editor.filePath + "icons/hw/kinect.png", function()
	{
		Editor.addToScene(new KinectDevice());
	}, "Microsoft Kinect");

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


		alert("Reduced from " + vertices + " to " + Math.ceil(vertices * level) + " vertex.");

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
	Interface.about = new Button(Interface.topBar.element);
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
	Interface.run = new Button(Interface.topBar.element);
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
	Interface.bottomDiv.resizeSizeMax = size.y * 0.7;
	Interface.bottomDiv.updateInterface();

	//Bottom tab group
	Interface.bottomTab.size.x = Interface.bottomDiv.size.x;
	Interface.bottomTab.size.y = Interface.bottomDiv.size.y - 5;
	Interface.bottomTab.updateInterface();
	
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
