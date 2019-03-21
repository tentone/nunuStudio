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
	
	Editor.exportCordovaProject("./temp/www");

	setTimeout(function()
	{
		//Android platform
		var output = system.execSync("cordova platform add android", {cwd:"./temp"}).toString();
		if(output.indexOf("Android project created") === -1)
		{
			console.error("nunuStudio: Failed to create cordova android project.");
		}

		//Send code to device
		if(mode === Editor.ANDROID_RUN)
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
		else if(mode === Editor.ANDROID_EXPORT_UNSIGNED)
		{
			var output = system.execSync("cordova build android", {cwd:"./temp"}).toString();
			if(output.indexOf("BUILD SUCCESSFUL") === -1)
			{
				console.error("nunuStudio: Failed to build android project.");
			}

			FileSystem.copyFile("./temp/platforms/android/app/build/outputs/apk/debug/app-debug.apk", outputPath);
		}
		//Export signed version
		else if(mode === Editor.ANDROID_EXPORT_SIGNED)
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
Editor.exportNWJSProject = function(dir)
{
	Editor.exportWebProject(dir + "/package.nw");
	FileSystem.writeFile(dir + "/package.nw/package.json", JSON.stringify(
	{
		name: Editor.program.name,
		main: "index.html",
		window:
		{
			frame: true
		}
	}));
};

/**
 * Export NWJS windows project.
 *
 * @method exportWindowsProject
 * @param {String} dir Output directory.
 */
Editor.exportWindows = function(dir)
{
	//TODO <HAS TO BE UPDATED TO USE NWJS FROM WEB>
	//FileSystem.copyFolder(Global.NWJS_PATH + "win", dir);
	//Editor.exportNWJSProject(dir);
};

Editor.canExportWindows = function()
{
	//return Nunu.runningOnDesktop() && FileSystem.fileExists(Global.NWJS_PATH + "win");
	return false;
};

/**
 * Export NWJS linux project.
 *
 * @method exportLinuxProject
 * @param {String} dir Output directory.
 */
Editor.exportLinux = function(dir)
{
	//TODO <HAS TO BE UPDATED TO USE NWJS FROM WEB>
	//FileSystem.copyFolder(Global.NWJS_PATH + "linux", dir);
	//Editor.exportNWJSProject(dir);
};

Editor.canExportLinux = function()
{
	//return Nunu.runningOnDesktop() && FileSystem.fileExists(Global.NWJS_PATH + "linux");
	return false;
};

/**
 * Export NWJS macOS project.
 *
 * @method exportMacOSProject
 * @param {String} dir Output directory.
 */
Editor.exportMacOS = function(dir)
{
	//TODO <HAS TO BE UPDATED TO USE NWJS FROM WEB>
	//FileSystem.copyFolder(Global.NWJS_PATH + "mac", dir);
	//Editor.exportNWJSProject(dir);
};

Editor.canExportMacOS = function()
{
	//return Nunu.runningOnDesktop() && FileSystem.fileExists(Global.NWJS_PATH + "mac");
	return false;
};