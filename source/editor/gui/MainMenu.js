import {UnitConverter} from "../../../core/utils/UnitConverter.js";
import {Texture} from "../../../core/texture/Texture.js";
import {Image} from "../../../core/resources/Image.js";
import {Script} from "../../../core/objects/script/Script.js";
import {Scene} from "../../../core/objects/Scene.js";
import {Program} from "../../../core/objects/Program.js";
import {Mesh} from "../../../core/objects/mesh/Mesh.js";
import {Nunu} from "../../../core/Nunu.js";
import {ObjectLoader} from "../../../core/loaders/ObjectLoader.js";
import {TwistModifier} from "../../../core/geometries/modifiers/TwistModifier.js";
import {FileSystem} from "../../../core/FileSystem.js";
import {Settings} from "../../Settings.js";
import {RemoveAction} from "../../history/action/objects/RemoveAction.js";
import {AddAction} from "../../history/action/objects/AddAction.js";
import {ChangeAction} from "../../history/action/ChangeAction.js";
import {ActionBundle} from "../../history/action/ActionBundle.js";
import {Action} from "../../history/action/Action.js";
import {SettingsTab} from "../tab/settings/SettingsTab.js";
import {AboutTab} from "../tab/AboutTab.js";
import {Interface} from "../Interface.js";
import {Exporters} from "../../Exporters.js";
import {Editor} from "../../Editor.js";
import {Text} from "../../components/Text.js";
import {DropdownMenu} from "../../components/dropdown/DropdownMenu.js";
import {Component} from "../../components/Component.js";
import {ButtonText} from "../../components/buttons/ButtonText.js";
import {Button} from "../../components/buttons/Button.js";
import {StaticPair} from "pson";
import {OBJExporter, GLTFExporter, DRACOExporter, ColladaExporter, PLYExporter, STLExporter, BufferGeometry, Geometry, SimplifyModifier, SubdivisionModifier} from "three";

/**
 * Main menu of the application is displayed on top of the window, contains all global operations that can be applied to the project.
 *
 * Its also used to load, save project, and access editor related features.
 *
 * @class MainMenu
 * @extends {Component}
 */
