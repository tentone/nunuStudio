function Interface(){}

Interface.initialize = function()
{	
	//File directory
	Interface.file_dir = "editor/files/";

	//Style
	Interface.theme = new Style();
	Interface.theme.setStyleSheet(Interface.file_dir + "css/dark.css");

	//------------------------------------Tab Container-------------------------------
	Interface.tab = new TabGroup();
	
	Interface.empty_tab_text = new Text(Interface.tab.element);
	Interface.empty_tab_text.fit_parent = true;
	Interface.empty_tab_text.setText("Open new tab to edit content or create new project");
	Interface.empty_tab_text.updateInterface();

	//Scene Canvas
	var scene = Interface.tab.addOption("scene", Interface.file_dir + "icons/tab/scene.png", true);
	var canvas = new SceneEditor();
	canvas.setScene(Editor.program.scene);
	scene.attachComponent(canvas);

	//TODO <REMOVE THIS>
	var material_tab = Interface.tab.addOption("Material", Interface.file_dir + "icons/misc/material.png", false);
	var material_editor = new MaterialEditor();
	material_tab.attachComponent(material_editor);
	
	//Set render canvas
	Editor.setRenderCanvas(canvas.element);

	//---------------------------------Asset Manager----------------------------------
	Interface.asset_explorer_div = new DivisionResizable();
	Interface.asset_explorer_div.resizable_side = DivisionResizable.TOP;
	Interface.asset_explorer_div.size.y = 150;
	Interface.asset_explorer_div.resize_size_min = 100;
	Interface.asset_explorer_div.resize_size_max = 400;
	Interface.asset_explorer_div.updateInterface();

	//Asset explorer
	Interface.asset_explorer = new FileExplorer(Interface.asset_explorer_div.element);
	Interface.asset_explorer.updateInterface();
	
	//Asset explorer menu bar
	Interface.asset_explorer_bar = new Division(Interface.asset_explorer_div.element);
	Interface.asset_explorer_bar.position.set(0, 0);
	Interface.asset_explorer_bar.size.y = 20;
	Interface.asset_explorer_bar.element.className = "bar";
	Interface.asset_explorer_bar.updateInterface();

	//Import Files
	Interface.asset_file = new DropdownMenu(Interface.asset_explorer_bar.element);
	Interface.asset_file.setText("Import");
	Interface.asset_file.size.set(100, Interface.asset_explorer_bar.size.y);
	Interface.asset_file.position.set(0,0);
	
	var import_models = Interface.asset_file.addMenu("3D Models");
	import_models.addOption("Wavefront", function()
	{
		App.chooseFile(function(fname)
		{
			try
			{
				var loader = new THREE.OBJLoader();
				var obj = loader.parse(App.readFile(fname));

				ObjectUtils.setShadowCasting(obj, true);
				ObjectUtils.setShadowReceiving(obj, true);
				Editor.addToActualScene(ObjectUtils.convertFromThreeType(obj));
			}
			catch(e)
			{
				alert("Error loading file\n("+e+")");
			}
		}, ".obj");
	});

	import_models.addOption("Collada", function()
	{
		App.chooseFile(function(fname)
		{
			try
			{
				var loader = new THREE.ColladaLoader();
				var obj = loader.parse(App.readFile(fname));

				ObjectUtils.setShadowCasting(obj.scene, true);
				ObjectUtils.setShadowReceiving(obj.scene, true);
				Editor.addToActualScene(ObjectUtils.convertFromThreeType(obj.scene));
			}
			catch(e)
			{
				alert("Error loading file\n("+e+")");
			}
		}, ".dae");
	});

	import_models.addOption("ThreeJS JSON", function()
	{
		App.chooseFile(function(fname)
		{
			try
			{
				var loader = new THREE.JSONLoader();
				loader.load(fname, function(geometry, materials)
				{
					for(var i = 0; i < materials.length; i ++)
					{
						var m = materials[i];
						m.skinning = true;
						m.morphTargets = true;
					}

					var material = new THREE.MeshPhongMaterial();
					material.skinning = true;
					material.morphTargets = true;

					var obj = new AnimatedModel(geometry, material);//new THREE.MultiMaterial(materials));
					Editor.addToActualScene(obj);
				});
			}
			catch(e)
			{
				alert("Error loading file\n("+e+")");
			}
		}, ".json, .js");
	});

	import_models.addOption("VRML", function()
	{
		App.chooseFile(function(fname)
		{
			try
			{
				var loader = new THREE.VRMLLoader();
				var obj = loader.parse(App.readFile(fname));

				ObjectUtils.setShadowCasting(obj, true);
				ObjectUtils.setShadowReceiving(obj, true);
				Editor.addToActualScene(ObjectUtils.convertFromThreeType(obj));
			}
			catch(e)
			{
				alert("Error loading file\n("+e+")");
			}
		}, ".wrl, .vrml");
	});

	import_models.addOption("FBX", function()
	{
		App.chooseFile(function(fname)
		{
			try
			{
				var loader = new THREE.FBXLoader();
				var obj = loader.parse(App.readFile(fname));

				ObjectUtils.setShadowCasting(obj, true);
				ObjectUtils.setShadowReceiving(obj, true);
				Editor.addToActualScene(ObjectUtils.convertFromThreeType(obj));
			}
			catch(e)
			{
				alert("Error loading file\n("+e+")");
			}
		}, ".fbx");
	});

	//Load texture image
	Interface.asset_file.addOption("Texture", function()
	{
		App.chooseFile(function(fname)
		{
			try
			{
				var map = new Texture(fname);
				var material = new THREE.SpriteMaterial({map: map, color: 0xffffff});
				var sprite = new Sprite(material);
				Editor.addToActualScene(sprite);
			}
			catch(e)
			{
				alert("Error loading file\n("+e+")");
			}
		}, "image/*");
	});

	//Load Video texture
	Interface.asset_file.addOption("Video", function()
	{
		App.chooseFile(function(fname)
		{
			try
			{
				var map = new VideoTexture(fname);
				var material = new THREE.SpriteMaterial({map: map, color: 0xffffff});
				var sprite = new Sprite(material);
				Editor.addToActualScene(sprite);
			}
			catch(e)
			{
				alert("Error loading file\n("+e+")");
			}
		}, "video/*");
	});

	//Load audio file
	Interface.asset_file.addOption("Audio", function()
	{
		App.chooseFile(function(fname)
		{
			//TODO <ADD CODE HERE>
		}, "audio/*");
	});

	//Create new
	Interface.asset_create = new DropdownMenu(Interface.asset_explorer_bar.element);
	Interface.asset_create.setText("Create");
	Interface.asset_create.size.set(100, Interface.asset_explorer_bar.size.y);
	Interface.asset_create.position.set(100,0);

	Interface.asset_create.addOption("Script", function()
	{
		//TODO <ADD CODE HERE>
	});

	var asset_create_material = Interface.asset_create.addMenu("Material");
	asset_create_material.addOption("Phong material", function()
	{
		//TODO <ADD CODE HERE>
	});
	asset_create_material.addOption("Standard material", function()
	{
		//TODO <ADD CODE HERE>
	});
	asset_create_material.addOption("Sprite material", function()
	{
		//TODO <ADD CODE HERE>
	});
	asset_create_material.addOption("Shader material", function()
	{
		//TODO <ADD CODE HERE>
	});
	asset_create_material.addOption("Lambert material", function()
	{
		//TODO <ADD CODE HERE>
	});


	//------------------------------------Explorer------------------------------------
	Interface.explorer = new DivisionResizable();
	Interface.explorer.size.x = 300;
	Interface.explorer.resize_size_min = 100;

	Interface.explorer_resizable = new DualDivisionResizable(Interface.explorer.element);
	Interface.explorer_resizable.orientation = DualDivisionResizable.VERTICAL;
	Interface.explorer_resizable.tab_position = 0.6;

	//Project explorer
	Interface.tree_view = new TreeView(Interface.explorer_resizable.div_a, Interface.explorer_resizable);
	Interface.tree_view.updateInterface();

	//Object panel variables
	Interface.panel = new Panel(Interface.explorer_resizable.div_b);

	//------------------------------------Tool Bar------------------------------------
	Interface.tool_bar = new Division();
	Interface.tool_bar.size.x = 40;
	Interface.tool_bar.element.className = "bar";

	//Tools text
	Interface.tool_text = new Text(Interface.tool_bar.element);
	Interface.tool_text.setText("Tools");
	Interface.tool_text.position.set(Interface.tool_bar.size.x/2, 40);
	Interface.tool_text.updateInterface();

	//Select
	Interface.tool_select = new ButtonImageToggle();
	Interface.tool_select.selected = true;
	Interface.tool_select.setImage(Interface.file_dir + "icons/tools/select.png");
	Interface.tool_select.image_scale.set(0.7, 0.7);
	Interface.tool_select.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.tool_select.position.set(0, 80);
	Interface.tool_select.updateInterface();
	Interface.tool_select.setCallback(function()
	{
		Editor.tool_mode = Editor.MODE_SELECT;
		Interface.tool_select.selected = true;
		Interface.tool_move.selected = false;
		Interface.tool_resize.selected = false;
		Interface.tool_rotate.selected = false;
		Interface.tool_rotate.updateInterface();
		Interface.tool_move.updateInterface();
		Interface.tool_resize.updateInterface();
		Interface.tool_select.updateInterface();
	});

	//Move
	Interface.tool_move = new ButtonImageToggle();
	Interface.tool_move.setImage(Interface.file_dir + "icons/tools/move.png");
	Interface.tool_move.image_scale.set(0.7, 0.7);
	Interface.tool_move.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.tool_move.position.set(0, 120);
	Interface.tool_move.updateInterface();
	Interface.tool_move.setCallback(function()
	{
		Editor.tool_mode = Editor.MODE_MOVE;
		Interface.tool_move.selected = true;
		Interface.tool_select.selected = false;
		Interface.tool_resize.selected = false;
		Interface.tool_rotate.selected = false;
		Interface.tool_rotate.updateInterface();
		Interface.tool_move.updateInterface();
		Interface.tool_resize.updateInterface();
		Interface.tool_select.updateInterface();
	});

	//Resize
	Interface.tool_resize = new ButtonImageToggle();
	Interface.tool_resize.setImage(Interface.file_dir + "icons/tools/resize.png");
	Interface.tool_resize.image_scale.set(0.7, 0.7);
	Interface.tool_resize.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.tool_resize.position.set(0, 160);
	Interface.tool_resize.updateInterface();
	Interface.tool_resize.setCallback(function()
	{
		Editor.tool_mode = Editor.MODE_RESIZE;
		Interface.tool_resize.selected = true;
		Interface.tool_move.selected = false;
		Interface.tool_select.selected = false;
		Interface.tool_rotate.selected = false;
		Interface.tool_rotate.updateInterface();
		Interface.tool_move.updateInterface();
		Interface.tool_resize.updateInterface();
		Interface.tool_select.updateInterface();
	});

	//Rotate
	Interface.tool_rotate = new ButtonImageToggle();
	Interface.tool_rotate.setImage(Interface.file_dir + "icons/tools/rotate.png");
	Interface.tool_rotate.image_scale.set(0.7, 0.7);
	Interface.tool_rotate.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.tool_rotate.position.set(0, 200);
	Interface.tool_rotate.updateInterface();
	Interface.tool_rotate.setCallback(function()
	{
		Editor.tool_mode = Editor.MODE_ROTATE;
		Interface.tool_rotate.selected = true;
		Interface.tool_move.selected = false;
		Interface.tool_resize.selected = false;
		Interface.tool_select.selected = false;
		Interface.tool_rotate.updateInterface();
		Interface.tool_move.updateInterface();
		Interface.tool_resize.updateInterface();
		Interface.tool_select.updateInterface();
	});
 
	//Add Text
	Interface.add_text = new Text(Interface.tool_bar.element);
	Interface.add_text.setText("Add");
	Interface.add_text.position.set(Interface.tool_bar.size.x/2, 240);
	Interface.add_text.updateInterface();

	//Add Models
	Interface.add_model = new ButtonDrawer();
	Interface.add_model.setImage(Interface.file_dir + "icons/models/models.png");
	Interface.add_model.image_scale.set(0.7, 0.7);
	Interface.add_model.options_scale.set(0.7, 0.7);
	Interface.add_model.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.add_model.position.set(0, 280);
	Interface.add_model.options_size.set(40, 40);
	Interface.add_model.updateInterface();

	//Cube
	Interface.add_model.addOption(Interface.file_dir + "icons/models/cube.png", function()
	{
		var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
		var model = new Model3D(geometry, Editor.default_material);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "cube";
		Editor.addToActualScene(model);
	});

	//Cylinder
	Interface.add_model.addOption(Interface.file_dir + "icons/models/cylinder.png", function()
	{
		var geometry = new THREE.CylinderBufferGeometry(1, 1, 2, 32);
		var model = new Model3D(geometry, Editor.default_material);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "cylinder";
		Editor.addToActualScene(model);
	});

	//Sphere
	Interface.add_model.addOption(Interface.file_dir + "icons/models/sphere.png", function()
	{
		var geometry = new THREE.SphereBufferGeometry(1, 32, 32);
		var model = new Model3D(geometry, Editor.default_material);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "sphere";
		Editor.addToActualScene(model);
	});

	//Torus
	Interface.add_model.addOption(Interface.file_dir + "icons/models/torus.png", function()
	{
		var geometry = new THREE.TorusBufferGeometry(1, 0.5, 16, 96);
		var model = new Model3D(geometry, Editor.default_material);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "torus";
		Editor.addToActualScene(model);
	});

	//Pyramid
	Interface.add_model.addOption(Interface.file_dir + "icons/models/cone.png", function()
	{
		var geometry = new THREE.CylinderBufferGeometry(0, 1, 2, 32);
		var model = new Model3D(geometry, Editor.default_material);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "cone";
		Editor.addToActualScene(model);
	});

	//Text
	Interface.add_model.addOption(Interface.file_dir + "icons/models/text.png", function()
	{
		var model = new Text3D("text", Editor.default_material);
		model.receiveShadow = true;
		model.castShadow = true;
		Editor.addToActualScene(model);
	});

	//Plane
	Interface.add_model.addOption(Interface.file_dir + "icons/models/plane.png", function()
	{
		var geometry = new THREE.PlaneBufferGeometry(1,1);
		var model = new Model3D(geometry, Editor.default_material);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "plane";
		Editor.addToActualScene(model);
	});

	//Add lights
	Interface.add_light = new ButtonDrawer();
	Interface.add_light.setImage(Interface.file_dir + "icons/lights/point.png");
	Interface.add_light.image_scale.set(0.7, 0.7);
	Interface.add_light.options_scale.set(0.7, 0.7);
	Interface.add_light.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.add_light.position.set(0, 320);
	Interface.add_light.options_size.set(40, 40);
	Interface.add_light.updateInterface();

	//Point Light
	Interface.add_light.addOption(Interface.file_dir + "icons/lights/point.png", function()
	{
		Editor.addToActualScene(new PointLight(0x444444));
	});

	//Ambient Light
	Interface.add_light.addOption(Interface.file_dir + "icons/lights/ambient.png", function()
	{
		Editor.addToActualScene(new AmbientLight(0x444444));
	});

	//Spot Light
	Interface.add_light.addOption(Interface.file_dir + "icons/lights/spot.png", function()
	{
		Editor.addToActualScene(new SpotLight(0x444444));
	});

	//Directional Light
	Interface.add_light.addOption(Interface.file_dir + "icons/lights/directional.png", function()
	{
		Editor.addToActualScene(new DirectionalLight(0x444444));
	});

	//Hemisphere Light
	Interface.add_light.addOption(Interface.file_dir + "icons/lights/hemisphere.png", function()
	{
		Editor.addToActualScene(new HemisphereLight(0x444444));
	});

	//Sky
	Interface.add_light.addOption(Interface.file_dir + "icons/lights/sky.png", function()
	{
		Editor.addToActualScene(new Sky());
	});

	//Add camera
	Interface.add_camera = new ButtonDrawer();
	Interface.add_camera.setImage(Interface.file_dir + "icons/camera/camera.png");
	Interface.add_camera.options_per_line = 2;
	Interface.add_camera.image_scale.set(0.7, 0.7);
	Interface.add_camera.options_scale.set(0.7, 0.7);
	Interface.add_camera.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.add_camera.position.set(0, 360);
	Interface.add_camera.options_size.set(40, 40);
	Interface.add_camera.updateInterface();

	//Prespective camera
	Interface.add_camera.addOption(Interface.file_dir + "icons/camera/prespective.png", function()
	{
		Editor.addToActualScene(new PerspectiveCamera(60, Editor.canvas.width/Editor.canvas.height, 0.1, 1000000));
	});

	//Orthographic camera
	Interface.add_camera.addOption(Interface.file_dir + "icons/camera/orthographic.png", function()
	{
		Editor.addToActualScene(new OrthographicCamera(3, 2, 0, 1, 1000000));
	});

	//Add script
	Interface.add_script = new ButtonDrawer();
	Interface.add_script.setImage(Interface.file_dir + "icons/script/script.png");
	Interface.add_script.options_per_line = 2;
	Interface.add_script.image_scale.set(0.7, 0.7);
	Interface.add_script.options_scale.set(0.7, 0.7);
	Interface.add_script.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.add_script.position.set(0, 400);
	Interface.add_script.options_size.set(40, 40);
	Interface.add_script.updateInterface();

	//Javascript script
	Interface.add_script.addOption(Interface.file_dir + "icons/script/script.png", function()
	{
		Editor.addToActualScene(new Script());
	});

	//Block script
	Interface.add_script.addOption(Interface.file_dir + "icons/script/blocks.png", function()
	{
		//TODO <ADD CODE HERE>
	});

	//Sprites and effects
	Interface.add_effects = new ButtonDrawer();
	Interface.add_effects.setImage(Interface.file_dir + "icons/effects/particles.png");
	Interface.add_effects.options_per_line = 3;
	Interface.add_effects.image_scale.set(0.7, 0.7);
	Interface.add_effects.options_scale.set(0.7, 0.7);
	Interface.add_effects.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.add_effects.position.set(0, 440);
	Interface.add_effects.options_size.set(40, 40);
	Interface.add_effects.updateInterface();

	//Sprite
	Interface.add_effects.addOption(Interface.file_dir + "icons/effects/sprite.png", function()
	{
		var map = new Texture("data/sample.png");
		var material = new THREE.SpriteMaterial({map: map, color: 0xffffff});
		var sprite = new Sprite(material);
		Editor.addToActualScene(sprite);
	});

	//Particles
	Interface.add_effects.addOption(Interface.file_dir + "icons/effects/particles.png", function()
	{
		Editor.addToActualScene(new ParticleEmitter());
	});

	//Container
	Interface.add_effects.addOption(Interface.file_dir + "icons/effects/container.png", function()
	{
		Editor.addToActualScene(new Container());
	});

	//Audio
	Interface.add_effects.addOption(Interface.file_dir + "icons/assets/audio.png", function()
	{
		Editor.addToActualScene(new Audio());
	});

	//Add device
	Interface.add_device = new ButtonDrawer();
	Interface.add_device.setImage(Interface.file_dir + "icons/hw/hw.png");
	Interface.add_device.options_per_line = 2;
	Interface.add_device.image_scale.set(0.7, 0.7);
	Interface.add_device.options_scale.set(0.7, 0.7);
	Interface.add_device.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.add_device.position.set(0, 480);
	Interface.add_device.options_size.set(40, 40);
	Interface.add_device.updateInterface();

	//Leap Hand
	Interface.add_device.addOption(Interface.file_dir + "icons/hw/leap.png", function()
	{
		Editor.addToActualScene(new LeapHand());
	});

	//Kinect Skeleton
	Interface.add_device.addOption(Interface.file_dir + "icons/hw/kinect.png", function()
	{
		Editor.addToActualScene(new KinectDevice());
	});

	//----------------------------------Menu Top Bar----------------------------------
	Interface.top_bar = new Division();
	Interface.top_bar.size.y = 25 ;
	Interface.top_bar.element.className = "bar";

	//Editor Logo
	Interface.image = new Image();
	Interface.image.setImage("editor/files/logo.png");
	Interface.image.size.set(108, 18);
	Interface.image.updateInterface();

	//File
	Interface.file = new DropdownMenu();
	Interface.file.setText("File");
	Interface.file.size.set(120, Interface.top_bar.size.y);
	Interface.file.position.set(0,0);

	Interface.file.addOption("New Project", function()
	{
		Interface.newProgram();
	});

	Interface.file.addOption("Save Project", function()
	{
		Interface.saveProgram();
	}, Interface.file_dir + "icons/misc/save.png");

	Interface.file.addOption("Load Project", function()
	{
		Interface.loadProgram();
	});

	Interface.file.addOption("Settings", function()
	{
		//Check if there is already a settings tab
		var found = false;
		for(var i = 0; i < Interface.tab.options.length; i++)
		{
			if(Interface.tab.options[i].component instanceof SettingsTab)
			{
				found = true;
				Interface.tab.options[i].select();
				break;
			}
		}

		//If not create one
		if(!found)
		{
			var tab = Interface.tab.addOption("Settings", Interface.file_dir + "icons/tab/settings.png", true);
			var settings = new SettingsTab(tab.element);
			tab.attachComponent(settings);
			tab.select();
		}
	}, Interface.file_dir + "icons/tab/settings.png");

	var publish = Interface.file.addMenu("Publish");
	publish.addOption("Web", function()
	{
		App.chooseFile(function(fname)
		{
			try
			{
				Editor.exportWebProject(fname);
			}
			catch(e)
			{
				alert("Error saving file");
			}
		}, ".zip", true);
	}, Interface.file_dir + "icons/platform/web.png");

	publish.addOption("Windows", function()
	{
		//TODO <ADD CODE HERE>
	}, Interface.file_dir + "icons/platform/windows.png");

	publish.addOption("OSX", function()
	{
		//TODO <ADD CODE HERE>
	}, Interface.file_dir + "icons/platform/osx.png");

	publish.addOption("Android", function()
	{
		//TODO <ADD CODE HERE>
	}, Interface.file_dir + "icons/platform/android.png");

	Interface.file.addOption("Exit", function()
	{
		if(confirm("All unsaved changes to the project will be lost! Do you really wanna exit?"))
		{
			Editor.exit();
		}
	});

	//Editor
	Interface.editor = new DropdownMenu();
	Interface.editor.setText("Edit");
	Interface.editor.size.set(100, Interface.top_bar.size.y);
	Interface.editor.position.set(120,0);

	Interface.editor.addOption("Copy", function()
	{
		Editor.copySelectedObject();
	});
	
	Interface.editor.addOption("Cut", function()
	{
		Editor.cutSelectedObject();
	});

	Interface.editor.addOption("Paste", function()
	{
		Editor.pasteIntoSelectedObject();
	});

	Interface.editor.addOption("Delete", function()
	{
		Editor.deleteSelectedObject();
	}, Interface.file_dir + "icons/misc/delete.png");

	//Project
	Interface.project = new DropdownMenu();
	Interface.project.setText("Project");
	Interface.project.size.set(100, Interface.top_bar.size.y);
	Interface.project.position.set(220,0);

	Interface.project.addOption("Create Scene", function()
	{
		Editor.program.addDefaultScene();
		Editor.updateObjectViews();
	}, Interface.file_dir + "icons/misc/add.png");

	//About
	Interface.about = new Button();
	Interface.about.setText("About");
	Interface.about.size.set(100, Interface.top_bar.size.y);
	Interface.about.position.set(320, 0);
	Interface.about.updateInterface();
	Interface.about.setCallback(function()
	{
		//Check if there is already a settings tab
		var found = false;
		for(var i = 0; i < Interface.tab.options.length; i++)
		{
			if(Interface.tab.options[i].component instanceof AboutTab)
			{
				found = true;
				Interface.tab.options[i].select();
				break;
			}
		}

		//If not create one
		if(!found)
		{
			var tab = Interface.tab.addOption("About", Interface.file_dir + "icons/misc/about.png", true);
			var settings = new AboutTab(tab.element);
			tab.attachComponent(settings);
			tab.select();
		}
	});

	//Run
	Interface.run = new Button();
	Interface.run.setText("Run");
	Interface.run.size.set(100, Interface.top_bar.size.y);
	Interface.run.position.set(420, 0);
	Interface.run.updateInterface();
	Interface.run.setCallback(function()
	{
		if(Editor.state === Editor.STATE_EDITING)
		{
			Interface.run.setText("Stop");
			Editor.setState(Editor.STATE_TESTING);
		}
		else if(Editor.state === Editor.STATE_TESTING)
		{
			Interface.run.setText("Run");
			Editor.setState(Editor.STATE_EDITING);
		}
	});
}

