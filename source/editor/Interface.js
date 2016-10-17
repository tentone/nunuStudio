"use strict";

function Interface(){}

//Initialize interface
Interface.initialize = function()
{
	//File directory
	Interface.file_dir = "editor/files/";

	//Tab Container
	Interface.tab = new TabGroup();

	//Asset Manager
	Interface.asset_explorer_div = new DivisionResizable();
	Interface.asset_explorer_div.resizable_side = DivisionResizable.TOP;
	Interface.asset_explorer_div.size.y = 150;
	Interface.asset_explorer_div.resize_size_min = 100;
	Interface.asset_explorer_div.resize_size_max = 400;

	//Asset explorer
	Interface.asset_explorer = new AssetExplorer(Interface.asset_explorer_div.element);
	Interface.asset_explorer.files_size.set(Settings.general.file_preview_size, Settings.general.file_preview_size);
	
	//Asset explorer menu bar
	Interface.asset_explorer_bar = new Bar(Interface.asset_explorer_div.element);
	Interface.asset_explorer_bar.position.set(0, 0);
	Interface.asset_explorer_bar.size.y = 20;

	//Import Files
	Interface.asset_file = new DropdownMenu(Interface.asset_explorer_bar.element);
	Interface.asset_file.setText("Import");
	Interface.asset_file.size.set(100, Interface.asset_explorer_bar.size.y);
	Interface.asset_file.position.set(0,0);
	
	var import_models = Interface.asset_file.addMenu("3D Models", Interface.file_dir + "icons/models/models.png");

	//OBJ file loader
	import_models.addOption("Wavefront OBJ", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var loader = new THREE.OBJLoader();
				var obj = loader.parse(FileSystem.readFile(file));
				Editor.addToScene(obj);
			}
		}, ".obj");
	});

	//Collada file loader
	import_models.addOption("Collada", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var loader = new THREE.ColladaLoader();
				loader.options.convertUpAxis = true;
				var collada = loader.parse(FileSystem.readFile(file));
				var scene = collada.scene;
				Editor.addToScene(scene);
			}
		}, ".dae");
	});

	//ThreeJS file format menu
	var import_models_three = import_models.addMenu("ThreeJS");

	//ThreeJS Object Loader
	import_models_three.addOption("Object Loader", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var loader = new THREE.ObjectLoader();
				var object = loader.parse(JSON.parse(FileSystem.readFile(file)));
				Editor.addToScene(object);
			}
		}, ".json");
	});

	//ThreeJS JSON Loader
	import_models_three.addOption("JSON Loader", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var loader = new THREE.JSONLoader();
				var data = loader.parse(JSON.parse(FileSystem.readFile(file)));
				var materials = data.materials;
				var geometry = data.geometry;

				//Create material object
				var material = null;
				if(materials === undefined || materials.length === 0)
				{
					material = new THREE.MeshStandardMaterial();
					material.name = "standard";
				}
				else if(materials.length === 1)
				{
					material = materials[0];
				}
				else if(materials.length > 1)
				{
					material = THREE.MultiMaterial(materials);
				}

				//Create model
				var model = null;
				if(geometry.bones.length > 0)
				{
					model = new SkinnedMesh(geometry, material);
				}
				else
				{
					model = new Mesh(geometry, material);
				}

				Editor.addToScene(model);
			}
		}, ".json");
	});

	//GLTF file loader
	import_models.addOption("GLTF", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var loader = new THREE.GLTFLoader();
				var gltf = loader.parse(FileSystem.readFile(file));
				if(gltf.scene !== undefined)
				{
					Editor.addToScene(gltf.scene);
				}
			}
		}, ".gltf");
	});

	//AWD file loader
	import_models.addOption("AWD", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var loader = new THREE.AWDLoader();
				var awd = loader.parse(FileSystem.readFileArrayBuffer(file));
				Editor.addToScene(awd);
			}
		}, ".awd");
	});

	//PLY file loader
	import_models.addOption("PLY", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var loader = new THREE.PLYLoader();
				var geometry = loader.parse(FileSystem.readFile(file));
				Editor.addToScene(new Mesh(geometry));
			}
		}, ".ply");
	});

	//VTK file loader
	import_models.addOption("VTK", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var loader = new THREE.VTKLoader();
				var geometry = loader.parse(FileSystem.readFileArrayBuffer(file));
				Editor.addToScene(new Mesh(geometry));
			}
		}, ".vtk, .vtp");
	});

	//VRML file loader
	import_models.addOption("VRML", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var loader = new THREE.VRMLLoader();
				var scene = loader.parse(FileSystem.readFile(file));
				for(var i = 0; i < scene.children.length; i++)
				{
					Editor.addToScene(scene.children[i]);
				}
			}
		}, ".wrl, .vrml");
	});

	//FBX
	import_models.addOption("FBX", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var loader = new THREE.FBXLoader();
				var obj = loader.parse(FileSystem.readFile(file));
				Editor.addToScene(obj);
			}
		}, ".fbx");
	});

	//Load Spine Animation
	Interface.asset_file.addOption("Spine Animation", function()
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
	}, Interface.file_dir + "icons/animation/spine.png");

	//Load Image texture
	Interface.asset_file.addOption("Texture", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var name = FileSystem.getFileName(file);

				var texture = new Texture(new Image(file));
				texture.name = name;
				var material = new THREE.MeshStandardMaterial({map: texture, roughness: 0.6, metalness: 0.2});
				material.name = name;
				Editor.program.addMaterial(material);
				Editor.updateObjectViews();
			}
		}, "image/*");
	}, Interface.file_dir + "icons/assets/image.png");

	//Create text texture
	Interface.asset_file.addOption("Text Texture", function()
	{
		var texture = new TextTexture("abcdef", Editor.default_font);
		var material = new THREE.MeshStandardMaterial({map: texture, roughness: 0.6, metalness: 0.2});
		material.name = "text";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Interface.file_dir + "icons/assets/image.png");


	//Video texture
	Interface.asset_file.addOption("Video Texture", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var name = FileSystem.getFileName(file);

				var texture = new VideoTexture(new Video(file));
				texture.name = name;
				var material = new THREE.MeshStandardMaterial({map: texture, roughness: 0.6, metalness: 0.2});
				material.name = name;
				Editor.program.addMaterial(material);
				Editor.updateObjectViews();
			}
		}, "video/*");
	}, Interface.file_dir + "icons/assets/video.png");

	//Webcam texture
	Interface.asset_file.addOption("Webcam Texture", function()
	{
		var texture = new WebcamTexture();
		texture.name = "webcam";
		var material = new THREE.MeshStandardMaterial({map: texture, roughness: 0.6, metalness: 0.2});
		material.name = "webcam";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Interface.file_dir + "icons/hw/webcam.png");

	//Load Font
	Interface.asset_file.addOption("Font", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;
				var loader = new TTFLoader();

				if(confirm("Reverse font glyphs?"))
				{
					loader.reversed = true;
				}

				var font = new Font(loader.parse(FileSystem.readFileArrayBuffer(file)));
				font.name = FileSystem.getFileName(file);

				Editor.addToScene(new Text3D("Text", Editor.default_material, font));
				Editor.updateObjectViews();
			}
		}, ".json, .ttf, .otf");
	}, Interface.file_dir + "icons/assets/font.png");

	//Load audio file
	Interface.asset_file.addOption("Audio", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].path;

				var audio = new AudioEmitter(new Audio(file));
				audio.name = FileSystem.getFileName(file);
				
				Editor.addToScene(audio);
				Editor.updateObjectViews();
			}
		}, "audio/*");
	}, Interface.file_dir + "icons/assets/audio.png");

	//Create material
	Interface.asset_material = new DropdownMenu(Interface.asset_explorer_bar.element);
	Interface.asset_material.setText("Material");
	Interface.asset_material.size.set(100, Interface.asset_explorer_bar.size.y);
	Interface.asset_material.position.set(100,0);

	Interface.asset_material.addOption("Standard material", function()
	{
		var material = new THREE.MeshStandardMaterial();
		material.name = "standard";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	});

	Interface.asset_material.addOption("Phong material", function()
	{
		var material = new THREE.MeshPhongMaterial();
		material.name = "phong";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	});
	
	Interface.asset_material.addOption("Basic material", function()
	{
		var material = new THREE.MeshBasicMaterial();
		material.name = "basic";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	});
	
	Interface.asset_material.addOption("Lambert material", function()
	{
		var material = new THREE.MeshLambertMaterial();
		material.name = "lambert";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	});
	
	Interface.asset_material.addOption("Sprite material", function()
	{
		var material = new THREE.SpriteMaterial({color: 0xffffff});
		material.name = "sprite";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	});

	var material_others = Interface.asset_material.addMenu("Others");
	material_others.addOption("Shader material", function()
	{
		var material = new THREE.ShaderMaterial();
		material.name = "shader";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	});
	material_others.addOption("Normal material", function()
	{
		var material = new THREE.MeshNormalMaterial();
		material.name = "normal";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	});
	material_others.addOption("Depth material", function()
	{
		var material = new THREE.MeshDepthMaterial();
		material.name = "depth";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	});

	//Explorer
	Interface.explorer = new DivisionResizable();
	Interface.explorer.size.x = 300;
	Interface.explorer.resize_size_min = 100;
	Interface.explorer.setOnResize(function()
	{
		Interface.updateInterface();
		if(Interface.panel !== null)
		{
			Interface.panel.updateInterface();
		}
	});

	Interface.explorer_resizable = new DualDivisionResizable(Interface.explorer.element);
	Interface.explorer_resizable.orientation = DualDivisionResizable.VERTICAL;
	Interface.explorer_resizable.tab_position = 0.6;
	Interface.explorer_resizable.setOnResize(function()
	{
		Interface.explorer_resizable.updateInterface();
		Interface.tree_view.updateInterface();
		if(Interface.panel !== null)
		{
			Interface.panel.updateInterface();
		}
	});

	//Project explorer
	Interface.tree_view = new TreeView(Interface.explorer_resizable.div_a);

	//Object panel variables
	Interface.panel = new Panel(Interface.explorer_resizable.div_b);

	//Tool Bar
	Interface.tool_bar = new Bar();
	Interface.tool_bar.size.x = 40;

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
		Editor.selectTool(Editor.MODE_SELECT);
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
		Editor.selectTool(Editor.MODE_MOVE);
	});

	//Resize
	Interface.tool_scale = new ButtonImageToggle();
	Interface.tool_scale.setImage(Interface.file_dir + "icons/tools/resize.png");
	Interface.tool_scale.image_scale.set(0.7, 0.7);
	Interface.tool_scale.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.tool_scale.position.set(0, 160);
	Interface.tool_scale.updateInterface();
	Interface.tool_scale.setCallback(function()
	{
		Editor.selectTool(Editor.MODE_SCALE);
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
		Editor.selectTool(Editor.MODE_ROTATE);
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
		var model = new Mesh(geometry, Editor.default_material);
		model.name = "cube";
		Editor.addToScene(model);
	}, "Cube");

	//Cylinder
	Interface.add_model.addOption(Interface.file_dir + "icons/models/cylinder.png", function()
	{
		var geometry = new THREE.CylinderBufferGeometry(1, 1, 2, 32);
		var model = new Mesh(geometry, Editor.default_material);
		model.name = "cylinder";
		Editor.addToScene(model);
	}, "Cylinder");

	//Sphere
	Interface.add_model.addOption(Interface.file_dir + "icons/models/sphere.png", function()
	{
		var geometry = new THREE.SphereBufferGeometry(1, 32, 32);
		var model = new Mesh(geometry, Editor.default_material);
		model.name = "sphere";
		Editor.addToScene(model);
	}, "Sphere");

	//Torus
	Interface.add_model.addOption(Interface.file_dir + "icons/models/torus.png", function()
	{
		var geometry = new THREE.TorusBufferGeometry(1, 0.5, 16, 96);
		var model = new Mesh(geometry, Editor.default_material);
		model.name = "torus";
		Editor.addToScene(model);
	}, "Torus");

	//Cone
	Interface.add_model.addOption(Interface.file_dir + "icons/models/cone.png", function()
	{
		var geometry = new THREE.ConeBufferGeometry(1, 2, 32);
		var model = new Mesh(geometry, Editor.default_material);
		model.name = "cone";
		Editor.addToScene(model);
	}, "Cone");

	//Text
	Interface.add_model.addOption(Interface.file_dir + "icons/models/text.png", function()
	{
		var model = new Text3D("text", Editor.default_material, Editor.default_font);
		Editor.addToScene(model);
	}, "3D Text");

	//Plane
	Interface.add_model.addOption(Interface.file_dir + "icons/models/plane.png", function()
	{
		var geometry = new THREE.PlaneBufferGeometry(1,1);
		var model = new Mesh(geometry, Editor.default_material);
		model.receiveShadow = true;
		model.castShadow = true;
		model.name = "plane";
		Editor.addToScene(model);
	}, "Plane");

	//Tetrahedron
	Interface.add_model.addOption(Interface.file_dir + "icons/models/pyramid.png", function()
	{
		var geometry = new THREE.TetrahedronGeometry(1, 0);
		var model = new Mesh(geometry, Editor.default_material);
		model.name = "tetrahedron";
		Editor.addToScene(model);
	}, "Tetrahedron");

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
		Editor.addToScene(new PointLight(0x444444));
	}, "Point Light");

	//Ambient Light
	Interface.add_light.addOption(Interface.file_dir + "icons/lights/ambient.png", function()
	{
		Editor.addToScene(new AmbientLight(0x444444));
	}, "Ambient Light");

	//Spot Light
	Interface.add_light.addOption(Interface.file_dir + "icons/lights/spot.png", function()
	{
		Editor.addToScene(new SpotLight(0x444444));
	}, "Spot Light");

	//Directional Light
	Interface.add_light.addOption(Interface.file_dir + "icons/lights/directional.png", function()
	{
		Editor.addToScene(new DirectionalLight(0x444444));
	}, "Directional Light");

	//Hemisphere Light
	Interface.add_light.addOption(Interface.file_dir + "icons/lights/hemisphere.png", function()
	{
		Editor.addToScene(new HemisphereLight(0x444444));
	}, "Hemisphere Light");

	//Sky
	Interface.add_light.addOption(Interface.file_dir + "icons/lights/sky.png", function()
	{
		Editor.addToScene(new Sky());
	}, "Sky");

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
		Editor.addToScene(new PerspectiveCamera(60, Editor.canvas.width/Editor.canvas.height));
	}, "Prespective Camera");

	//Orthographic camera
	Interface.add_camera.addOption(Interface.file_dir + "icons/camera/orthographic.png", function()
	{
		Editor.addToScene(new OrthographicCamera(3, 2, OrthographicCamera.FIXED_VERTICAL));
	}, "Othographic Camera");

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
		Editor.addToScene(new Script());
	}, "JS Script");

	//Block script
	Interface.add_script.addOption(Interface.file_dir + "icons/script/blocks.png", function()
	{
		//TODO <ADD CODE HERE>
	}, "Block Script");

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
		Editor.addToScene(new Sprite(Editor.default_sprite_material));
	}, "Sprite");

	//Particle emitter
	Interface.add_effects.addOption(Interface.file_dir + "icons/effects/particles.png", function()
	{
		Editor.addToScene(new ParticleEmitter());
	}, "Particle Emitter");

	//Container
	Interface.add_effects.addOption(Interface.file_dir + "icons/effects/container.png", function()
	{
		Editor.addToScene(new Container());
	}, "Container");

	//Audio
	Interface.add_effects.addOption(Interface.file_dir + "icons/assets/audio.png", function()
	{
		Editor.addToScene(new AudioEmitter(Editor.default_audio));
	}, "Audio");

	//Physics
	Interface.add_physics = new ButtonDrawer();
	Interface.add_physics.setImage(Interface.file_dir + "icons/physics/physics.png");
	Interface.add_physics.options_per_line = 3;
	Interface.add_physics.image_scale.set(0.7, 0.7);
	Interface.add_physics.options_scale.set(0.7, 0.7);
	Interface.add_physics.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.add_physics.position.set(0, 480);
	Interface.add_physics.options_size.set(40, 40);
	Interface.add_physics.updateInterface();

	//Physics box
	Interface.add_physics.addOption(Interface.file_dir + "icons/models/cube.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
		obj.name = "box";
		Editor.addToScene(obj);
	}, "Box");

	//Physics sphere
	Interface.add_physics.addOption(Interface.file_dir + "icons/models/sphere.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Sphere(1.0));
		obj.name = "sphere";
		Editor.addToScene(obj);
	}, "Sphere");

	//Physics Cylinder
	Interface.add_physics.addOption(Interface.file_dir + "icons/models/cylinder.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Cylinder(1.0, 1.0, 2.0, 8));
		obj.name = "cylinder";
		Editor.addToScene(obj);
	}, "Cylinder");

	//Physics Plane
	Interface.add_physics.addOption(Interface.file_dir + "icons/models/plane.png", function()
	{
		var obj = new PhysicsObject();
		obj.rotation.x = -1.57;
		obj.body.addShape(new CANNON.Plane());
		obj.body.type = CANNON.Body.KINEMATIC;
		obj.name = "ground";
		Editor.addToScene(obj);
	}, "Ground");

	//Physics Particle
	Interface.add_physics.addOption(Interface.file_dir + "icons/models/point.png", function()
	{
		var obj = new PhysicsObject();
		obj.body.addShape(new CANNON.Particle());
		obj.name = "particle";
		Editor.addToScene(obj);
	}, "Particle");

	//Add device
	Interface.add_device = new ButtonDrawer();
	Interface.add_device.setImage(Interface.file_dir + "icons/hw/hw.png");
	Interface.add_device.options_per_line = 2;
	Interface.add_device.image_scale.set(0.7, 0.7);
	Interface.add_device.options_scale.set(0.7, 0.7);
	Interface.add_device.size.set(Interface.tool_bar.size.x, Interface.tool_bar.size.x);
	Interface.add_device.position.set(0, 520);
	Interface.add_device.options_size.set(40, 40);
	Interface.add_device.updateInterface();

	//Leap Hand
	Interface.add_device.addOption(Interface.file_dir + "icons/hw/leap.png", function()
	{
		Editor.addToScene(new LeapMotion());
	}, "Leap Motion");

	//Kinect Skeleton
	Interface.add_device.addOption(Interface.file_dir + "icons/hw/kinect.png", function()
	{
		Editor.addToScene(new KinectDevice());
	}, "Microsoft Kinect");

	//Menu Top Bar
	Interface.top_bar = new Bar();
	Interface.top_bar.size.y = 25 ;

	//Editor Logo
	Interface.image = new ImageBox();
	Interface.image.setImage("editor/files/logo.png");
	Interface.image.size.set(108, 18);
	Interface.image.updateInterface();

	//File
	Interface.file = new DropdownMenu();
	Interface.file.setText("File");
	Interface.file.size.set(120, Interface.top_bar.size.y);
	Interface.file.position.set(0,0);

	//New project
	Interface.file.addOption("New Project", function()
	{
		Interface.newProgram();
	}, Interface.file_dir + "icons/misc/new.png");

	//Save project
	Interface.file.addOption("Save Project", function()
	{
		Interface.saveProgram();
	}, Interface.file_dir + "icons/misc/save.png");

	//Load Project
	Interface.file.addOption("Load Project", function()
	{
		Interface.loadProgram();
	});

	//Settings
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
			var tab = Interface.tab.addTab("Settings", Interface.file_dir + "icons/tab/settings.png", true);
			var settings = new SettingsTab(tab.element);
			tab.attachComponent(settings);
			tab.select();
		}
	}, Interface.file_dir + "icons/tab/settings.png");

	var publish = Interface.file.addMenu("Publish");
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
	}, Interface.file_dir + "icons/platform/web.png");

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
	}, Interface.file_dir + "icons/platform/windows.png");

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
	}, Interface.file_dir + "icons/platform/linux.png");

	publish.addOption("macOS", function()
	{
		alert("For macOS export NWJS for macOS is required");
	}, Interface.file_dir + "icons/platform/osx.png");

	publish.addOption("Android", function()
	{
		alert("Android export not implemented");
	}, Interface.file_dir + "icons/platform/android.png");

	publish.addOption("Nunu App", function()
	{
		alert("Optimized nunu app export not implemented");
	}, Interface.file_dir + "icons/platform/nunu.png");

	Interface.file.addOption("Exit", function()
	{
		if(confirm("All unsaved changes to the project will be lost! Do you really wanna exit?"))
		{
			Editor.exit();
		}
	}, Interface.file_dir + "icons/misc/exit.png");

	//Editor
	Interface.editor = new DropdownMenu();
	Interface.editor.setText("Edit");
	Interface.editor.size.set(100, Interface.top_bar.size.y);
	Interface.editor.position.set(120,0);

	Interface.editor.addOption("Undo", function()
	{
		Editor.undo();
	}, Interface.file_dir + "icons/misc/undo.png");

	Interface.editor.addOption("Redo", function()
	{
		Editor.redo();
	}, Interface.file_dir + "icons/misc/redo.png");

	Interface.editor.addOption("Copy", function()
	{
		Editor.copyObject();
	}, Interface.file_dir + "icons/misc/copy.png");
	
	Interface.editor.addOption("Cut", function()
	{
		Editor.cutObject();
	}, Interface.file_dir + "icons/misc/cut.png");

	Interface.editor.addOption("Paste", function()
	{
		Editor.pasteObject();
	}, Interface.file_dir + "icons/misc/paste.png");

	Interface.editor.addOption("Delete", function()
	{
		Editor.deleteObject();
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
				alert("Error: " + error);
			}
		}, ".js");
	}, Interface.file_dir + "icons/script/script.png");

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
			var tab = Interface.tab.addTab("About", Interface.file_dir + "icons/misc/about.png", true);
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
			Editor.setState(Editor.STATE_TESTING);
		}
		else if(Editor.state === Editor.STATE_TESTING)
		{
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

	//Menu Top Bar
	Interface.top_bar.size.x = size.x;
	Interface.top_bar.updateInterface();

	//Logo
	Interface.image.position.set(size.x - Interface.image.size.x, 3);
	Interface.image.updateInterface();

	//Tool Bar
	Interface.tool_bar.position.set(0, Interface.top_bar.size.y);
	Interface.tool_bar.size.y = size.y - Interface.top_bar.size.y;
	Interface.tool_bar.updateInterface();

	//Project Explorer
	Interface.explorer.size.y = (size.y - Interface.top_bar.size.y);
	Interface.explorer.position.set(size.x - Interface.explorer.size.x, Interface.top_bar.size.y);
	Interface.explorer.resize_size_max = size.x * 0.7;
	Interface.explorer.updateInterface();

	Interface.explorer_resizable.size.set(Interface.explorer.size.x - Interface.explorer.resize_tab_size, Interface.explorer.size.y);
	Interface.explorer_resizable.updateInterface();

	Interface.tree_view.updateInterface();

	//Asset Explorer
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

	//Tab Container
	Interface.tab.position.set(Interface.tool_bar.size.x, Interface.top_bar.size.y);
	Interface.tab.size.x = (size.x - Interface.tool_bar.size.x - Interface.explorer.size.x);
	Interface.tab.size.y = (size.y - Interface.top_bar.size.y - Interface.asset_explorer_div.size.y); 
	Interface.tab.updateInterface();

	//Resize editor camera
	Editor.resizeCamera();
}

