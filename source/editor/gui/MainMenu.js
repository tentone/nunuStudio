import {StaticPair} from "@as-com/pson";
import {BufferGeometry, Geometry} from "three";
import {SimplifyModifier} from "three/examples/jsm/modifiers/SimplifyModifier";
import {SubdivisionModifier} from "three/examples/jsm/modifiers/SubdivisionModifier";
import {Locale} from "../locale/LocaleManager.js";
import {UnitConverter} from "../../core/utils/UnitConverter.js";
import {Mesh} from "../../core/objects/mesh/Mesh.js";
import {Nunu} from "../../core/Nunu.js";
import {ObjectLoader} from "../../core/loaders/ObjectLoader.js";
import {TwistModifier} from "../../core/geometries/modifiers/TwistModifier.js";
import {FileSystem} from "../../core/FileSystem.js";
import {RemoveAction} from "../history/action/objects/RemoveAction.js";
import {AddAction} from "../history/action/objects/AddAction.js";
import {ChangeAction} from "../history/action/ChangeAction.js";
import {ActionBundle} from "../history/action/ActionBundle.js";
import {Global} from "../Global.js";
import {ProjectExporters} from "../ProjectExporters.js";
import {Editor} from "../Editor.js";
import {DropdownMenu} from "../components/dropdown/DropdownMenu.js";
import {Component} from "../components/Component.js";
import {ButtonText} from "../components/buttons/ButtonText.js";
import {ThreeBSP} from "../../core/utils/ThreeBSP.js";
import {Exporters} from "../Exporters.js";
import {AboutTab} from "./tab/about/AboutTab.js";
import {SettingsTab} from "./tab/settings/SettingsTab.js";

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
		if (Editor.openFile !== null)
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

	// Save project to folder
	if (DEVELOPMENT)
	{
		fileMenu.addOption(Locale.saveTo, function()
		{
			FileSystem.chooseDirectory(function(path)
			{
				// TODO <REMOVE THIS>
				console.log(path);

				Editor.saveProgramDirectory(path);
			}, "directory");
		}, Global.FILE_PATH + "icons/misc/save.png");
	}

	// Save readable legacy format
	if (DEVELOPMENT && Nunu.runningOnDesktop())
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
		if (tab === null)
		{
			tab = Editor.gui.tab.addTab(SettingsTab, true);
		}
		tab.select();
	}, Global.FILE_PATH + "icons/misc/settings.png");

	// Publish
	var publish = fileMenu.addMenu(Locale.publish, Global.FILE_PATH + "icons/misc/publish.png");

	if (Nunu.runningOnDesktop())
	{
		// Publish web
		publish.addOption("Web", function()
		{
			FileSystem.chooseFile(function(files)
			{
				try
				{
					ProjectExporters.exportWebProject(files[0].path);
					Editor.alert(Locale.projectExported);
				}
				catch (e)
				{
					Editor.alert(Locale.errorExportingProject + "\n(" + e + ")");
				}
			}, "", Editor.program.name);
		}, Global.FILE_PATH + "icons/platform/web.png");

		// Android
		if (DEVELOPMENT)
		{
			var android = publish.addMenu("Android", Global.FILE_PATH + "icons/platform/android.png");

			android.addOption(Locale.run, function()
			{
				try
				{
					ProjectExporters.exportAndroid(ProjectExporters.ANDROID_RUN);
				}
				catch (e)
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
						ProjectExporters.exportAndroid(ProjectExporters.ANDROID_EXPORT_UNSIGNED, files[0].path);
					}
					catch (e)
					{
						console.error("nunuStudio: Error exporting android project.", e);
						Editor.alert(Locale.errorExportingProject + "\n(" + e + ")");
					}
				}, ".apk", Editor.program.name);
			});
		}

		if (Nunu.runningOnDesktop())
		{
			// Publish windows
			publish.addOption("Windows", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						ProjectExporters.exportWindows(files[0].path);
						Editor.alert(Locale.projectExported);
					}
					catch (e)
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
						ProjectExporters.exportLinux(files[0].path);
						Editor.alert(Locale.projectExported);
					}
					catch (e)
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
						ProjectExporters.exportMacOS(files[0].path);
						Editor.alert(Locale.projectExported);
					}
					catch (e)
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
					ProjectExporters.exportWebProjectZip(fname);
					Editor.alert(Locale.projectExported);
				}
				catch (e)
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
			if (files.length > 0)
			{
				var file = files[0];
				var binary = FileSystem.getFileExtension(file.name) !== "isp";
				
				var loader = new ObjectLoader();
				var reader = new FileReader();

				reader.onload = function()
				{
					if (binary)
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

					for (var i = 0; i < program.children.length; i++)
					{
						actions.push(new AddAction(program.children[i], Editor.program));
					}

					Editor.addAction(new ActionBundle(actions));
				};

				if (binary)
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
		Exporters.exportOBJ(Editor.getScene());
	}, Global.FILE_PATH + "icons/misc/scene.png");

	// Export GLTF
	exportMenu.addOption("GLTF", function()
	{
		Exporters.exportGLTF(Editor.getScene(), false);
	}, Global.FILE_PATH + "icons/gltf.png");

	// Export GLB
	exportMenu.addOption("GLB", function()
	{	
		Exporters.exportGLTF(Editor.getScene(), true);
	}, Global.FILE_PATH + "icons/gltf.png");

	// Export Google Draco
	exportMenu.addOption("Draco", function()
	{
		if (Editor.selection.length === 0 || Editor.selection[0].geometry === undefined)
		{
			Editor.alert(Locale.needsObjectGeometry);
			return;
		}

		Exporters.exportDraco(Editor.selection[0]);

	}, Global.FILE_PATH + "icons/misc/scene.png");

	// Export Collada
	exportMenu.addOption("Collada V1.4.1", function()
	{
		Exporters.exportCollada(Editor.program, "1.4.1");
	}, Global.FILE_PATH + "icons/misc/scene.png");

	exportMenu.addOption("Collada V1.5", function()
	{
		Exporters.exportCollada(Editor.program, "1.5.0");

	}, Global.FILE_PATH + "icons/misc/scene.png");

	// Export PLY
	exportMenu.addOption("PLY", function()
	{
		Exporters.exportPLY(Editor.getScene(), false);
	}, Global.FILE_PATH + "icons/misc/scene.png");

	exportMenu.addOption("PLY (" + Locale.binary + ")", function()
	{
		Exporters.exportPLY(Editor.getScene(), true);
	}, Global.FILE_PATH + "icons/misc/scene.png");

	// Export STL
	exportMenu.addOption("STL", function()
	{
		Exporters.exportSTL(Editor.program, false);
	}, Global.FILE_PATH + "icons/misc/scene.png");

	// Export Binary STL
	exportMenu.addOption("STL (" + Locale.binary + ")", function()
	{	
		Exporters.exportSTL(Editor.program, true);
	}, Global.FILE_PATH + "icons/misc/scene.png");

	// Exit
	if (Nunu.runningOnDesktop())
	{
		fileMenu.addOption(Locale.exit, function()
		{
			if (Editor.confirm(Locale.unsavedChangesExit))
			{
				Editor.exit();
			}
		}, Global.FILE_PATH + "icons/misc/exit.png");
	}

	fileMenu.updateInterface();

	// Editor
	var editMenu = new DropdownMenu(this); editMenu.setText("Edit");
	editMenu.size.set(100, this.size.y);
	editMenu.position.set(120, 0);

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
		if (Editor.hasObjectSelected())
		{
			var del = Editor.confirm(Locale.deleteObjects);
			if (del)
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

		if (geometry instanceof BufferGeometry)
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
		if (Editor.selection.length < 2)
		{
			Editor.alert(Locale.needsTwoObjects);
			return false;
		}

		for (var i = 0; i < 2; i++)
		{
			if (Editor.selection[i].geometry === undefined)
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
		if (verifyCSG())
		{
			var a = createBSP(Editor.selection[0]);
			var b = createBSP(Editor.selection[1]);

			createCSGAction(a.intersect(b).toMesh(), Editor.selection[0], Editor.selection[1]);
		}
	}, Global.FILE_PATH + "icons/misc/intersect.png");

	csg.addOption(Locale.subtract, function()
	{
		if (verifyCSG())
		{
			var a = createBSP(Editor.selection[0]);
			var b = createBSP(Editor.selection[1]);

			createCSGAction(a.subtract(b).toMesh(), Editor.selection[0], Editor.selection[1]);
		}
	}, Global.FILE_PATH + "icons/misc/subtract.png");

	csg.addOption(Locale.union, function()
	{
		if (verifyCSG())
		{
			var a = createBSP(Editor.selection[0]);
			var b = createBSP(Editor.selection[1]);

			createCSGAction(a.union(b).toMesh(), Editor.selection[0], Editor.selection[1]);
		}
	}, Global.FILE_PATH + "icons/misc/union.png");

	var modifiers = editMenu.addMenu(Locale.modifiers, Global.FILE_PATH + "icons/models/figures.png");

	modifiers.addOption(Locale.simplify, function()
	{
		if (Editor.selection.length < 1 || Editor.selection[0].geometry === undefined)
		{
			Editor.alert(Locale.needsObjectGeometry);
			return;
		}

		var simplifier = new SimplifyModifier();

		var level = parseFloat(Editor.prompt("Simplification level in %")) / 100;
		if (isNaN(level) || level > 100 || level < 0)
		{
			Editor.alert("Level has to be a numeric value");
			return;
		}

		var original = Editor.selection[0].geometry;

		if (original instanceof BufferGeometry)
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
		if (Editor.selection.length < 1 || Editor.selection[0].geometry === undefined)
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
		if (Editor.selection.length < 1 || Editor.selection[0].geometry === undefined)
		{
			Editor.alert(Locale.needsObjectGeometry);
			return;
		}

		var angle = parseFloat(Editor.prompt("Twist angle", UnitConverter.convert(Math.PI / 2, "r", Editor.settings.units.angle)));
		if (isNaN(angle) || angle < 0)
		{
			Editor.alert("Twist amount has to be a numeric value");
			return;
		}

		// Convert back to radians if necessary
		angle = UnitConverter.convert(angle, Editor.settings.units.angle, "r");


		var start = parseFloat(Editor.prompt("Start Point", 0));
		var end = parseFloat(Editor.prompt("End Point", 1));
		if (isNaN(start) || isNaN(end))
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
		if (Editor.selection.length < 1)
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
		if (Editor.selection.length < 1)
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
		if (Editor.selection.length < 2)
		{
			Editor.alert(Locale.needsTwoObjectMesh);
			return;
		}

		var geometry = new Geometry();

		for (var i = 0; i < Editor.selection.length; i++)
		{	
			var obj = Editor.selection[i];
			if (obj.geometry !== undefined)
			{
				// Convert to geometry and merge
				if (obj.geometry instanceof BufferGeometry)
				{
					var converted = new Geometry();
					converted.fromBufferGeometry(obj.geometry);
					geometry.merge(converted, obj.matrixWorld);
				}
				// Merge geometry
				else
				{
					geometry.merge(obj.geometry, obj.matrixWorld);
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
	projectMenu.position.set(220, 0);

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
				if (files.length > 0)
				{
					var code = FileSystem.readFile(files[0].path);
					var func = Function(code);
					func();
				}
			}
			catch (error)
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
		if (tab === null)
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
