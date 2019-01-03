"use strict";

function AssetExplorerMenu(parent)
{
	Element.call(this, parent, "div");

	this.element.style.backgroundColor = Editor.theme.barColor;
	this.element.style.overflow = "visible";
	
	//Import
	var menu = new DropdownMenu(this);
	menu.setText(Locale.import);
	menu.size.set(100, 20);
	menu.position.set(0, 0);

	//3D Models Loader
	menu.addOption("3D Models", function()
	{
		FileSystem.chooseFile(function(files)
		{	
			for(var i = 0; i < files.length; i++)
			{
				Editor.loadModel(files[i]);
			}
		}, ".obj, .dae, .gltf, .glb, .awd, .ply, .vtk, .vtp, .wrl, .vrml, .fbx, .pcd, .json, .3ds, .stl, .x, .js");
	}, Editor.FILE_PATH + "icons/models/models.png");

	//Load Font
	menu.addOption("Font", function()
	{
		FileSystem.chooseFile(function(files)
		{
			for(var i = 0; i < files.length; i++)
			{
				Editor.loadFont(files[i]);
			}
		}, ".json, .ttf, .otf");
	}, Editor.FILE_PATH + "icons/misc/font.png");

	//Load text
	menu.addOption("Text", function()
	{
		FileSystem.chooseFile(function(files)
		{
			for(var i = 0; i < files.length; i++)
			{
				Editor.loadText(files[i]);
			}
		}, ".js, .txt, .glsl, .json, .xml, .yaml, .csv, .css, .html");
	}, Editor.FILE_PATH + "icons/misc/file.png");

	//Audio file
	menu.addOption("Audio", function()
	{
		FileSystem.chooseFile(function(files)
		{
			for(var i = 0; i < files.length; i++)
			{
				Editor.loadAudio(files[i]);
			}
		}, "audio/*");
	}, Editor.FILE_PATH + "icons/misc/audio.png");
	
	//Spine Animation
	if(Nunu.runningOnDesktop())
	{
		menu.addOption("Spine Animation", function()
		{
			FileSystem.chooseFile(function(files)
			{
				for(var i = 0; i < files.length; i++)
				{
					try
					{
						var file = files[i].path;
						
						var json = FileSystem.readFile(file);
						var atlas = FileSystem.readFile(file.replace("json", "atlas"));
						var path = FileSystem.getFilePath(file);
						
						var animation = new SpineAnimation(json, atlas, path);
						animation.name = FileSystem.getFileName(file);

						Editor.addObject(animation);
					}
					catch(e)
					{
						Editor.alert("Failed to load Spine animation, make sure that .json and .atlas have the same name (" + e + ")");
					}
				}
			}, ".json, .spine");
		}, Editor.FILE_PATH + "icons/misc/spine.png");
	}

	menu.updateInterface();

	//Textures
	var texture = new DropdownMenu(this);
	texture.setText("Texture");
	texture.size.set(100, 20);
	texture.position.set(100, 0);

	//Image texture
	texture.addOption("Texture", function()
	{
		FileSystem.chooseFile(function(files)
		{
			for(var i = 0; i < files.length; i++)
			{
				Editor.loadTexture(files[i]);
			}
		}, "image/*");
	}, Editor.FILE_PATH + "icons/misc/image.png");

	//Spritesheet texture
	texture.addOption("SpriteSheet Texture", function()
	{
		FileSystem.chooseFile(function(files)
		{
			for(var i = 0; i < files.length; i++)
			{
				var file = files[i];
				var name = FileSystem.getFileName(file.name);
				var extension = FileSystem.getFileExtension(file.name);

				var reader = new FileReader();

				reader.onload = function()
				{
					var texture = new SpriteSheetTexture(new Image(reader.result, extension), 1, 1 ,1);
					texture.name = name;
					Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
				};

				reader.readAsArrayBuffer(file);
			}
		}, "image/*");
	}, Editor.FILE_PATH + "icons/misc/grid.png");

	//Cube texture
	texture.addOption("Cube Texture", function()
	{
		var texture = new CubeTexture([Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage]);
		texture.name = "cube";
		Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
	}, Editor.FILE_PATH + "icons/misc/cube.png");

	//Canvas texture
	texture.addOption("Canvas Texture", function()
	{
		var texture = new CanvasTexture(512, 512);
		texture.name = "canvas";
		Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
	}, Editor.FILE_PATH + "icons/misc/canvas.png");

	//Video texture
	texture.addOption("Video Texture", function()
	{
		FileSystem.chooseFile(function(files)
		{
			for(var i = 0; i < files.length; i++)
			{
				Editor.loadVideoTexture(files[i]);
			}
		}, "video/*");
	}, Editor.FILE_PATH + "icons/misc/video.png");

	//Webcam texture
	texture.addOption("Webcam Texture", function()
	{
		var texture = new WebcamTexture();
		texture.name = "webcam";
		Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
	}, Editor.FILE_PATH + "icons/hw/webcam.png");

	texture.updateInterface();

	//Material
	var material = new DropdownMenu(this);
	material.setText(Locale.material);
	material.size.set(100, 20);
	material.position.set(200, 0);
	
	material.addOption("Standard material", function()
	{
		var material = new THREE.MeshStandardMaterial();
		material.name = "standard";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/material.png");

	material.addOption("Physical material", function()
	{
		var material = new THREE.MeshPhysicalMaterial();
		material.name = "physical";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/material.png");

	material.addOption("Phong material", function()
	{
		var material = new THREE.MeshPhongMaterial();
		material.name = "phong";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/material.png");
	
	material.addOption("Basic material", function()
	{
		var material = new THREE.MeshBasicMaterial();
		material.name = "basic";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/material.png");

	material.addOption("Toon material", function()
	{
		var material = new THREE.MeshToonMaterial();
		material.name = "toon";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/material.png");

	material.addOption("Lambert material", function()
	{
		var material = new THREE.MeshLambertMaterial();
		material.name = "lambert";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/material.png");

	material.addOption("Matcap material", function()
	{
		var material = new THREE.MeshMatcapMaterial();
		material.name = "matcap";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/material.png");

	material.addOption("Sprite material", function()
	{
		var material = new THREE.SpriteMaterial({color: 0xffffff});
		material.name = "sprite";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/image.png");

	material.addOption("Points material", function()
	{
		var material = new THREE.PointsMaterial();
		material.name = "points";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/models/points.png");

	material.addOption("Line material", function()
	{
		var material = new THREE.LineBasicMaterial();
		material.name = "line";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/nodes.png");

	material.addOption("Line Dashed material", function()
	{
		var material = new THREE.LineDashedMaterial();
		material.name = "line";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/nodes.png");

	material.addOption("Shader material", function()
	{
		var material = new THREE.ShaderMaterial();
		material.name = "shader";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/script/script.png");

	var others = material.addMenu("Others");

	others.addOption("Normal material", function()
	{
		var material = new THREE.MeshNormalMaterial();
		material.name = "normal";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/material.png");
	
	others.addOption("Depth material", function()
	{
		var material = new THREE.MeshDepthMaterial();
		material.name = "depth";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/material.png");

	others.addOption("Distance material", function()
	{
		var material = new THREE.MeshDistanceMaterial();
		material.name = "distance";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/material.png");

	others.addOption("Shadow material", function()
	{
		var material = new THREE.ShadowMaterial();
		material.name = "shadow";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Editor.FILE_PATH + "icons/misc/material.png");

	material.updateInterface();

	//Create menu
	var create = new DropdownMenu(this);
	create.setText("Create");
	create.size.set(100, 20);
	create.position.set(300, 0);
	
	create.addOption("HTML", function()
	{
		var resource = new TextFile("", "html");
		resource.name = "html";
		Editor.addAction(new AddResourceAction(resource, Editor.program, "resources"));
	}, Editor.FILE_PATH + "icons/script/script.png");

	create.addOption("Javascript", function()
	{
		var resource = new TextFile("", "js");
		resource.name = "js";
		Editor.addAction(new AddResourceAction(resource, Editor.program, "resources"));
	}, Editor.FILE_PATH + "icons/script/script.png");

	create.updateInterface();
}

AssetExplorerMenu.prototype = Object.create(Element.prototype);
