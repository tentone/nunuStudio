import {Locale} from "../../../locale/LocaleManager.js";
import {WebcamTexture} from "../../../../core/texture/WebcamTexture.js";
import {SpriteSheetTexture} from "../../../../core/texture/SpriteSheetTexture.js";
import {CubeTexture} from "../../../../core/texture/CubeTexture.js";
import {CanvasTexture} from "../../../../core/texture/CanvasTexture.js";
import {TextFile} from "../../../../core/resources/TextFile.js";
import {Image} from "../../../../core/resources/Image.js";
import {Nunu} from "../../../../core/Nunu.js";
import {FileSystem} from "../../../../core/FileSystem.js";
import {Loaders} from "../../../Loaders.js";
import {AddResourceAction} from "../../../history/action/resources/AddResourceAction.js";
import {Global} from "../../../Global.js";
import {Editor} from "../../../Editor.js";
import {DropdownMenu} from "../../../components/dropdown/DropdownMenu.js";
import {Component} from "../../../components/Component.js";
import {MeshStandardMaterial, MeshPhysicalMaterial, MeshPhongMaterial, MeshBasicMaterial, MeshToonMaterial, MeshLambertMaterial, MeshMatcapMaterial, SpriteMaterial, PointsMaterial, LineBasicMaterial, LineDashedMaterial, ShaderMaterial, RawShaderMaterial, MeshNormalMaterial, MeshDepthMaterial, MeshDistanceMaterial, ShadowMaterial} from "three";