//Loop update elements
Interface.update = function()
{
	Interface.explorer.update();
	Interface.asset_explorer_div.update();
	Interface.explorer_resizable.update();
	Interface.tab.update();
}

//Update interface
Interface.updateInterface = function()
{
	//Window size
	var size = new THREE.Vector2(window.innerWidth, window.innerHeight);

	//----------------------------------Menu Top Bar----------------------------------
	Interface.top_bar.size.x = size.x;
	Interface.top_bar.updateInterface();

	//Logo
	Interface.image.position.set(size.x - Interface.image.size.x, 3);
	Interface.image.updateInterface();

	//------------------------------------Tool Bar------------------------------------
	Interface.tool_bar.position.set(0, Interface.top_bar.size.y);
	Interface.tool_bar.size.y = size.y - Interface.top_bar.size.y;
	Interface.tool_bar.updateInterface();

	//------------------------------------Explorer------------------------------------
	Interface.explorer.size.y = (size.y - Interface.top_bar.size.y);
	Interface.explorer.position.set(size.x - Interface.explorer.size.x, Interface.top_bar.size.y);
	Interface.explorer.resize_size_max = size.x * 0.7;
	Interface.explorer.updateInterface();

	Interface.explorer_resizable.size.set(Interface.explorer.size.x - Interface.explorer.resize_tab_size, Interface.explorer.size.y);
	Interface.explorer_resizable.updateInterface();

	Interface.tree_view.updateInterface();
	Interface.panel.updateInterface();

	//---------------------------------Asset Manager----------------------------------
	Interface.asset_explorer_div.size.x = size.x - Interface.explorer.size.x - Interface.tool_bar.size.x;
	Interface.asset_explorer_div.position.set(Interface.tool_bar.size.x, size.y - Interface.asset_explorer_div.size.y);
	Interface.asset_explorer_div.resize_size_max = size.y * 0.6;
	Interface.asset_explorer_div.updateInterface();

	Interface.asset_explorer_bar.size.x = Interface.asset_explorer_div.size.x;
	Interface.asset_explorer_bar.updateInterface();

	Interface.asset_explorer.size.x = Interface.asset_explorer_div.size.x;
	Interface.asset_explorer.position.y = Interface.asset_explorer_bar.size.y;
	Interface.asset_explorer.size.y = Interface.asset_explorer_div.size.y - Interface.asset_explorer.position.y;
	Interface.asset_explorer.updateInterface();

	//------------------------------------Tab Container-------------------------------
	Interface.tab.position.set(Interface.tool_bar.size.x, Interface.top_bar.size.y);
	Interface.tab.size.x = (size.x - Interface.tool_bar.size.x - Interface.explorer.size.x);
	Interface.tab.size.y = (size.y - Interface.top_bar.size.y - Interface.asset_explorer_div.size.y); 
	Interface.tab.updateInterface();
	
	Interface.empty_tab_text.updateInterface();

	//Resize editor camera
	Editor.resizeCamera();
}

//Open to save program window
Interface.saveProgram = function()
{
	App.chooseFile(function(fname)
	{
		try
		{
			Editor.saveProgram(fname);
			alert("File saved");
		}
		catch(e)
		{
			alert("Error saving file");
		}
	}, ".isp", true);
}

//Open to load program window
Interface.loadProgram = function()
{
	if(confirm("All unsaved changes to the project will be lost! Load file?"))
	{
		App.chooseFile(function(fname)
		{
			try
			{
				Editor.loadProgram(fname);
				alert("File loaded");
			}
			catch(e)
			{
				alert("Error loading file");
			}
		}, ".isp");
	}
}

//Interface elemento to create new program
Interface.newProgram = function()
{
	if(confirm("All unsaved changes to the project will be lost! Create new File?"))
	{
		Editor.createNewProgram();
		Editor.updateObjectViews();
	}
}
