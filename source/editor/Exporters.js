"use strict";

Editor.ANDROID_RUN = 100;
Editor.ANDROID_EXPORT_UNSIGNED = 101;
Editor.ANDROID_EXPORT_SIGNED = 102;

/**
 * Export a android project using cordova.
 *
 * Cordova has to be installed from NPM globaly, it is run trough the command line.
 *
 * @method exportAndroid
 * @param {Number} mode The app can be just run on the device, or exported as a signed or unsigned apk.
 * @param {String} outputPath Path to stored the output apk file in case there is one to store.
 */
Editor.exportAndroid = function(mode, outputPath)
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


	if(FileSystem.fileExists("./temp/www"))
	{
		FileSystem.deleteFolder("./temp/www");
	}
	
	//Export nunu project
	Editor.exportCordovaProject("./temp/www");

	//Clean the temporary files created
	function cleanFiles()
	{
		if(FileSystem.fileExists("./temp"))
		{
			FileSystem.deleteFolder("./temp");
		}
	}

	setTimeout(function()
	{
		//Android platform project
		var output = system.execSync("cordova platform add android", {cwd:"./temp"}).toString();
		if(output.indexOf("Android project created") === -1)
		{
			console.error("nunuStudio: Failed to create cordova android project.");
		}

		//Check requirements
		output = system.execSync("cordova requirements", {cwd:"./temp"}).toString();

		if(output.indexOf("Java JDK: installed") === -1)
		{
			Editor.alert("Missing java JDK (get it at http://www.oracle.com/technetwork/java/javase/downloads/index.html)");
			console.error("nunuStudio: Missing java JDK (get it at http://www.oracle.com/technetwork/java/javase/downloads/index.html)");
			cleanFiles();
			return;
		}
		if(output.indexOf("Android SDK: installed true") === -1)
		{
			Editor.alert("Missing Android SDK (get it at https://developer.android.com/studio/)");
			console.error("nunuStudio: Missing Android SDK (get it at https://developer.android.com/studio/)");
			cleanFiles();
			return;
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

		//Send code to device
		if(mode === Editor.ANDROID_RUN)
		{
			//Build code
			output = system.execSync("cordova build android", {cwd:"./temp"}).toString();
			if(output.indexOf("SUCCESSFUL") === -1)
			{
				console.error("nunuStudio: Failed to build android project.");
				cleanFiles();
				return;
			}

			//Launch on device
			output = system.execSync("cordova run android", {cwd:"./temp"}).toString();
			if(output.indexOf("SUCCESS") === -1)
			{
				console.error("nunuStudio: Failed to launch android application on device.");
				cleanFiles();
				return;
			}
		}
		//Export test version
		else if(mode === Editor.ANDROID_EXPORT_UNSIGNED)
		{
			output = system.execSync("cordova build android", {cwd:"./temp"}).toString();
			if(output.indexOf("SUCCESSFUL") === -1)
			{
				console.error("nunuStudio: Failed to build android project.");
				cleanFiles();
				return;
			}

			FileSystem.copyFile("./temp/platforms/android/app/build/outputs/apk/debug/app-debug.apk", outputPath);
		}
		//Export signed version
		else if(mode === Editor.ANDROID_EXPORT_SIGNED)
		{
			output = system.execSync("cordova build android --release -- --keystore=\"..\\android.keystore\" --storePassword=android --alias=mykey", {cwd:"./temp"}).toString();
			if(output.indexOf("SUCCESSFUL") === -1)
			{
				console.error("nunuStudio: Failed to build android project.");
				cleanFiles();
				return;
			}

			//FileSystem.copyFile("./temp/platforms/android/app/build/outputs/apk/debug/app-debug.apk", outputPath);
		}

		cleanFiles();

		Editor.alert("Android project exported!");
	}, 100);
};

/**
 * Export a mobile ready web project to a folder.
 *
 * The mobile version of the runtime does not include any fullscreen and VR buttons, the application is run by default as fullscreen.
 *
 * @method exportCordovaProject
 * @param {String} dir Directory to export the project to.
 */
Editor.exportCordovaProject = function(dir)
{
	FileSystem.makeDirectory(dir);
	FileSystem.copyFile(Global.RUNTIME_PATH + "logo.png", dir + "/logo.png");
	FileSystem.copyFile(Global.RUNTIME_PATH + "cordova.html", dir + "/index.html");
	FileSystem.copyFile(FileSystem.fileExists("nunu.min.js") ? "nunu.min.js" : Global.BUILD_PATH, dir + "/nunu.min.js");
	Editor.saveProgram(dir + "/app.nsp", true, true, true);
};