function MainMenu(parent)
{
	Component.call(this, parent, "div");

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = "var(--bar-color)";
	this.element.style.top = "0px";
	this.element.style.left = "0px";
	this.element.style.width = "100%";
	this.element.style.height = "25px";

	this.size.set(0, 25);

	this.preventDragEvents();

	// Editor Logo
	var logo = document.createElement("img");
	logo.style.display = "block";
	logo.style.position = "absolute";
	logo.style.pointerEvents = "none";
	logo.style.width = "108px";
	logo.style.height = "18px";
	logo.style.top = "3px";
	logo.style.right = "3px";
	logo.src = Global.FILE_PATH + "logo.png";
	this.element.appendChild(logo);

	// File
	var fileMenu = new DropdownMenu(this);
	fileMenu.setText(Locale.file);
	fileMenu.size.set(120, this.size.y);
	fileMenu.position.set(0, 0);

	// New project
	fileMenu.addOption(Locale.new, function()
	{
		Editor.gui.newProgram();
	}, Global.FILE_PATH + "icons/misc/new.png");

	// Save project
	fileMenu.addOption(Locale.save, function()
	{
		if(Editor.openFile !== null)
		{
			Editor.saveProgram(undefined, true);
		}
		else
		{
			Editor.gui.saveProgram();
		}
	}, Global.FILE_PATH + "icons/misc/save.png");

	// Save project
	fileMenu.addOption(Locale.saveAs, function()
	{
		Editor.gui.saveProgram();
	}, Global.FILE_PATH + "icons/misc/save.png").setAltText("CTRL+S");

	// Save readable legacy format
	if(Nunu.developmentMode() && Nunu.runningOnDesktop())
	{
		fileMenu.addOption("Save ISP", function()
		{
			FileSystem.chooseFile(function(files)
			{
				Editor.saveProgram(files[0].path, false, true);
			}, ".isp", true);
		}, Global.FILE_PATH + "icons/misc/save.png");
	}

	// Load Project
	fileMenu.addOption(Locale.load, function()
	{
		Editor.gui.loadProgram();
	}, Global.FILE_PATH + "icons/misc/load.png").setAltText("CTRL+L");

	// Settings
	fileMenu.addOption(Locale.settings, function()
	{
		var tab = Editor.gui.tab.getTab(SettingsTab);
		if(tab === null)
		{
			tab = Editor.gui.tab.addTab(SettingsTab, true);
		}
		tab.select();
	}, Global.FILE_PATH + "icons/misc/settings.png");

	// Publish
	var publish = fileMenu.addMenu(Locale.publish, Global.FILE_PATH + "icons/misc/publish.png");

	if(Nunu.runningOnDesktop())
	{
		// Publish web
		publish.addOption("Web", function()
		{
			FileSystem.chooseFile(function(files)
			{
				try
				{
					Exporters.exportWebProject(files[0].path);
					Editor.alert(Locale.projectExported);
				}
				catch(e)
				{
					Editor.alert(Locale.errorExportingProject + "\n(" + e + ")");
				}
			}, "", Editor.program.name);
		}, Global.FILE_PATH + "icons/platform/web.png");

		// Android
		if(Nunu.developmentMode())
		{
			var android = publish.addMenu("Android", Global.FILE_PATH + "icons/platform/android.png");

			android.addOption(Locale.run, function()
			{
				try
				{
					Exporters.exportAndroid(Exporters.ANDROID_RUN);
				}
				catch(e)
				{
					console.error("nunuStudio: Error exporting android project.", e);
					Editor.alert(Locale.errorExportingProject + "\n(" + e + ")");
				}
			});

			android.addOption("Unsigned APK", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Exporters.exportAndroid(Exporters.ANDROID_EXPORT_UNSIGNED, files[0].path);
					}
					catch(e)
					{
						console.error("nunuStudio: Error exporting android project.", e);
						Editor.alert(Locale.errorExportingProject + "\n(" + e + ")");
					}
				}, ".apk", Editor.program.name);
			});
		}

		if(Nunu.runningOnDesktop())
		{
			// Publish windows
			publish.addOption("Windows", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Exporters.exportWindows(files[0].path);
						Editor.alert(Locale.projectExported);
					}
					catch(e)
					{
						console.error("nunuStudio: Error exporting windows project.", e);
						Editor.alert(Locale.errorExportingProject + "\n(" + e + ")");
					}
				}, "", Editor.program.name);
			}, Global.FILE_PATH + "icons/platform/windows.png");

			// Publish linux
			publish.addOption("Linux", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Exporters.exportLinux(files[0].path);
						Editor.alert(Locale.projectExported);
					}
					catch(e)
					{
						console.error("nunuStudio: Error exporting linux project.", e);
						Editor.alert(Locale.errorExportingProject + "\n(" + e + ")");
					}
				}, "", Editor.program.name);
			}, Global.FILE_PATH + "icons/platform/linux.png");
	

			// Publish macos
			publish.addOption("macOS", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						Exporters.exportMacOS(files[0].path);
						Editor.alert(Locale.projectExported);
					}
					catch(e)
					{
						console.error("nunuStudio: Error exporting macOS project.", e);
						Editor.alert(Locale.errorExportingProject + "\n(" + e + ")");
					}
				}, "", Editor.program.name);
			}, Global.FILE_PATH + "icons/platform/osx.png");
		}
	}
	// Running on web browser
	else
	{
		publish.addOption("Web", function()
		{
			FileSystem.chooseFileName(function(fname)
			{
				try
				{
					Exporters.exportWebProjectZip(fname);
					Editor.alert(Locale.projectExported);
				}
				catch(e)
				{
					console.error("nunuStudio: Error exporting web project.", e);
					Editor.alert(Locale.errorExportingProject + "\n(" + e + ")");
				}
			}, ".zip");
		}, Global.FILE_PATH + "icons/platform/web.png");
	}

	// Import
	fileMenu.addOption(Locale.import, function()
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
					if(" + Locale.binary + ")
					{
						var pson = new StaticPair();
						var data = pson.decode(reader.result);
						var program = loader.parse(data);
					}
					else
					{
						var program = loader.parse(JSON.parse(reader.result));
					}

					var actions = [];

					for(var i = 0; i < program.children.length; i++)
					{
						actions.push(new AddAction(program.children[i], Editor.program));
					}

					Editor.addAction(new ActionBundle(actions));
				};

				if(" + Locale.binary + ")
				{
					reader.readAsArrayBuffer(file);
				}
				else
				{
					reader.readAsText(file);
				}
			}
		}, ".isp, .nsp");

	}, Global.FILE_PATH + "icons/misc/import.png");

	// Export menu
	var exportMenu = fileMenu.addMenu(Locale.export, Global.FILE_PATH + "icons/misc/export.png");

	// Export OBJ
	exportMenu.addOption("OBJ", function()
	{	
		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new OBJExporter();
			var data = exporter.parse(Editor.getScene());
			FileSystem.writeFile(fname, data);
		}, ".obj");

	}, Global.FILE_PATH + "icons/misc/scene.png");

	// Export GLTF
	exportMenu.addOption("GLTF", function()
	{
		var onlyVisible = Editor.confirm(Locale.exportOnlyVisibleObjects);

		var config = 
		{
			onlyVisible: onlyVisible,
			binary: false,
			forceIndices: true,
			embedImages: true,
			forcePowerOfTwoTextures: false
		};

		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new GLTFExporter();
			exporter.parse(Editor.getScene(), function(result)
			{
				FileSystem.writeFile(fname, JSON.stringify(result, null, "\t"));
			}, config);
		}, ".gltf");
	}, Global.FILE_PATH + "icons/gltf.png");

	// Export GLB
	exportMenu.addOption("GLB", function()
	{	
		var onlyVisible = Editor.confirm(Locale.exportOnlyVisibleObjects);

		var config = 
		{
			onlyVisible: onlyVisible,
			binary: true,
			forceIndices: true,
			embedImages: true,
			forcePowerOfTwoTextures: false
		};

		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new GLTFExporter();
			exporter.parse(Editor.getScene(), function(result)
			{
				FileSystem.writeFileArrayBuffer(fname, result);
			}, config);
		}, ".glb");
	}, Global.FILE_PATH + "icons/gltf.png");

	// Export Google Draco
	exportMenu.addOption("Draco", function()
	{
		if(Editor.selection.length === 0 || Editor.selection[0].geometry === undefined)
		{
			Editor.alert(Locale.needsObjectGeometry);
			return;
		}

		var geometry = Editor.selection[0].geometry;
		var exporter = new DRACOExporter();

		FileSystem.chooseFileWrite(function(fname)
		{
			var arraybuffer = exporter.parse(geometry);
			FileSystem.writeFileArrayBuffer(fname, arraybuffer);
		}, ".drc");
	}, Global.FILE_PATH + "icons/misc/scene.png");

	// Auxiliar method to export collada files
	function exportCollada(fname, config)
	{
		var path = FileSystem.getFilePath(fname);

		var exporter = new ColladaExporter();
		exporter.parse(Editor.program, function(result)
		{
			for(var i = 0; i < result.textures.length; i++)
			{
				var texture = result.textures[i];
				FileSystem.writeFileArrayBuffer(path + texture.name + "." + texture.ext, texture.data.buffer);
			}

			FileSystem.writeFile(fname, result.data);
		}, config);
	}

	// Export Collada
	exportMenu.addOption("Collada V1.4.1", function()
	{
		var config =
		{
			version: "1.4.1",
			binary: true,
			textureDirectory: ""
		};

		FileSystem.chooseFileWrite(function(fname)
		{
			exportCollada(fname, config);
		}, ".dae");

	}, Global.FILE_PATH + "icons/misc/scene.png");

	exportMenu.addOption("Collada V1.5", function()
	{
		var config =
		{
			version: "1.5.0",
			binary: true,
			textureDirectory: ""
		};

		FileSystem.chooseFileWrite(function(fname)
		{
			exportCollada(fname, config);
		}, ".dae");

	}, Global.FILE_PATH + "icons/misc/scene.png");

	// Export PLY
	exportMenu.addOption("PLY", function()
	{
		var config = {binary: false};
		
		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new PLYExporter();
			exporter.parse(Editor.getScene(), function(result)
			{
				FileSystem.writeFile(fname, result);
			}, config);
		}, ".ply");
	}, Global.FILE_PATH + "icons/misc/scene.png");


	exportMenu.addOption("PLY (" + Locale.binary + ")", function()
	{
		var config = {binary: true};

		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new PLYExporter();
			exporter.parse(Editor.getScene(), function(result)
			{
				FileSystem.writeFileArrayBuffer(fname, result);
			}, config);
		}, ".ply");
	}, Global.FILE_PATH + "icons/misc/scene.png");


	// Export STL
	exportMenu.addOption("STL", function()
	{
		var config = {binary: false};

		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new STLExporter();
			var data = exporter.parse(Editor.program, config);
			FileSystem.writeFile(fname, data);
		}, ".stl");
	}, Global.FILE_PATH + "icons/misc/scene.png");

	// Export Binary STL
	exportMenu.addOption("STL (" + Locale.binary + ")", function()
	{	
		var config = {binary: true};

		FileSystem.chooseFileWrite(function(fname)
		{
			var exporter = new STLExporter();
			var data = exporter.parse(Editor.program, config);
			FileSystem.writeFileArrayBuffer(fname, data.buffer);
		}, ".stl");
	}, Global.FILE_PATH + "icons/misc/scene.png");

	// Exit
	if(Nunu.runningOnDesktop())
	{
		fileMenu.addOption(Locale.exit, function()
		{
			if(Editor.confirm(Locale.unsavedChangesExit))
			{
				Editor.exit();
			}
		}, Global.FILE_PATH + "icons/misc/exit.png");
	}

	fileMenu.updateInterface();

	// Editor
	var editMenu = new DropdownMenu(this); editMenu.setText("Edit");
	editMenu.size.set(100, this.size.y);
	editMenu.position.set(120,0);

	editMenu.addOption(Locale.undo, function()
	{
		Editor.undo();
	}, Global.FILE_PATH + "icons/misc/undo.png");

	editMenu.addOption(Locale.redo, function()
	{
		Editor.redo();
	}, Global.FILE_PATH + "icons/misc/redo.png");

	editMenu.addOption(Locale.copy, function()
	{
		Editor.copyObject();
	}, Global.FILE_PATH + "icons/misc/copy.png");
	
	editMenu.addOption(Locale.cut, function()
	{
		Editor.cutObject();
	}, Global.FILE_PATH + "icons/misc/cut.png");

	editMenu.addOption(Locale.paste, function()
	{
		Editor.pasteObject();
	}, Global.FILE_PATH + "icons/misc/paste.png");

	editMenu.addOption(Locale.delete, function()
	{
		if(Editor.hasObjectSelected())
		{
			var del = Editor.confirm(Locale.deleteObjects);
			if(del)
			{
				Editor.deleteObject();
			}
		}
	}, Global.FILE_PATH + "icons/misc/delete.png");

	var csg = editMenu.addMenu(Locale.csg, Global.FILE_PATH + "icons/models/figures.png");

	// Create BSP for CSG operation
	function createBSP(object)
	{
		var geometry = object.geometry;

		if(geometry instanceof BufferGeometry)
		{
			geometry = new Geometry().fromBufferGeometry(geometry);
		}
		else
		{
			geometry = geometry.clone();
		}
		
		geometry.applyMatrix4(object.matrixWorld);

		return new ThreeBSP(geometry);
	}

	// Verify is CSG operation is possible
	function verifyCSG()
	{
		if(Editor.selection.length < 2)
		{
			Editor.alert(Locale.needsTwoObjects);
			return false;
		}

		for(var i = 0; i < 2; i++)
		{
			if(Editor.selection[i].geometry === undefined)
			{
				Editor.alert(Locale.needsTwoObjectGeometry);
				return false;
			}
		}

		return true;
	}

	// Create CSG action
	function createCSGAction(mesh, a, b)
	{
		mesh.material = Editor.defaultMaterial;
		mesh.name = a.name;

		var actions = [];
		actions.push(new RemoveAction(a));
		actions.push(new RemoveAction(b));
		actions.push(new AddAction(mesh, a.getScene()));

		Editor.addAction(new ActionBundle(actions));
	}

	csg.addOption(Locale.intersect, function()
	{
		if(verifyCSG())
		{
			var a = createBSP(Editor.selection[0]);
			var b = createBSP(Editor.selection[1]);

			createCSGAction(a.intersect(b).toMesh(), Editor.selection[0], Editor.selection[1]);
		}
	}, Global.FILE_PATH + "icons/misc/intersect.png");

	csg.addOption(Locale.subtract, function()
	{
		if(verifyCSG())
		{
			var a = createBSP(Editor.selection[0]);
			var b = createBSP(Editor.selection[1]);

			createCSGAction(a.subtract(b).toMesh(), Editor.selection[0], Editor.selection[1]);
		}
	}, Global.FILE_PATH + "icons/misc/subtract.png");

	csg.addOption(Locale.union, function()
	{
		if(verifyCSG())
		{
			var a = createBSP(Editor.selection[0]);
			var b = createBSP(Editor.selection[1]);

			createCSGAction(a.union(b).toMesh(), Editor.selection[0], Editor.selection[1]);
		}
	}, Global.FILE_PATH + "icons/misc/union.png");

	var modifiers = editMenu.addMenu(Locale.modifiers, Global.FILE_PATH + "icons/models/figures.png");

	modifiers.addOption(Locale.simplify, function()
	{
		if(Editor.selection.length < 1 || Editor.selection[0].geometry === undefined)
		{
			Editor.alert(Locale.needsObjectGeometry);
			return;
		}

		var simplifier = new SimplifyModifier();

		var level = parseFloat(Editor.prompt("Simplification level in %")) / 100;
		if(isNaN(level) || level > 100 || level < 0)
		{
			Editor.alert("Level has to be a numeric value");
			return;
		}

		var original = Editor.selection[0].geometry;

		if(original instanceof BufferGeometry)
		{
			var vertices = original.getAttribute("position").array.length / 3;
		}
		else
		{
			var vertices = original.vertices.length;
		}

		var geometry = simplifier.modify(original, Math.ceil(vertices * level));
		var mesh = new Mesh(geometry, Editor.defaultMaterial);
		Editor.addObject(mesh);

		Editor.alert("Reduced from " + vertices + " to " + Math.ceil(vertices * level) + " vertex.");

	}, Global.FILE_PATH + "icons/models/triangle.png");

	modifiers.addOption(Locale.subdivide, function()
	{
		if(Editor.selection.length < 1 || Editor.selection[0].geometry === undefined)
		{
			Editor.alert(Locale.needsObjectGeometry);
			return;
		}

		var modifier = new SubdivisionModifier();
		var geometry = modifier.modify(Editor.selection[0].geometry);
		var mesh = new Mesh(geometry, Editor.defaultMaterial);
		Editor.addObject(mesh);
	}, Global.FILE_PATH + "icons/misc/subdivide.png");

	modifiers.addOption(Locale.twist, function()
	{
		if(Editor.selection.length < 1 || Editor.selection[0].geometry === undefined)
		{
			Editor.alert(Locale.needsObjectGeometry);
			return;
		}

		var angle = parseFloat(Editor.prompt("Twist angle", UnitConverter.convert(Math.PI / 2, "r", Editor.settings.units.angle)));
		if(isNaN(angle) || angle < 0)
		{
			Editor.alert("Twist amount has to be a numeric value");
			return;
		}

		// Convert back to radians if necessary
		angle = UnitConverter.convert(angle, Editor.settings.units.angle, "r");


		var start = parseFloat(Editor.prompt("Start Point", 0));
		var end = parseFloat(Editor.prompt("End Point", 1));
		if(isNaN(start) || isNaN(end))
		{
			Editor.alert("Start and end has to be a numeric value");
			return;
		}

		var modifier = new TwistModifier(angle, start, end);
		var geometry = modifier.modify(Editor.selection[0].geometry);
		var mesh = new Mesh(geometry, Editor.defaultMaterial);
		Editor.addObject(mesh);
	}, Global.FILE_PATH + "icons/models/twist.png");

	// Compute mesh normals
	editMenu.addOption(Locale.computeNormals, function()
	{
		if(Editor.selection.length < 1)
		{
			Editor.alert(Locale.needsObjectMesh);
			return;
		}

		var geometry = Editor.selection[0].geometry.clone();
		geometry.computeVertexNormals();
		Editor.addAction(new ChangeAction(Editor.selection[0], "geometry", geometry));
	}, Global.FILE_PATH + "icons/misc/probe.png");

	// Apply tranformation
	editMenu.addOption(Locale.applyTransformation, function()
	{
		if(Editor.selection.length < 1)
		{
			Editor.alert(Locale.needsObjectMesh);
			return;
		}

		var obj = Editor.selection[0];
		obj.geometry.applyMatrix4(obj.matrixWorld);
		obj.position.set(0, 0, 0);
		obj.scale.set(1, 1, 1);
		obj.rotation.set(0, 0, 0);

	}, Global.FILE_PATH + "icons/tools/move.png");

	// Merge geometries
	editMenu.addOption(Locale.mergeGeometries, function()
	{
		if(Editor.selection.length < 2)
		{
			Editor.alert(Locale.needsTwoObjectMesh);
			return;
		}

		var geometry = new Geometry();

		for(var i = 0; i < Editor.selection.length; i++)
		{	
			var obj = Editor.selection[i];
			if(obj.geometry !== undefined)
			{
				// Convert to geometry and merge
				if(obj.geometry instanceof BufferGeometry)
				{
					var converted = new Geometry();
					converted.fromBufferGeometry(obj.geometry);
					geometry.merge(converted, obj.matrixWorld)
				}
				// Merge geometry
				else
				{
					geometry.merge(obj.geometry, obj.matrixWorld)
				}
			}
		}

		var mesh = new Mesh(geometry, Editor.defaultMaterial);
		mesh.name = "merged";
		Editor.addObject(mesh);

	}, Global.FILE_PATH + "icons/misc/union.png");

	editMenu.updateInterface();

	// Project
	var projectMenu = new DropdownMenu(this);
	projectMenu.setText(Locale.project);
	projectMenu.size.set(100, this.size.y);
	projectMenu.position.set(220,0);

	projectMenu.addOption(Locale.createScene, function()
	{
		Editor.addDefaultScene();
	}, Global.FILE_PATH + "icons/misc/add.png");

	projectMenu.addOption(Locale.executeScript, function()
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
	}, Global.FILE_PATH + "icons/script/script.png");

	projectMenu.updateInterface();

	// About
	var about = new ButtonText(this);
	about.setText(Locale.about);
	about.size.set(100, this.size.y);
	about.position.set(320, 0);
	about.updateInterface();
	about.setOnClick(function()
	{
		var tab = Editor.gui.tab.getTab(AboutTab);
		if(tab === null)
		{
			tab = Editor.gui.tab.addTab(AboutTab, true);
		}
		tab.select();
	});

	// Run
	this.run = new ButtonText(this);
	this.run.setText(Locale.run);
	this.run.size.set(100, this.size.y);
	this.run.position.set(420, 0);
	this.run.updateInterface();
	this.run.setOnClick(function()
	{
		Editor.runProject();
	});
}

MainMenu.prototype = Object.create(Component.prototype);

MainMenu.prototype.updateInterface = function()
{
	this.updateVisibility();
};

export {MainMenu};