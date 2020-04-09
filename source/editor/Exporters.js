"use strict";

Editor.ANDROID_RUN = 100;
Editor.ANDROID_EXPORT_UNSIGNED = 101;
Editor.ANDROID_EXPORT_SIGNED = 102;

/**
 * Editor temporary data folder, should be used for operations that require temporary file storage.
 *
 * Only available on desktop.
 *
 * @static
 * @attribute TEMP
 */
Editor.TEMP = "./temp";

/**
 * Clean the temporary files created under the temporary folder.
 *
 * @method deleteTemp
 */
Editor.deleteTemp = function()
{
	if(FileSystem.fileExists(Editor.TEMP))
	{
		FileSystem.deleteFolder(Editor.TEMP);
	}
};

/**
 * Export a android project using cordova.
 *
 * Cordova has to be installed from NPM globaly, it is run trough the command line.
 *
 * @method exportAndroid
 * @param {number} mode The app can be just run on the device, or exported as a signed or unsigned apk.
 * @param {string} outputPath Path to stored the output apk file in case there is one to store.
 */
Editor.exportAndroid = function(mode, outputPath)
{
	var system = require("child_process");
	var name = Editor.program.name !== "" ? Editor.program.name : "program";
	var author = Editor.program.author !== "" ? Editor.program.author : "author";
	var packageName = "com." + author + "." + name;

	// Delete old project data
	Editor.deleteTemp();

	// Create cordova project
	var output = system.execSync("cordova create temp " + packageName + " " + name).toString();
	if(output.indexOf("Creating") === -1)
	{
		console.error("nunuStudio: Failed to create cordova project.");
	}

	// Export nunu project
	Editor.exportCordovaProject(Editor.TEMP + "/www");


	setTimeout(function()
	{
		// Android platform project
		var output = system.execSync("cordova platform add android", {cwd:Editor.TEMP}).toString();
		if(output.indexOf("Android project created") === -1)
		{
			console.error("nunuStudio: Failed to create cordova android project.");
		}

		// Check requirements
		output = system.execSync("cordova requirements", {cwd:Editor.TEMP}).toString();

		if(output.indexOf("Java JDK: installed") === -1)
		{
			Editor.alert("Missing java JDK (get it at http:// www.oracle.com/technetwork/java/javase/downloads/index.html)");
			console.error("nunuStudio: Missing java JDK (get it at http:// www.oracle.com/technetwork/java/javase/downloads/index.html)");
			Editor.deleteTemp();
			return;
		}
		if(output.indexOf("Android SDK: installed true") === -1)
		{
			Editor.alert("Missing Android SDK (get it at https:// developer.android.com/studio/)");
			console.error("nunuStudio: Missing Android SDK (get it at https:// developer.android.com/studio/)");
			Editor.deleteTemp();
			return;
		}

		// Supported Android SDK versions
		/*
		var versions = output.split("android-");
		versions.shift();
		for(var i = 0; i < versions.length; i++)
		{
			versions[i] = Number.parseInt(versions[i])
		}
		*/

		// Send code to device
		if(mode === Editor.ANDROID_RUN)
		{
			// Build code
			output = system.execSync("cordova build android", {cwd:Editor.TEMP}).toString();
			if(output.indexOf("SUCCESSFUL") === -1)
			{
				console.error("nunuStudio: Failed to build android project.");
				Editor.deleteTemp();
				return;
			}

			// Launch on device
			output = system.execSync("cordova run android", {cwd:Editor.TEMP}).toString();
			if(output.indexOf("SUCCESS") === -1)
			{
				console.error("nunuStudio: Failed to launch android application on device.");
				Editor.deleteTemp();
				return;
			}
		}
		// Export test version
		else if(mode === Editor.ANDROID_EXPORT_UNSIGNED)
		{
			output = system.execSync("cordova build android", {cwd:Editor.TEMP}).toString();
			if(output.indexOf("SUCCESSFUL") === -1)
			{
				console.error("nunuStudio: Failed to build android project.");
				Editor.deleteTemp();
				return;
			}

			FileSystem.copyFile(Editor.TEMP + "/platforms/android/app/build/outputs/apk/debug/app-debug.apk", outputPath);
		}
		// Export signed version
		else if(mode === Editor.ANDROID_EXPORT_SIGNED)
		{
			output = system.execSync("cordova build android --release -- --keystore=\"..\\android.keystore\" --storePassword=android --alias=mykey", {cwd:Editor.TEMP}).toString();
			if(output.indexOf("SUCCESSFUL") === -1)
			{
				console.error("nunuStudio: Failed to build android project.");
				Editor.deleteTemp();
				return;
			}

			// FileSystem.copyFile(Editor.TEMP + "/platforms/android/app/build/outputs/apk/debug/app-debug.apk", outputPath);
		}

		Editor.deleteTemp();

		Editor.alert("Android project exported!");
	}, 500);
};

/**
 * Export a mobile ready web project to a folder.
 *
 * The mobile version of the runtime does not include any fullscreen and VR buttons, the application is run by default as fullscreen.
 *
 * @method exportCordovaProject
 * @param {string} dir Directory to export the project to.
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
 * @param {string} dir Directory to export the project to.
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
 * @param {string} fname Name of the file.
 */
Editor.exportWebProjectZip = function(fname)
{
	var zip = new JSZip3();
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
 * @param {string} dir Output directory.
 */
Editor.exportNWJSProject = function(dir, target)
{
	// Export web project
	Editor.exportWebProject(Editor.TEMP);

	var config = Editor.program.targetConfig;

	// Write package json with nwjs builder configuration
	FileSystem.writeFile(Editor.TEMP + "/package.json", JSON.stringify(
	{
		name: Editor.program.name,
		description: Editor.program.description,
		author: Editor.program.author,
		main: "index.html",
		window:
		{
			frame: config.desktop.frame,
			fullscreen: config.desktop.fullscreen,
			resizable: config.desktop.resizable
		},
		webkit:
		{
			plugin: false
		},
		build:
		{
			output: dir,
			outputPattern: "${PLATFORM}-${ARCH}",
			packed: true,
			// targets: ["zip", "nsis7z"],
			win:
			{
				productName: Editor.program.name,
				companyName: Editor.program.author
			},
		}
	}));

	// Build application
	var system = require("child_process");
	var output = system.execSync("build --mirror https:// dl.nwjs.io/ --with-ffmpeg --tasks " + target + " " + Editor.TEMP);

	// Delete temporary folders
	Editor.deleteTemp();
};

/**
 * Export NWJS windows project.
 *
 * @method exportWindowsProject
 * @param {string} dir Output directory.
 */
Editor.exportWindows = function(dir)
{
	Editor.exportNWJSProject(dir, "win-x64");
};

/**
 * Export NWJS linux project.
 *
 * @method exportLinuxProject
 * @param {string} dir Output directory.
 */
Editor.exportLinux = function(dir)
{
	Editor.exportNWJSProject(dir, "linux-x64");
};


/**
 * Export NWJS macOS project.
 *
 * @method exportMacOSProject
 * @param {string} dir Output directory.
 */
Editor.exportMacOS = function(dir)
{
	Editor.exportNWJSProject(dir, "mac-x64");
};