/**
 * Export web project to a folder.
 *
 * Saves the project and exports the runtime to run the project.
 *
 * @method exportWebProject
 * @param {String} dir Directory to export the project to.
 */
Editor.exportWebProject = function(dir)
{
	FileSystem.makeDirectory(dir);
	FileSystem.copyFile(Global.RUNTIME_PATH + "vr.png", dir + "/vr.png");
	FileSystem.copyFile(Global.RUNTIME_PATH + "fullscreen.png", dir + "/fullscreen.png");
	FileSystem.copyFile(Global.RUNTIME_PATH + "logo.png", dir + "/logo.png");
	FileSystem.copyFile(Global.RUNTIME_PATH + "index.html", dir + "/index.html");
	FileSystem.copyFile(FileSystem.fileExists("nunu.min.js") ? "nunu.min.js" : Global.BUILD_PATH, dir + "/nunu.min.js");
	Editor.saveProgram(dir + "/app.nsp", true, true, true);
};

/**
 * Export web project as a zip package using JSZip.
 *
 * Used in the web version to export projects.
 *
 * @method exportWebProjectZip
 * @param {String} fname Name of the file.
 */
Editor.exportWebProjectZip = function(fname)
{
	var zip = new JSZip();
	zip.file("index.html", FileSystem.readFile(Global.RUNTIME_PATH + "index.html"));
	zip.file("nunu.min.js", FileSystem.readFile("nunu.min.js"));
	
	var pson = new dcodeIO.PSON.StaticPair();
	var data = pson.toArrayBuffer(Editor.program.toJSON());

	zip.file("app.nsp", Base64Utils.fromArraybuffer(data), {base64: true});
	zip.file("logo.png", FileSystem.readFileBase64(Global.RUNTIME_PATH + "logo.png"), {base64: true});
	zip.file("fullscreen.png", FileSystem.readFileBase64(Global.RUNTIME_PATH + "fullscreen.png"), {base64: true});
	zip.file("vr.png", FileSystem.readFileBase64(Global.RUNTIME_PATH + "vr.png"), {base64: true});

	zip.generateAsync({type:"blob"}).then(function(content)
	{
		var download = document.createElement("a");
		download.download = fname;
		download.href = window.URL.createObjectURL(content);
		download.style.display = "none";
		download.onclick = function()
		{
			document.body.removeChild(this);
		};
		document.body.appendChild(download);
		download.click();
	});
}

/**
 * Export a NWJS project folder.
 *
 * Only the runtime and javascript portion of the project.
 *
 * @method exportNWJSProject
 * @param {String} dir Output directory.
 */
Editor.exportNWJSProject = function(dir, target)
{
	// Export web project
	Editor.exportWebProject("./temp/");

	// Write package json with nwjs builder configuration
	FileSystem.writeFile("./temp/package.json", JSON.stringify(
	{
		name: Editor.program.name,
		description: Editor.program.description,
		author: Editor.program.author,
		main: "index.html",
		window:
		{
			frame: true
		},
		build:
		{
			output: dir,
			outputPattern: "${NAME}-${PLATFORM}-${ARCH}",
			packed: true,
			//targets: ["zip", "nsis7z"],
			win:
			{
				productName: Editor.program.name,
				companyName: Editor.program.author
			},
		}
	}));

	// Build directory
	var system = require("child_process");
	var output = system.execSync("build --mirror https://dl.nwjs.io/ --with-ffmpeg --tasks " + target + " ./temp");
};

/**
 * Export NWJS windows project.
 *
 * @method exportWindowsProject
 * @param {String} dir Output directory.
 */
Editor.exportWindows = function(dir)
{
	Editor.exportNWJSProject(dir, "win-x64");
};

Editor.canExportWindows = function()
{
	return Nunu.runningOnDesktop();
};

/**
 * Export NWJS linux project.
 *
 * @method exportLinuxProject
 * @param {String} dir Output directory.
 */
Editor.exportLinux = function(dir)
{
	Editor.exportNWJSProject(dir, "linux-x64");
};

Editor.canExportLinux = function()
{
	return Nunu.runningOnDesktop();
};

/**
 * Export NWJS macOS project.
 *
 * @method exportMacOSProject
 * @param {String} dir Output directory.
 */
Editor.exportMacOS = function(dir)
{
	Editor.exportNWJSProject(dir, "mac-x64");
};

Editor.canExportMacOS = function()
{
	return Nunu.runningOnDesktop();
};