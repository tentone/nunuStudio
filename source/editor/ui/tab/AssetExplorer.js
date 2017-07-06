"use strict";

function AssetExplorer(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Assets", Editor.filePath + "icons/misc/new.png");

	//Assets
	this.assets = document.createElement("div");
	this.assets.style.position = "absolute";
	this.assets.style.overflow = "auto";
	this.assets.style.top = "20px";
	this.assets.style.width = "100%";
	this.element.appendChild(this.assets);

	//Drop event
	this.element.ondrop = function(event)
	{
		//Dragged file into explorer
		for(var i = 0; i < event.dataTransfer.files.length; i++)
		{
			var file = event.dataTransfer.files[i];
			var name = file.name;

			//Image
			if(Image.fileIsImage(file))
			{
				Editor.loadTexture(file);
			}
			//Video
			else if(Video.fileIsVideo(file))
			{
				Editor.loadVideoTexture(file);
			}
			//Audio
			else if(Audio.fileIsAudio(file))
			{
				Editor.loadAudio(file);
			}
			//Font
			else if(Font.fileIsFont(file))
			{
				Editor.loadFont(file);
			}
		}
	};

	this.element.ondragover = undefined;

	//Bar
	this.bar = new Bar(this.element);
	this.bar.element.style.width = "100%";
	this.bar.element.style.height = "20px";

	//Import Files
	var menu = new DropdownMenu(this.bar.element);
	menu.setText("Import");
	menu.size.set(100, 20);
	menu.position.set(0,0);

	//3D Models Loader
	menu.addOption("3D Models", function()
	{
		FileSystem.chooseFile(function(files)
		{	
			if(files.length > 0)
			{
				Editor.loadGeometry(files[0]);
			}
		}, ".obj, .dae, .gltf, .glb, .awd, .ply, .vtk, .vtp, .wrl, .vrml, .fbx, .pcd, .json, .3ds, .stl, .x, .js");
	}, Editor.filePath + "icons/models/models.png");

	//Textures menu
	var texture = menu.addMenu("Texture", Editor.filePath + "icons/misc/image.png");

	//Image texture
	texture.addOption("Texture", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				Editor.loadTexture(files[0]);
			}
		}, "image/*");
	}, Editor.filePath + "icons/misc/image.png");

	//Spritesheet texture
	texture.addOption("SpriteSheet Texture", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0];
				var name = FileSystem.getFileName(file.name);
				var extension = file.name.split(".").pop().toLowerCase();
				var reader = new FileReader();

				reader.onload = function()
				{
					var texture = new SpriteSheetTexture(new Image(reader.result), 1, 1 ,1);
					texture.name = name;

					Editor.program.addTexture(texture);
					Editor.updateObjectViews();
				};

				reader.readAsDataURL(file);
			}
		}, "image/*");
	}, Editor.filePath + "icons/misc/grid.png");

	//Cube texture
	texture.addOption("Cube Texture", function()
	{
		var texture = new CubeTexture([Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage]);
		texture.name = "cube";
		Editor.program.addTexture(texture);

		Editor.updateObjectViews();
	}, Editor.filePath + "icons/misc/cube.png");

	//Canvas texture
	texture.addOption("Canvas Texture", function()
	{
		var texture = new CanvasTexture(512, 512);
		texture.name = "canvas";
		Editor.program.addTexture(texture);

		Editor.updateObjectViews();
	}, Editor.filePath + "icons/misc/canvas.png");

	//Video texture
	texture.addOption("Video Texture", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				Editor.loadVideoTexture(files[0]);
			}
		}, "video/*");
	}, Editor.filePath + "icons/misc/video.png");

	//Webcam texture
	texture.addOption("Webcam Texture", function()
	{
		var texture = new WebcamTexture();
		texture.name = "webcam";
		Editor.program.addTexture(texture);

		Editor.updateObjectViews();
	}, Editor.filePath + "icons/hw/webcam.png");

	//Load Font
	menu.addOption("Font", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				Editor.loadFont(files[0]);
			}
		}, ".json, .ttf, .otf");
	}, Editor.filePath + "icons/misc/font.png");

	//Spine Animation
	if(Nunu.runningOnDesktop())
	{
		menu.addOption("Spine Animation", function()
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					var file = files[0].path;

					var json = FileSystem.readFile(file);
					var atlas = FileSystem.readFile(file.replace("json", "atlas"));
					var path = FileSystem.getFilePath(file);
					
					var animation = new SpineAnimation(json, atlas, path);
					animation.name = FileSystem.getFileName(file);

					Editor.addToScene(animation);
					Editor.updateObjectViews();
				}
			}, ".json");
		}, Editor.filePath + "icons/misc/spine.png");
	}

	//Load audio file
	menu.addOption("Audio", function()
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				Editor.loadAudio(files[0]);
			}
		}, "audio/*");
	}, Editor.filePath + "icons/misc/audio.png");
	
	//Create material
	var material = new DropdownMenu(this.bar.element);
	material.setText("Material");
	material.size.set(100, 20);
	material.position.set(100,0);
	
	material.addOption("Standard material", function()
	{
		var material = new THREE.MeshStandardMaterial();
		material.name = "standard";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Editor.filePath + "icons/misc/material.png");

	material.addOption("Physical material", function()
	{
		var material = new THREE.MeshPhysicalMaterial();
		material.name = "physical";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Editor.filePath + "icons/misc/material.png");

	material.addOption("Phong material", function()
	{
		var material = new THREE.MeshPhongMaterial();
		material.name = "phong";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Editor.filePath + "icons/misc/material.png");
	
	material.addOption("Basic material", function()
	{
		var material = new THREE.MeshBasicMaterial();
		material.name = "basic";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Editor.filePath + "icons/misc/material.png");

	material.addOption("Sprite material", function()
	{
		var material = new THREE.SpriteMaterial({color: 0xffffff});
		material.name = "sprite";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Editor.filePath + "icons/misc/image.png");

	material.addOption("Toon material", function()
	{
		var material = new THREE.MeshToonMaterial();
		material.name = "toon";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Editor.filePath + "icons/misc/material.png");

	material.addOption("Lambert material", function()
	{
		var material = new THREE.MeshLambertMaterial();
		material.name = "lambert";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Editor.filePath + "icons/misc/material.png");

	material.addOption("Shader material", function()
	{
		var material = new THREE.ShaderMaterial();
		material.name = "shader";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Editor.filePath + "icons/script/script.png");

	var others = material.addMenu("Others");

	others.addOption("Normal material", function()
	{
		var material = new THREE.MeshNormalMaterial();
		material.name = "normal";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Editor.filePath + "icons/misc/material.png");
	
	others.addOption("Depth material", function()
	{
		var material = new THREE.MeshDepthMaterial();
		material.name = "depth";
		Editor.program.addMaterial(material);
		Editor.updateObjectViews();
	}, Editor.filePath + "icons/misc/material.png");
	
	//Files in explorer
	this.filesSize = new THREE.Vector2(70, 70);
	this.filesSpacing = 0;
	this.files = [];

	//Add element to document
	this.parent.appendChild(this.element);
}

AssetExplorer.prototype = Object.create(TabElement.prototype);

//Remove all files
AssetExplorer.prototype.clear = function()
{
	while(this.files.length > 0)
	{
		this.files.pop().destroy();
	}
};

//Add file to explorer
AssetExplorer.prototype.add = function(file)
{
	file.setParent(this.assets);
	file.size.copy(this.filesSize);
	file.updateInterface();

	this.files.push(file);
};

//Update division
AssetExplorer.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		//Asset position
		var filesRow = Math.floor(this.files.length / ((this.files.length * (this.filesSize.x + this.filesSpacing)) / this.size.x));
		for(var i = 0; i < this.files.length; i++)
		{
			var row = Math.floor(i / filesRow);
			var col = i % filesRow;

			this.files[i].position.x = (col * this.filesSize.x) + ((col + 1) * this.filesSpacing);
			this.files[i].position.y = (row * this.filesSize.y) + ((row + 1) * this.filesSpacing);
			this.files[i].updateInterface();
		}

		//Asset
		this.assets.style.height = (this.size.y - 20) + "px";

		//Element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};