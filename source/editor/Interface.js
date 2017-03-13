"use strict";

function Interface(){}

//Initialize interface
Interface.initialize = function()
{
	//File directory
	Interface.fileDir = "editor/files/";

	//Tab Container
	Interface.tab = new TabGroup();

	//Asset Manager
	Interface.assetExplorerDiv = new DivisionResizable();
	Interface.assetExplorerDiv.resizableSide = DivisionResizable.TOP;
	Interface.assetExplorerDiv.size.y = 150;
	Interface.assetExplorerDiv.resizeSizeMin = 100;
	Interface.assetExplorerDiv.resizeSizeMax = 400;

	//Asset explorer
	Interface.assetExplorer = new AssetExplorer(Interface.assetExplorerDiv.element);
	Interface.assetExplorer.filesSize.set(Settings.general.filePreviewSize, Settings.general.filePreviewSize);
	
	//Asset explorer menu bar
	Interface.assetExplorerBar = new Bar(Interface.assetExplorerDiv.element);
	Interface.assetExplorerBar.position.set(0, 0);
	Interface.assetExplorerBar.size.y = 20;

	//Import Files
	Interface.assetFile = new DropdownMenu(Interface.assetExplorerBar.element);
	Interface.assetFile.setText("Import");
	Interface.assetFile.size.set(100, Interface.assetExplorerBar.size.y);
	Interface.assetFile.position.set(0,0);

	//3D Models Loader
	Interface.assetFile.addOption("3D Models", function()
	{
		FileSystem.chooseFile(function(files)
		{	
			if(files.length > 0)
			{
				Editor.loadGeometry(files[0]);
			}
		}, ".obj, .dae, .gltf, .awd, .ply, .vtk, .vtp, .wrl, .vrml, .fbx, .pcd, .json, .3ds");
	}, Interface.fileDir + "icons/models/models.png");

	//Textures menu
	var importTexture = Interface.assetFile.addMenu("Texture", Interface.fileDir + "icons/misc/image.png");

	//Image texture
	importTexture.addOption("Texture", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				Editor.loadTexture(files[0]);
			}
		}, "image/*");
	}, Interface.fileDir + "icons/misc/image.png");

	//Cube texture
	importTexture.addOption("Cube Texture", function()
	{
		var texture = new CubeTexture([Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage]);
		texture.name = "cube";
		Editor.program.addTexture(texture);

		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/misc/cube.png");

	//Canvas texture
	importTexture.addOption("Canvas Texture", function()
	{
		var texture = new CanvasTexture(512, 512);
		texture.name = "canvas";
		Editor.program.addTexture(texture);

		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/misc/canvas.png");

	//Video texture
	importTexture.addOption("Video Texture", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				Editor.loadVideoTexture(files[0]);
			}
		}, "video/*");
	}, Interface.fileDir + "icons/misc/video.png");

	//Webcam texture
	importTexture.addOption("Webcam Texture", function()
	{
		var texture = new WebcamTexture();
		texture.name = "webcam";
		Editor.program.addTexture(texture);

		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/hw/webcam.png");

	//Load Font
	Interface.assetFile.addOption("Font", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				Editor.loadFont(files[0]);
			}
		}, ".json, .ttf, .otf");
	}, Interface.fileDir + "icons/misc/font.png");

	//Spine Animation
	if(Nunu.runningOnDesktop())
	{
		Interface.assetFile.addOption("Spine Animation", function()
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					var file = files[0].path;

					var json = FileSystem.readFile(file);
					var atlas = FileSystem.readFile(file.replace("json", "atlas"));
					var path = file.substring(0, file.lastIndexOf("\\"));
					
					var animation = new SpineAnimation(json, atlas, path);
					animation.name = FileSystem.getFileName(file);

					Editor.addToScene(animation);
					Editor.updateObjectViews();
				}
			}, ".json");
		}, Interface.fileDir + "icons/misc/spine.png");
	}

	//Load audio file
	Interface.assetFile.addOption("Audio", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				Editor.loadAudio(files[0]);
			}
		}, "audio/*");
	}, Interface.fileDir + "icons/misc/audio.png");
	
	//Create material
	Interface.assetMaterial = new DropdownMenu(Interface.assetExplorerBar.element);
	Interface.assetMaterial.setText("Material");
	Interface.assetMaterial.size.set(100, Interface.assetExplorerBar.size.y);
	Interface.assetMaterial.position.set(100,0);

	Interface.assetMaterial.addOption("Standard material", function()
	{
		var material = new THREE.MeshStandardMaterial();
		material.name = "standard";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/misc/material.png");

	Interface.assetMaterial.addOption("Phong material", function()
	{
		var material = new THREE.MeshPhongMaterial();
		material.name = "phong";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/misc/material.png");
	
	Interface.assetMaterial.addOption("Basic material", function()
	{
		var material = new THREE.MeshBasicMaterial();
		material.name = "basic";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/misc/material.png");

	Interface.assetMaterial.addOption("Sprite material", function()
	{
		var material = new THREE.SpriteMaterial({color: 0xffffff});
		material.name = "sprite";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/misc/image.png");

	Interface.assetMaterial.addOption("Toon material", function()
	{
		var material = new THREE.MeshToonMaterial();
		material.name = "toon";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/misc/material.png");

	Interface.assetMaterial.addOption("Lambert material", function()
	{
		var material = new THREE.MeshLambertMaterial();
		material.name = "lambert";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/misc/material.png");
	
	var materialOthers = Interface.assetMaterial.addMenu("Others");
	materialOthers.addOption("Shader material", function()
	{
		var material = new THREE.ShaderMaterial();
		material.name = "shader";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/script/script.png");

	materialOthers.addOption("Normal material", function()
	{
		var material = new THREE.MeshNormalMaterial();
		material.name = "normal";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/misc/material.png");
	
	materialOthers.addOption("Depth material", function()
	{
		var material = new THREE.MeshDepthMaterial();
		material.name = "depth";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/misc/material.png");

	//Explorer
	Interface.explorer = new DivisionResizable();
	Interface.explorer.size.x = 300;
	Interface.explorer.resizeSizeMin = 100;
	Interface.explorer.setOnResize(function()
	{
		Interface.updateInterface();
		if(Interface.panel !== null)
		{
			Interface.panel.updateInterface();
		}
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

	//Object panel variables
	Interface.panel = new Panel(Interface.explorerResizable.divB);

	//Tool Bar
	Interface.toolBar = new Bar();
	Interface.toolBar.size.x = 40;

	//Tools text
	Interface.toolText = new Text(Interface.toolBar.element);
	Interface.toolText.setText("Tools");
	Interface.toolText.position.set(Interface.toolBar.size.x/2, 40);
	Interface.toolText.updateInterface();

	//Select
	Interface.toolSelect = new ButtonImageToggle();
	Interface.toolSelect.selected = true;
	Interface.toolSelect.setImage(Interface.fileDir + "icons/tools/select.png");
	Interface.toolSelect.imageScale.set(0.7, 0.7);
	Interface.toolSelect.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.toolSelect.position.set(0, 80);
	Interface.toolSelect.updateInterface();
	Interface.toolSelect.setCallback(function()
	{
		Interface.selectTool(Editor.SELECT);
	});

	//Move
	Interface.toolMove = new ButtonImageToggle();
	Interface.toolMove.setImage(Interface.fileDir + "icons/tools/move.png");
	Interface.toolMove.imageScale.set(0.7, 0.7);
	Interface.toolMove.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.toolMove.position.set(0, 120);
	Interface.toolMove.updateInterface();
	Interface.toolMove.setCallback(function()
	{
		Interface.selectTool(Editor.MOVE);
	});

	//Resize
	Interface.toolScale = new ButtonImageToggle();
	Interface.toolScale.setImage(Interface.fileDir + "icons/tools/resize.png");
	Interface.toolScale.imageScale.set(0.7, 0.7);
	Interface.toolScale.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.toolScale.position.set(0, 160);
	Interface.toolScale.updateInterface();
	Interface.toolScale.setCallback(function()
	{
		Interface.selectTool(Editor.SCALE);
	});

	//Rotate
	Interface.toolRotate = new ButtonImageToggle();
	Interface.toolRotate.setImage(Interface.fileDir + "icons/tools/rotate.png");
	Interface.toolRotate.imageScale.set(0.7, 0.7);
	Interface.toolRotate.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.toolRotate.position.set(0, 200);
	Interface.toolRotate.updateInterface();
	Interface.toolRotate.setCallback(function()
	{
		Interface.selectTool(Editor.ROTATE);
	});
 
	//Add Text
	Interface.addText = new Text(Interface.toolBar.element);
	Interface.addText.setText("Add");
	Interface.addText.position.set(Interface.toolBar.size.x/2, 240);
	Interface.addText.updateInterface();

	//Add Models
	Interface.addModel = new ButtonDrawer();
	Interface.addModel.setImage(Interface.fileDir + "icons/models/models.png");
	Interface.addModel.imageScale.set(0.7, 0.7);
	Interface.addModel.optionsScale.set(0.7, 0.7);
	Interface.addModel.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addModel.position.set(0, 280);
	Interface.addModel.optionsSize.set(40, 40);
	Interface.addModel.updateInterface();

	//Cube
	Interface.addModel.addOption(Interface.fileDir + "icons/models/cube.png", function()
	{
		var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cube";
		Editor.addToScene(model);
	}, "Cube");

	//Cylinder
	Interface.addModel.addOption(Interface.fileDir + "icons/models/cylinder.png", function()
	{
		var geometry = new THREE.CylinderBufferGeometry(1, 1, 2, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cylinder";
		Editor.addToScene(model);
	}, "Cylinder");

	//Sphere
	Interface.addModel.addOption(Interface.fileDir + "icons/models/sphere.png", function()
	{
		var geometry = new THREE.SphereBufferGeometry(1, 32, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "sphere";
		Editor.addToScene(model);
	}, "Sphere");

	//Torus
	Interface.addModel.addOption(Interface.fileDir + "icons/models/torus.png", function()
	{
		var geometry = new THREE.TorusBufferGeometry(1, 0.5, 16, 96);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "torus";
		Editor.addToScene(model);
	}, "Torus");

	//Cone
	Interface.addModel.addOption(Interface.fileDir + "icons/models/cone.png", function()
	{
		var geometry = new THREE.ConeBufferGeometry(1, 2, 32);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "cone";
		Editor.addToScene(model);
	}, "Cone");

	//Text
	Interface.addModel.addOption(Interface.fileDir + "icons/models/text.png", function()
	{
		var model = new Text3D("text", Editor.defaultMaterial, Editor.defaultFont);
		Editor.addToScene(model);
	}, "3D Text");

	//Plane
	Interface.addModel.addOption(Interface.fileDir + "icons/models/plane.png", function()
	{
		var geometry = new THREE.PlaneBufferGeometry(1,1);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "plane";
		Editor.addToScene(model);
	}, "Plane");

	//Tetrahedron
	Interface.addModel.addOption(Interface.fileDir + "icons/models/pyramid.png", function()
	{
		var geometry = new THREE.TetrahedronGeometry(1, 0);
		var model = new Mesh(geometry, Editor.defaultMaterial);
		model.name = "tetrahedron";
		Editor.addToScene(model);
	}, "Tetrahedron");

	//Add lights
	Interface.addLight = new ButtonDrawer();
	Interface.addLight.setImage(Interface.fileDir + "icons/lights/point.png");
	Interface.addLight.imageScale.set(0.7, 0.7);
	Interface.addLight.optionsScale.set(0.7, 0.7);
	Interface.addLight.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addLight.position.set(0, 320);
	Interface.addLight.optionsSize.set(40, 40);
	Interface.addLight.updateInterface();

	//Point Light
	Interface.addLight.addOption(Interface.fileDir + "icons/lights/point.png", function()
	{
		Editor.addToScene(new PointLight(0x444444));
	}, "Point Light");

	//Ambient Light
	Interface.addLight.addOption(Interface.fileDir + "icons/lights/ambient.png", function()
	{
		Editor.addToScene(new AmbientLight(0x444444));
	}, "Ambient Light");

	//Spot Light
	Interface.addLight.addOption(Interface.fileDir + "icons/lights/spot.png", function()
	{
		Editor.addToScene(new SpotLight(0x444444));
	}, "Spot Light");

	//Directional Light
	Interface.addLight.addOption(Interface.fileDir + "icons/lights/directional.png", function()
	{
		Editor.addToScene(new DirectionalLight(0x444444));
	}, "Directional Light");

	//Hemisphere Light
	Interface.addLight.addOption(Interface.fileDir + "icons/lights/hemisphere.png", function()
	{
		Editor.addToScene(new HemisphereLight(0x444444));
	}, "Hemisphere Light");

	//RectArea Light
	Interface.addLight.addOption(Interface.fileDir + "icons/lights/rectarea.png", function()
	{
		Editor.addToScene(new RectAreaLight(0x444444, 100, 1, 1));
	}, "RectArea Light");

	//Sky
	Interface.addLight.addOption(Interface.fileDir + "icons/lights/sky.png", function()
	{
		Editor.addToScene(new Sky());
	}, "Sky");

	//Add camera
	Interface.addCamera = new ButtonDrawer();
	Interface.addCamera.setImage(Interface.fileDir + "icons/camera/camera.png");
	Interface.addCamera.optionsPerLine = 2;
	Interface.addCamera.imageScale.set(0.7, 0.7);
	Interface.addCamera.optionsScale.set(0.7, 0.7);
	Interface.addCamera.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addCamera.position.set(0, 360);
	Interface.addCamera.optionsSize.set(40, 40);
	Interface.addCamera.updateInterface();

	//Prespective camera
	Interface.addCamera.addOption(Interface.fileDir + "icons/camera/prespective.png", function()
	{
		Editor.addToScene(new PerspectiveCamera(60, 1));
	}, "Prespective Camera");

	//Orthographic camera
	Interface.addCamera.addOption(Interface.fileDir + "icons/camera/orthographic.png", function()
	{
		Editor.addToScene(new OrthographicCamera(3, 2, OrthographicCamera.RESIZE_HORIZONTAL));
	}, "Othographic Camera");

	//Add script
	Interface.addScript = new ButtonDrawer();
	Interface.addScript.setImage(Interface.fileDir + "icons/script/script.png");
	Interface.addScript.optionsPerLine = 1;
	Interface.addScript.imageScale.set(0.7, 0.7);
	Interface.addScript.optionsScale.set(0.7, 0.7);
	Interface.addScript.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addScript.position.set(0, 400);
	Interface.addScript.optionsSize.set(40, 40);
	Interface.addScript.updateInterface();

	//Javascript script
	Interface.addScript.addOption(Interface.fileDir + "icons/script/script.png", function()
	{
		Editor.addToScene(new Script());
	}, "JS Script");

	//Sprites and effects
	Interface.addEffects = new ButtonDrawer();
	Interface.addEffects.setImage(Interface.fileDir + "icons/effects/particles.png");
	Interface.addEffects.optionsPerLine = 3;
	Interface.addEffects.imageScale.set(0.7, 0.7);
	Interface.addEffects.optionsScale.set(0.7, 0.7);
	Interface.addEffects.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addEffects.position.set(0, 440);
	Interface.addEffects.optionsSize.set(40, 40);
	Interface.addEffects.updateInterface();

	//Sprite
	Interface.addEffects.addOption(Interface.fileDir + "icons/effects/sprite.png", function()
	{
		Editor.addToScene(new Sprite(Editor.defaultSpriteMaterial));
	}, "Sprite");

	//Particle emitter
	Interface.addEffects.addOption(Interface.fileDir + "icons/effects/particles.png", function()
	{
		var particle = new ParticleEmitter()
		particle.texture = Editor.defaultTextureParticle;
		Editor.addToScene(particle);
	}, "Particle Emitter");

	//Container
	Interface.addEffects.addOption(Interface.fileDir + "icons/effects/container.png", function()
	{
		Editor.addToScene(new Container());
	}, "Container");

	//Audio
	Interface.addEffects.addOption(Interface.fileDir + "icons/misc/audio.png", function()
	{
		Editor.addToScene(new AudioEmitter(Editor.defaultAudio));
	}, "Audio");

	//Positional Audio
	Interface.addEffects.addOption(Interface.fileDir + "icons/misc/audio_positional.png", function()
	{
		Editor.addToScene(new PositionalAudio(Editor.defaultAudio));
	}, "Positional Audio");

	//Physics
	Interface.addPhysics = new ButtonDrawer();
	Interface.addPhysics.setImage(Interface.fileDir + "icons/misc/physics.png");
	Interface.addPhysics.optionsPerLine = 3;
	Interface.addPhysics.imageScale.set(0.7, 0.7);
	Interface.addPhysics.optionsScale.set(0.7, 0.7);
	Interface.addPhysics.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addPhysics.position.set(0, 480);
	Interface.addPhysics.optionsSize.set(40, 40);
	Interface.addPhysics.updateInterface();

	//Physics box
	Interface.addPhysics.addOption(Interface.fileDir + "icons/models/cube.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
		obj.name = "box";
		Editor.addToScene(obj);
	}, "Box");

	//Physics sphere
	Interface.addPhysics.addOption(Interface.fileDir + "icons/models/sphere.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Sphere(1.0));
		obj.name = "sphere";
		Editor.addToScene(obj);
	}, "Sphere");

	//Physics Cylinder
	Interface.addPhysics.addOption(Interface.fileDir + "icons/models/cylinder.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Cylinder(1.0, 1.0, 2.0, 8));
		obj.name = "cylinder";
		Editor.addToScene(obj);
	}, "Cylinder");

	//Physics Plane
	Interface.addPhysics.addOption(Interface.fileDir + "icons/models/plane.png", function()
	{
		var obj = new PhysicsObject();
		obj.rotation.x = -1.57;
		obj.body.addShape(new CANNON.Plane());
		obj.body.type = CANNON.Body.KINEMATIC;
		obj.name = "ground";
		Editor.addToScene(obj);
	}, "Ground");

	//Physics Particle
	Interface.addPhysics.addOption(Interface.fileDir + "icons/models/point.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Particle());
		obj.name = "particle";
		Editor.addToScene(obj);
	}, "Particle");

	//Add device
	Interface.addDevice = new ButtonDrawer();
	Interface.addDevice.setImage(Interface.fileDir + "icons/hw/hw.png");
	Interface.addDevice.optionsPerLine = 2;
	Interface.addDevice.imageScale.set(0.7, 0.7);
	Interface.addDevice.optionsScale.set(0.7, 0.7);
	Interface.addDevice.size.set(Interface.toolBar.size.x, Interface.toolBar.size.x);
	Interface.addDevice.position.set(0, 520);
	Interface.addDevice.optionsSize.set(40, 40);
	Interface.addDevice.updateInterface();

	//Leap Hand
	Interface.addDevice.addOption(Interface.fileDir + "icons/hw/leap.png", function()
	{
		Editor.addToScene(new LeapMotion());
	}, "Leap Motion");

	//Kinect Skeleton
	Interface.addDevice.addOption(Interface.fileDir + "icons/hw/kinect.png", function()
	{
		Editor.addToScene(new KinectDevice());
	}, "Microsoft Kinect");

	//Menu Top Bar
	Interface.topBar = new Bar();
	Interface.topBar.size.y = 25 ;

	//Editor Logo
	Interface.image = new ImageBox();
	Interface.image.setImage("editor/files/logo.png");
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
	}, Interface.fileDir + "icons/misc/new.png");

	//Save project
	Interface.file.addOption("Save", function()
	{
		if(Editor.openFile !== null)
		{
			Editor.saveProgram(undefined, false);
		}
		else
		{
			Interface.saveProgram();
		}
	}, Interface.fileDir + "icons/misc/save.png");

	//Save project
	if(Nunu.runningOnDesktop())
	{
		Interface.file.addOption("Save As", function()
		{
			Interface.saveProgram();
		}, Interface.fileDir + "icons/misc/save.png");
	}

	//Load Project
	Interface.file.addOption("Load", function()
	{
		Interface.loadProgram();
	});

	//Console
	/*Interface.file.addOption("Console", function()
	{
		var tab = Interface.tab.getTab(ConsoleTab);
		if(tab === null)
		{
			tab = Interface.tab.addTab(ConsoleTab, true);
		}
		tab.select();
	}, Interface.fileDir + "icons/misc/console.png");*/

	//Settings
	Interface.file.addOption("Settings", function()
	{
		var tab = Interface.tab.getTab(SettingsTab);
		if(tab === null)
		{
			tab = Interface.tab.addTab(SettingsTab, true);
		}
		tab.select();
	}, Interface.fileDir + "icons/misc/settings.png");

	//Publish
	if(Nunu.runningOnDesktop())
	{
		var publish = Interface.file.addMenu("Publish");

		//Publish web
		publish.addOption("Web", function()
		{
			FileSystem.chooseFile(function(files)
			{
				try
				{
					Editor.exportWebProject(files[0].path);
					alert("Project exported");
				}
				catch(e)
				{
					alert("Error exporting project (" + e + ")");
				}
			}, "", Editor.program.name);
		}, Interface.fileDir + "icons/platform/web.png");

		//Publish windows
		if(FileSystem.fileExists("../nwjs/win"))
		{
			publish.addOption("Windows", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Editor.exportWindowsProject(files[0].path);
						alert("Project exported");
					}
					catch(e)
					{
						alert("Error exporting project (" + e + ")");
					}
				}, "", Editor.program.name);
			}, Interface.fileDir + "icons/platform/windows.png");
		}

		//Publish linux
		if(FileSystem.fileExists("../nwjs/linux"))
		{
			publish.addOption("Linux", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Editor.exportLinuxProject(files[0].path);
						alert("Project exported");
					}
					catch(e)
					{
						alert("Error exporting project (" + e + ")");
					}
				}, "", Editor.program.name);
			}, Interface.fileDir + "icons/platform/linux.png");
		}

		//Publish macos
		if(FileSystem.fileExists("../nwjs/mac"))
		{
			publish.addOption("macOS", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Editor.exportMacOSProject(files[0].path);
						alert("Project exported");
					}
					catch(e)
					{
						alert("Error exporting project (" + e + ")");
					}
				}, "", Editor.program.name);
			}, Interface.fileDir + "icons/platform/osx.png");
		}
	}

	//Export menu
	var exportMenu = Interface.file.addMenu("Export");

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
	}, Interface.fileDir + "icons/misc/scene.png");

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
	}, Interface.fileDir + "icons/misc/scene.png");


	//Exit
	if(Nunu.runningOnDesktop())
	{
		Interface.file.addOption("Exit", function()
		{
			if(confirm("All unsaved changes to the project will be lost! Do you really wanna exit?"))
			{
				Editor.exit();
			}
		}, Interface.fileDir + "icons/misc/exit.png");
	}

	//Editor
	Interface.editor = new DropdownMenu();
	Interface.editor.setText("Edit");
	Interface.editor.size.set(100, Interface.topBar.size.y);
	Interface.editor.position.set(120,0);

	Interface.editor.addOption("Undo", function()
	{
		Editor.undo();
	}, Interface.fileDir + "icons/misc/undo.png");

	Interface.editor.addOption("Copy", function()
	{
		Editor.copyObject();
	}, Interface.fileDir + "icons/misc/copy.png");
	
	Interface.editor.addOption("Cut", function()
	{
		Editor.cutObject();
	}, Interface.fileDir + "icons/misc/cut.png");

	Interface.editor.addOption("Paste", function()
	{
		Editor.pasteObject();
	}, Interface.fileDir + "icons/misc/paste.png");

	Interface.editor.addOption("Delete", function()
	{
		Editor.deleteObject();
	}, Interface.fileDir + "icons/misc/delete.png");

	//Project
	Interface.project = new DropdownMenu();
	Interface.project.setText("Project");
	Interface.project.size.set(100, Interface.topBar.size.y);
	Interface.project.position.set(220,0);

	Interface.project.addOption("Create Scene", function()
	{
		Editor.program.addDefaultScene();
		Editor.updateObjectViews();
	}, Interface.fileDir + "icons/misc/add.png");

	Interface.project.addOption("Execute script", function()
	{
		FileSystem.chooseFile(function(files)
		{
			try
			{
				if(files.length > 0)
				{
					var code = FileSystem.readFile(files[0]);
					var func = Function(code);
					func();
				}
			}
			catch(error)
			{
				alert("Error: " + error);
			}
		}, ".js");
	}, Interface.fileDir + "icons/script/script.png");

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
	
	//Asset Explorer
	Interface.assetExplorerDiv.size.x = size.x - Interface.explorer.size.x - Interface.toolBar.size.x;
	Interface.assetExplorerDiv.position.set(Interface.toolBar.size.x, size.y - Interface.assetExplorerDiv.size.y);
	Interface.assetExplorerDiv.resizeSizeMax = size.y * 0.6;
	Interface.assetExplorerDiv.updateInterface();

	Interface.assetExplorerBar.size.x = Interface.assetExplorerDiv.size.x;
	Interface.assetExplorerBar.updateInterface();

	Interface.assetExplorer.size.x = Interface.assetExplorerDiv.size.x;
	Interface.assetExplorer.position.y = Interface.assetExplorerBar.size.y;
	Interface.assetExplorer.size.y = Interface.assetExplorerDiv.size.y - Interface.assetExplorer.position.y;
	Interface.assetExplorer.updateInterface();

	//Tab Container
	Interface.tab.position.set(Interface.toolBar.size.x, Interface.topBar.size.y);
	Interface.tab.size.x = (size.x - Interface.toolBar.size.x - Interface.explorer.size.x);
	Interface.tab.size.y = (size.y - Interface.topBar.size.y - Interface.assetExplorerDiv.size.y); 
	Interface.tab.updateInterface();
};

//Open to save program window
Interface.saveProgram = function()
{
	if(Nunu.runningOnDesktop())
	{
		FileSystem.chooseFile(function(files)
		{
			Editor.saveProgram(files[0].path);
		}, ".isp", true);
	}
	else
	{
		FileSystem.chooseFileName(function(fname)
		{
			Editor.saveProgram(fname);
		}, ".isp");
	}
};

//Open to load program window
Interface.loadProgram = function()
{
	if(confirm("All unsaved changes to the project will be lost! Load file?"))
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
	if(confirm("All unsaved changes to the project will be lost! Create new File?"))
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