function AssetExplorerMenu(parent)
{
	Component.call(this, parent, "div");

	this.element.style.backgroundColor = "var(--bar-color)";
	this.element.style.overflow = "visible";
	
	// Import
	var menu = new DropdownMenu(this);
	menu.setText(Locale.import);
	menu.size.set(100, 25);
	menu.position.set(0, 0);

	//3D Models Loader
	menu.addOption(Locale.models3D, function()
	{
		FileSystem.chooseFile(function(files)
		{	
			for(var i = 0; i < files.length; i++)
			{
				Loaders.loadModel(files[i]);
			}
		}, ".obj, .dae, .gltf, .glb, .awd, .ply, .vtk, .vtp, .wrl, .vrml, .fbx, .pcd, .json, .3ds, .stl, .x, .js");
	}, Global.FILE_PATH + "icons/models/models.png");

	// Load Font
	menu.addOption(Locale.font, function()
	{
		FileSystem.chooseFile(function(files)
		{
			for(var i = 0; i < files.length; i++)
			{
				Loaders.loadFont(files[i]);
			}
		}, ".json, .ttf, .otf");
	}, Global.FILE_PATH + "icons/misc/font.png");

	// Load text
	menu.addOption(Locale.text, function()
	{
		FileSystem.chooseFile(function(files)
		{
			for(var i = 0; i < files.length; i++)
			{
				Loaders.loadText(files[i]);
			}
		}, ".js, .txt, .glsl, .json, .xml, .yaml, .csv, .css, .html");
	}, Global.FILE_PATH + "icons/misc/file.png");

	// Audio file
	menu.addOption(Locale.audio, function()
	{
		FileSystem.chooseFile(function(files)
		{
			for(var i = 0; i < files.length; i++)
			{
				Loaders.loadAudio(files[i]);
			}
		}, "audio/*");
	}, Global.FILE_PATH + "icons/misc/audio.png");
	
	// Spine Animation
	if(Nunu.runningOnDesktop())
	{
		menu.addOption(Locale.spineAnimation, function()
		{
			FileSystem.chooseFile(function(files)
			{
				for(var i = 0; i < files.length; i++)
				{
					Loaders.loadSpineAnimation(files[i]);
				}
			}, ".json, .spine");
		}, Global.FILE_PATH + "icons/misc/spine.png");
	}

	menu.updateInterface();

	// Textures
	var texture = new DropdownMenu(this);
	texture.setText(Locale.texture);
	texture.size.set(100, 25);
	texture.position.set(100, 0);

	// Image texture
	texture.addOption(Locale.texture, function()
	{
		FileSystem.chooseFile(function(files)
		{
			for(var i = 0; i < files.length; i++)
			{
				Loaders.loadTexture(files[i]);
			}
		}, "image/*");
	}, Global.FILE_PATH + "icons/misc/image.png");

	// Spritesheet texture
	texture.addOption(Locale.spriteSheetTexture, function()
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
	}, Global.FILE_PATH + "icons/misc/grid.png");

	// Cube texture
	texture.addOption(Locale.cubeTexture, function()
	{
		var texture = new CubeTexture([Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage, Editor.defaultImage]);
		texture.name = "cube";
		Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
	}, Global.FILE_PATH + "icons/misc/cube.png");

	// Canvas texture
	texture.addOption(Locale.canvasTexture, function()
	{
		var texture = new CanvasTexture(512, 512);
		texture.placeholder();
		texture.name = "canvas";
		Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
	}, Global.FILE_PATH + "icons/misc/canvas.png");

	// Video texture
	texture.addOption(Locale.videoTexture, function()
	{
		FileSystem.chooseFile(function(files)
		{
			for(var i = 0; i < files.length; i++)
			{
				Loaders.loadVideoTexture(files[i]);
			}
		}, "video/*");
	}, Global.FILE_PATH + "icons/misc/video.png");

	// Webcam texture
	texture.addOption(Locale.webcamTexture, function()
	{
		var texture = new WebcamTexture();
		texture.name = "webcam";
		Editor.addAction(new AddResourceAction(texture, Editor.program, "textures"));
	}, Global.FILE_PATH + "icons/hw/webcam.png");

	texture.updateInterface();

	// Material
	var material = new DropdownMenu(this);
	material.setText(Locale.material);
	material.size.set(100, 25);
	material.position.set(200, 0);
	
	material.addOption(Locale.standardMaterial, function()
	{
		var material = new MeshStandardMaterial();
		material.name = "standard";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/material.png");

	material.addOption(Locale.physicalMaterial, function()
	{
		var material = new MeshPhysicalMaterial();
		material.name = "physical";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/material.png");

	material.addOption(Locale.phongMaterial, function()
	{
		var material = new MeshPhongMaterial();
		material.name = "phong";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/material.png");
	
	material.addOption(Locale.basicMaterial, function()
	{
		var material = new MeshBasicMaterial();
		material.name = "basic";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/material.png");

	material.addOption(Locale.toonMaterial, function()
	{
		var material = new MeshToonMaterial();
		material.name = "toon";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/material.png");

	material.addOption(Locale.lambertMaterial, function()
	{
		var material = new MeshLambertMaterial();
		material.name = "lambert";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/material.png");

	material.addOption(Locale.matcapMaterial, function()
	{
		var material = new MeshMatcapMaterial();
		material.name = "matcap";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/material.png");

	material.addOption(Locale.spriteMaterial, function()
	{
		var material = new SpriteMaterial({color: 0xFFFFFF});
		material.name = "sprite";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/image.png");

	material.addOption(Locale.pointsMaterial, function()
	{
		var material = new PointsMaterial();
		material.name = "points";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/models/points.png");

	material.addOption(Locale.lineMaterial, function()
	{
		var material = new LineBasicMaterial();
		material.name = "line";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/nodes.png");

	material.addOption(Locale.lineDashedMaterial, function()
	{
		var material = new LineDashedMaterial();
		material.name = "line";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/nodes.png");

	material.addOption(Locale.shaderMaterial, function()
	{
		var material = new ShaderMaterial(
		{
			vertexShader: "void main()\n{\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
			fragmentShader: "void main()\n{\n\tgl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n}"
		});
		material.name = "shader";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/script/script.png");

	material.addOption(Locale.rawShaderMaterial, function()
	{
		var material = new RawShaderMaterial();
		material.name = "rawshader";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/script/script.png");


	var others = material.addMenu(Locale.more);

	others.addOption(Locale.normalMaterial, function()
	{
		var material = new MeshNormalMaterial();
		material.name = "normal";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/material.png");
	
	others.addOption(Locale.depthMaterial, function()
	{
		var material = new MeshDepthMaterial();
		material.name = "depth";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/material.png");

	others.addOption(Locale.distanceMaterial, function()
	{
		var material = new MeshDistanceMaterial();
		material.name = "distance";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/material.png");

	others.addOption(Locale.shadowMaterial, function()
	{
		var material = new ShadowMaterial();
		material.name = "shadow";
		Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
	}, Global.FILE_PATH + "icons/misc/material.png");

	material.updateInterface();

	// Create menu
	var create = new DropdownMenu(this);
	create.setText(Locale.code);
	create.size.set(100, 25);
	create.position.set(300, 0);
	
	create.addOption(Locale.html, function()
	{
		var resource = new TextFile("<!DOCTYPE html>\n<html>\n<head>\n\t<title></title>\n</head>\n<body>\n\n</body>\n</html>", "html");
		resource.name = "html";
		Editor.addAction(new AddResourceAction(resource, Editor.program, "resources"));
	}, Global.FILE_PATH + "icons/script/script.png");

	create.addOption(Locale.javascript, function()
	{
		var resource = new TextFile("", "js");
		resource.name = "js";
		Editor.addAction(new AddResourceAction(resource, Editor.program, "resources"));
	}, Global.FILE_PATH + "icons/script/script.png");

	create.updateInterface();
}

AssetExplorerMenu.prototype = Object.create(Component.prototype);
export {AssetExplorerMenu};