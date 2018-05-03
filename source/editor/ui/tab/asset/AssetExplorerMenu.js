"use strict";

function AssetExplorerMenu(parent)
{
	Element.call(this, parent);

	this.element.style.backgroundColor = Editor.theme.barColor;
	this.element.style.overflow = "visible";
	this.element.style.position = "absolute";
	this.element.style.width = "100%";
	this.element.style.height = "20px";

	//Import
	var menu = new DropdownMenu(this.element);
	menu.setText("Import");
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
	}, Editor.filePath + "icons/models/models.png");

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
	}, Editor.filePath + "icons/misc/font.png");

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
	}, Editor.filePath + "icons/misc/file.png");

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
	}, Editor.filePath + "icons/misc/audio.png");
	
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
						Editor.updateViewsGUI();
					}
					catch(e)
					{
						Editor.alert("Failed to load Spine animation, make sure that .json and .atlas have the same name (" + e + ")");
					}
				}
			}, ".json, .spine");
		}, Editor.filePath + "icons/misc/spine.png");
	}

	menu.updateInterface();

	//Textures
	var texture = new DropdownMenu(this.element);
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
	}, Editor.filePath + "icons/misc/image.png");

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

					Editor.program.addTexture(texture);
					Editor.updateViewsGUI();
				};

				reader.readAsArrayBuffer(file);
			}
		}, "image/*");
	}, Editor.filePath + "icons/misc/grid.png");

	//Cube texture
	texture.addOption("Cube Texture", function()
	{
		var texture = new CubeTexture([Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage]);
		texture.name = "cube";
		Editor.program.addTexture(texture);

		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/cube.png");

	//Canvas texture
	texture.addOption("Canvas Texture", function()
	{
		var texture = new CanvasTexture(512, 512);
		texture.name = "canvas";
		Editor.program.addTexture(texture);

		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/canvas.png");

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
	}, Editor.filePath + "icons/misc/video.png");

	//Webcam texture
	texture.addOption("Webcam Texture", function()
	{
		var texture = new WebcamTexture();
		texture.name = "webcam";
		Editor.program.addTexture(texture);

		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/hw/webcam.png");

	texture.updateInterface();

	//Create material
	var material = new DropdownMenu(this.element);
	material.setText("Material");
	material.size.set(100, 20);
	material.position.set(200, 0);
	
	material.addOption("Standard material", function()
	{
		var material = new THREE.MeshStandardMaterial();
		material.name = "standard";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/material.png");

	material.addOption("Physical material", function()
	{
		var material = new THREE.MeshPhysicalMaterial();
		material.name = "physical";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/material.png");

	material.addOption("Phong material", function()
	{
		var material = new THREE.MeshPhongMaterial();
		material.name = "phong";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/material.png");
	
	material.addOption("Basic material", function()
	{
		var material = new THREE.MeshBasicMaterial();
		material.name = "basic";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/material.png");

	material.addOption("Toon material", function()
	{
		var material = new THREE.MeshToonMaterial();
		material.name = "toon";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/material.png");

	material.addOption("Lambert material", function()
	{
		var material = new THREE.MeshLambertMaterial();
		material.name = "lambert";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/material.png");

	material.addOption("Sprite material", function()
	{
		var material = new THREE.SpriteMaterial({color: 0xffffff});
		material.name = "sprite";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/image.png");

	material.addOption("Points material", function()
	{
		var material = new THREE.PointsMaterial();
		material.name = "points";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/models/points.png");

	material.addOption("Line material", function()
	{
		var material = new THREE.LineBasicMaterial();
		material.name = "line";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/nodes.png");

	material.addOption("Line Dashed material", function()
	{
		var material = new THREE.LineDashedMaterial();
		material.name = "line";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/nodes.png");

	material.addOption("Shader material", function()
	{
		var material = new THREE.ShaderMaterial();
		material.name = "shader";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/script/script.png");

	var others = material.addMenu("Others");

	others.addOption("Normal material", function()
	{
		var material = new THREE.MeshNormalMaterial();
		material.name = "normal";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/material.png");
	
	others.addOption("Depth material", function()
	{
		var material = new THREE.MeshDepthMaterial();
		material.name = "depth";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/material.png");

	others.addOption("Distance material", function()
	{
		var material = new THREE.MeshDistanceMaterial();
		material.name = "distance";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/material.png");

	others.addOption("Shadow material", function()
	{
		var material = new THREE.ShadowMaterial();
		material.name = "shadow";
		Editor.program.addMaterial(material);
		Editor.updateViewsGUI();
	}, Editor.filePath + "icons/misc/material.png");

	material.updateInterface();
}

AssetExplorerMenu.prototype = Object.create(Element.prototype);