//Open to save program window
Interface.saveProgram = function()
{
	FileSystem.chooseFile(function(files)
	{
		try
		{
			Editor.saveProgram(files[0].path);
			alert("Project saved");
		}
		catch(e)
		{
			alert("Error saving file\n(" + e + ")");
		}
	}, ".isp", true);
}

//Open to load program window
Interface.loadProgram = function()
{
	if(confirm("All unsaved changes to the project will be lost! Load file?"))
	{
		FileSystem.chooseFile(function(files)
		{
			try
			{
				Editor.loadProgram(files[0].path);
				Editor.resetEditingFlags();
				Editor.updateObjectViews();
				alert("Project loaded");
			}
			catch(e)
			{
				alert("Error loading file\n(" + e + ")");
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

//Select object manipulation tool
Interface.selectTool = function(tool)
{
	Interface.tool_select.selected = false;
	Interface.tool_move.selected = false;
	Interface.tool_scale.selected = false;
	Interface.tool_rotate.selected = false;

	if(tool === Editor.MODE_SELECT)
	{
		Interface.tool_select.selected = true;
	}
	else if(tool === Editor.MODE_MOVE)
	{
		Interface.tool_move.selected = true;
	}
	else if(tool === Editor.MODE_ROTATE)
	{
		Interface.tool_rotate.selected = true;
	}
	else if(tool === Editor.MODE_SCALE)
	{
		Interface.tool_scale.selected = true;
	}

	Interface.tool_rotate.updateInterface();
	Interface.tool_move.updateInterface();
	Interface.tool_scale.updateInterface();
	Interface.tool_select.updateInterface();
}