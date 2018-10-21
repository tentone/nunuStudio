"use strict";

function MainMenu(parent)
{
	Element.call(this, parent, "div");

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = Editor.theme.barColor;
	this.element.style.top = "0px";
	this.element.style.left = "0px";
	this.element.style.width = "100%";
	this.element.style.height = "25px";

	this.size.set(0, 25);

	this.preventDragEvents();

	//Editor Logo
	var logo = document.createElement("img");
	logo.style.display = "block";
	logo.style.position = "absolute";
	logo.style.pointerEvents = "none";
	logo.style.width = "108px";
	logo.style.height = "18px";
	logo.style.top = "3px";
	logo.style.right = "3px";
	logo.src = Editor.filePath + "logo.png";
	this.element.appendChild(logo);

	//File
	var fileMenu = new DropdownMenu(this);
	fileMenu.setText("File");
	fileMenu.size.set(120, this.size.y);
	fileMenu.position.set(0, 0);

	//New project
	fileMenu.addOption("New", function()
	{
		Editor.gui.newProgram();
	}, Editor.filePath + "icons/misc/new.png");

	//Save project
	fileMenu.addOption("Save", function()
	{
		if(Editor.openFile !== null)
		{
			Editor.saveProgram(undefined, true);
		}
		else
		{
			Editor.gui.saveProgram();
		}
	}, Editor.filePath + "icons/misc/save.png");

	//Save project
	fileMenu.addOption("Save As", function()
	{
		Editor.gui.saveProgram();
	}, Editor.filePath + "icons/misc/save.png").setAltText("CTRL+S");

	//Save readable legacy format
	if(Nunu.developmentMode() && Nunu.runningOnDesktop())
	{
		fileMenu.addOption("Save ISP", function()
		{
			FileSystem.chooseFile(function(files)
			{
				Editor.saveProgram(files[0].path, false, true);
			}, ".isp", true);
		}, Editor.filePath + "icons/misc/save.png");
	}

	//Load Project
	fileMenu.addOption("Load", function()
	{
		Editor.gui.loadProgram();
	}, Editor.filePath + "icons/misc/load.png").setAltText("CTRL+L");

	//Settings
	fileMenu.addOption("Settings", function()
	{
		var tab = Editor.gui.tab.getTab(SettingsTab);
		if(tab === null)
		{
			tab = Editor.gui.tab.addTab(SettingsTab, true);
		}
		tab.select();
	}, Editor.filePath + "icons/misc/settings.png");

	//Publish
	var publish = fileMenu.addMenu("Publish", Editor.filePath + "icons/misc/publish.png");

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

		//Android
		if(Nunu.developmentMode())
		{
			var android = publish.addMenu("Android", Editor.filePath + "icons/platform/android.png");

			var RUN = 100;
			var EXPORT_UNSIGNED = 101;
			var EXPORT_SIGNED = 102;

			function exportCordovaProject(dir)
			{
				FileSystem.makeDirectory(dir);
				FileSystem.copyFile(Editor.runtimePath + "logo.png", dir + "/logo.png");
				FileSystem.copyFile(Editor.runtimePath + "cordova.html", dir + "/index.html");
				FileSystem.copyFile(FileSystem.fileExists("nunu.min.js") ? "nunu.min.js" : "../build/nunu.min.js", dir + "/nunu.min.js");
				Editor.saveProgram(dir + "/app.nsp", true, true, true);
			}

			function buildAndroid(mode, outputPath)
			{
				var system = require("child_process");
				var name = Editor.program.name !== "" ? Editor.program.name : "program";
				var author = Editor.program.author !== "" ? Editor.program.author : "nunustudio";
				var packageName = "com." + author + "." + name;

				//Delete old project data
				if(FileSystem.fileExists("./temp"))
				{
					FileSystem.deleteFolder("./temp");
				}

				//Create cordova project
				var output = system.execSync("cordova create temp " + packageName + " " + name).toString();
				if(output.indexOf("Creating") === -1)
				{
					console.error("nunuStudio: Failed to create cordova project.");
				}

				//Check requirements
				var output = system.execSync("cordova requirements", {cwd:"./temp"}).toString();
				if(output.indexOf("Java JDK: installed") === -1)
				{
					console.error("nunuStudio: Missing java JDK (get it at http://www.oracle.com/technetwork/java/javase/downloads/index.html)");
				}
				if(output.indexOf("Android SDK: installed true") === -1)
				{
					console.error("nunuStudio: Missing Android SDK (get it at https://developer.android.com/studio/)");
				}

				//Supported Android SDK versions
				/*
				var versions = output.split("android-");
				versions.shift();
				for(var i = 0; i < versions.length; i++)
				{
					versions[i] = Number.parseInt(versions[i])
				}
				*/

				//Export code
				if(FileSystem.fileExists("./temp/www"))
				{
					FileSystem.deleteFolder("./temp/www");
				}
				
				exportCordovaProject("./temp/www");

				setTimeout(function()
				{
					//Android platform
					var output = system.execSync("cordova platform add android", {cwd:"./temp"}).toString();
					if(output.indexOf("Android project created") === -1)
					{
						console.error("nunuStudio: Failed to create cordova android project.");
					}

					//Send code to device
					if(mode === RUN)
					{
						//Build code
						var output = system.execSync("cordova build android", {cwd:"./temp"}).toString();
						if(output.indexOf("BUILD SUCCESSFUL") === -1)
						{
							console.error("nunuStudio: Failed to build android project.");
						}

						//Launch on device
						var output = system.execSync("cordova run android", {cwd:"./temp"}).toString();
						if(output.indexOf("LAUNCH SUCCESS") === -1)
						{
							console.error("nunuStudio: Failed to launch android application on device.");
						}
					}
					//Export test version
					else if(mode === EXPORT_UNSIGNED)
					{
						var output = system.execSync("cordova build android", {cwd:"./temp"}).toString();
						if(output.indexOf("BUILD SUCCESSFUL") === -1)
						{
							console.error("nunuStudio: Failed to build android project.");
						}

						FileSystem.copyFile("./temp/platforms/android/app/build/outputs/apk/debug/app-debug.apk", outputPath);
					}
					//Export signed version
					else if(mode === EXPORT_SIGNED)
					{
						var output = system.execSync("cordova build android --release -- --keystore=\"..\\android.keystore\" --storePassword=android --alias=mykey", {cwd:"./temp"}).toString();
						if(output.indexOf("BUILD SUCCESSFUL") === -1)
						{
							console.error("nunuStudio: Failed to build android project.");
						}

						//FileSystem.copyFile("./temp/platforms/android/app/build/outputs/apk/debug/app-debug.apk", outputPath);
					}

					//Clean files created
					if(FileSystem.fileExists("./temp"))
					{
						FileSystem.deleteFolder("./temp");
					}

					Editor.alert("Android project exported!");
				}, 100);
			}

			android.addOption("Run on device", function()
			{
				try
				{
					buildAndroid(RUN);
				}
				catch(e)
				{
					Editor.alert("Error exporting project (" + e + ")");
				}
			});

			android.addOption("Unsigned APK", function()
			{
				FileSystem.chooseFile(function(files)
				{
					try
					{
						buildAndroid(EXPORT_UNSIGNED, files[0].path);
					}
					catch(e)
					{
						Editor.alert("Error exporting project (" + e + ")");
					}
				}, ".apk", Editor.program.name);
			});
		}

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
	fileMenu.addOption("Import", function()
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

					var actions = [];

					for(var i = 0; i < program.children.length; i++)
					{
						actions.push(new AddedAction(program.children[i], Editor.program));
					}

					Editor.addAction(new ActionBundle(actions));
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
	var exportMenu = fileMenu.addMenu("Export", Editor.filePath + "icons/misc/export.png");

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
					var exporter = new THREE.GLTFExporter();
					exporter.parse(Editor.program.scene, function(result)
					{
						var data = JSON.stringify(result, null, 2);
						FileSystem.writeFile(files[0].path, data);
					});
				}
			}, ".gltf", true);
		}
		else
		{
			FileSystem.chooseFileName(function(fname)
			{
				var exporter = new THREE.GLTFExporter();
				exporter.parse(Editor.program.scene, function(result)
				{
					var data = JSON.stringify(result, null, 2);
					FileSystem.writeFile(fname, data);
				})
			}, ".gltf");
		}
	}, Editor.filePath + "icons/gltf.png");

	//Export GLB
	exportMenu.addOption("GLB", function()
	{
		if(Nunu.runningOnDesktop())
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					var exporter = new THREE.GLTFExporter();
					exporter.parse(Editor.program.scene, function(result)
					{
						FileSystem.writeFileArrayBuffer(files[0].path, result);
					}, {binary: true, forceIndices: true, forcePowerOfTwoTextures: true});
				}
			}, ".glb", true);
		}
		else
		{
			FileSystem.chooseFileName(function(fname)
			{
				var exporter = new THREE.GLTFExporter();
				exporter.parse(Editor.program.scene, function(result)
				{
					FileSystem.writeFileArrayBuffer(fname, result);
				}, {binary: true, forceIndices: true, forcePowerOfTwoTextures: true});
			}, ".glb");
		}
	}, Editor.filePath + "icons/gltf.png");

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
					var exporter = new THREE.STLExporter();
					var data = exporter.parse(Editor.program, {binary: true});
					FileSystem.writeFileArrayBuffer(files[0].path, data.buffer);
				}
			}, ".stl", true);
		}
		else
		{
			FileSystem.chooseFileName(function(fname)
			{
				var exporter = new THREE.STLExporter();
				var data = exporter.parse(Editor.program, {binary: true});
				FileSystem.writeFileArrayBuffer(fname, data.buffer);
			}, ".stl");
		}
	}, Editor.filePath + "icons/misc/scene.png");

	//Exit
	if(Nunu.runningOnDesktop())
	{
		fileMenu.addOption("Exit", function()
		{
			if(Editor.confirm(Locale.unsavedChangesExit))
			{
				Editor.exit();
			}
		}, Editor.filePath + "icons/misc/exit.png");
	}

	fileMenu.updateInterface();

	//Editor
	var editMenu = new DropdownMenu(this); editMenu.setText("Edit");
	editMenu.size.set(100, this.size.y);
	editMenu.position.set(120,0);

	editMenu.addOption("Undo", function()
	{
		Editor.undo();
	}, Editor.filePath + "icons/misc/undo.png");

	editMenu.addOption("Redo", function()
	{
		Editor.redo();
	}, Editor.filePath + "icons/misc/redo.png");

	editMenu.addOption(Locale.copy, function()
	{
		Editor.copyObject();
	}, Editor.filePath + "icons/misc/copy.png");
	
	editMenu.addOption(Locale.cut, function()
	{
		Editor.cutObject();
	}, Editor.filePath + "icons/misc/cut.png");

	editMenu.addOption(Locale.paste, function()
	{
		Editor.pasteObject();
	}, Editor.filePath + "icons/misc/paste.png");

	editMenu.addOption(Locale.delete, function()
	{
		if(Editor.hasObjectSelected())
		{
			var del = Editor.confirm("Delete objects?");
			if(del)
			{
				Editor.deleteObject();
			}
		}
	}, Editor.filePath + "icons/misc/delete.png");

	var csg = editMenu.addMenu("CSG", Editor.filePath + "icons/models/figures.png");

	//Create BSP for CSG operation
	function createBSP(object)
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
	}

	//Verify is CSG operation is possible
	function verifyCSG()
	{
		if(Editor.selection.length < 2)
		{
			Editor.alert("Operation needs two objects");
			return false;
		}

		for(var i = 0; i < 2; i++)
		{
			if(Editor.selection[i].geometry === undefined)
			{
				Editor.alert("Operation needs two objects with geometries");
				return false;
			}
		}

		return true;
	}

	//Create CSG action
	function createCSGAction(mesh, a, b)
	{
		mesh.material = Editor.defaultMaterial;
		mesh.name = a.name;

		var actions = [];
		actions.push(new RemovedAction(a));
		actions.push(new RemovedAction(b));
		actions.push(new AddedAction(mesh, a.getScene()));

		Editor.addAction(new ActionBundle(actions));
	}

	csg.addOption("Intersect", function()
	{
		if(verifyCSG())
		{
			var a = createBSP(Editor.selection[0]);
			var b = createBSP(Editor.selection[1]);

			createCSGAction(a.intersect(b).toMesh(), Editor.selection[0], Editor.selection[1]);
		}
	}, Editor.filePath + "icons/misc/intersect.png");

	csg.addOption("Subtract", function()
	{
		if(verifyCSG())
		{
			var a = createBSP(Editor.selection[0]);
			var b = createBSP(Editor.selection[1]);

			createCSGAction(a.subtract(b).toMesh(), Editor.selection[0], Editor.selection[1]);
		}
	}, Editor.filePath + "icons/misc/subtract.png");

	csg.addOption("Union", function()
	{
		if(verifyCSG())
		{
			var a = createBSP(Editor.selection[0]);
			var b = createBSP(Editor.selection[1]);

			createCSGAction(a.union(b).toMesh(), Editor.selection[0], Editor.selection[1]);
		}
	}, Editor.filePath + "icons/misc/union.png");

	var modifiers = editMenu.addMenu("Modifiers", Editor.filePath + "icons/models/figures.png");

	modifiers.addOption("Simplify", function()
	{
		if(Editor.selection.length < 1 || Editor.selection[0].geometry === undefined)
		{
			Editor.alert("Operation needs a object with geometry");
			return;
		}

		var simplifier = new THREE.SimplifyModifier();

		var level = parseFloat(Editor.prompt("Simplification level in %")) / 100;

		if(isNaN(level) || level > 100 || level < 0)
		{
			Editor.alert("Level has to be a numeric value");
			return;
		}

		var original = Editor.selection[0].geometry;

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
		Editor.addObject(mesh);

		Editor.alert("Reduced from " + vertices + " to " + Math.ceil(vertices * level) + " vertex.");

	}, Editor.filePath + "icons/models/figures.png");

	modifiers.addOption("Subdivide", function()
	{
		if(Editor.selection.length < 1 || Editor.selection[0].geometry === undefined)
		{
			Editor.alert("Operation needs a object with geometry");
			return;
		}

		var modifier = new THREE.SubdivisionModifier();
		var geometry = modifier.modify(Editor.selection[0].geometry);
		var mesh = new Mesh(geometry, Editor.defaultMaterial);
		Editor.addObject(mesh);
	}, Editor.filePath + "icons/models/figures.png");

	//Compute mesh normals
	editMenu.addOption(Locale.computeNormals, function()
	{
		if(Editor.selection.length < 1)
		{
			Editor.alert("Operation needs a mesh object.");
			return;
		}

		Editor.selection[0].geometry.computeVertexNormals();

	}, Editor.filePath + "icons/misc/probe.png");

	//Apply tranformation
	editMenu.addOption(Locale.applyTransformation, function()
	{
		if(Editor.selection.length < 1)
		{
			Editor.alert("Operation needs a mesh object.");
			return;
		}

		var obj = Editor.selection[0];
		obj.geometry.applyMatrix(obj.matrixWorld);
		obj.position.set(0, 0, 0);
		obj.scale.set(1, 1, 1);
		obj.rotation.set(0, 0, 0);

	}, Editor.filePath + "icons/tools/move.png");

	//Merge geometries
	editMenu.addOption("Merge geometries", function()
	{
		if(Editor.selection.length < 2)
		{
			Editor.alert("Operation needs 2 mesh object.");
			return;
		}

		var geometry = new THREE.Geometry();

		for(var i = 0; i < Editor.selection.length; i++)
		{	
			var obj = Editor.selection[i];
			if(obj.geometry !== undefined)
			{
				//Convert to geometry and merge
				if(obj.geometry instanceof THREE.BufferGeometry)
				{
					var converted = new THREE.Geometry();
					converted.fromBufferGeometry(obj.geometry);
					geometry.merge(converted, obj.matrixWorld)
				}
				//Merge geometry
				else
				{
					geometry.merge(obj.geometry, obj.matrixWorld)
				}
			}
		}

		var mesh = new Mesh(geometry, Editor.defaultMaterial);
		mesh.name = "merged";
		Editor.addObject(mesh);

	}, Editor.filePath + "icons/misc/union.png");

	editMenu.updateInterface();

	//Project
	var projectMenu = new DropdownMenu(this);
	projectMenu.setText("Project");
	projectMenu.size.set(100, this.size.y);
	projectMenu.position.set(220,0);

	projectMenu.addOption(Locale.createScene, function()
	{
		Editor.addDefaultScene();
	}, Editor.filePath + "icons/misc/add.png");

	projectMenu.addOption("Execute script", function()
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

	projectMenu.updateInterface();

	//About
	var about = new ButtonText(this);
	about.setText("About");
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

	//Run
	this.run = new ButtonText(this);
	this.run.setText("Run");
	this.run.size.set(100, this.size.y);
	this.run.position.set(420, 0);
	this.run.updateInterface();
	this.run.setOnClick(function()
	{
		var tabs = Editor.gui.tab.getActiveTab();
		
		for(var i = 0; i < tabs.length; i++)
		{
			var tab = tabs[i];
		
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
		}
	});
}

MainMenu.prototype = Object.create(Element.prototype);

MainMenu.prototype.updateInterface = function()
{
	this.updateVisibility();
};
