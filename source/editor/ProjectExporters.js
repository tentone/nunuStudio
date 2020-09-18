import {StaticPair} from "@as-com/pson";
import JSZip from "jszip";
import {Base64Utils} from "../core/utils/binary/Base64Utils.js";
import {FileSystem} from "../core/FileSystem.js";
import {Global} from "./Global.js";
import {Editor} from "./Editor.js";

/**
 * Responsable for package and export of project data to different platforms.
 *
 * @static
 * @class Exporters
 */
function ProjectExporters() {}

ProjectExporters.ANDROID_RUN = 100;
ProjectExporters.ANDROID_EXPORT_UNSIGNED = 101;
ProjectExporters.ANDROID_EXPORT_SIGNED = 102;

/**
 * Editor temporary data folder, should be used for operations that require temporary file storage.
 *
 * Only available on desktop.
 *
 * @static
 * @attribute TEMP
 */
ProjectExporters.TEMP = "./temp";

/**
 * Export a mobile ready web project to a folder.
 *
 * The mobile version of the runtime does not include any fullscreen and VR buttons, the application is run by default as fullscreen.
 *
 * @static
 * @method exportCordovaProject
 * @param {string} dir Directory to export the project to.
 */
ProjectExporters.exportCordovaProject = function(dir)
{
	FileSystem.makeDirectory(dir);
	FileSystem.copyFile(Global.RUNTIME_PATH + "logo.png", dir + "/logo.png");
	FileSystem.copyFile(Global.RUNTIME_PATH + "cordova.html", dir + "/index.html");
	FileSystem.copyFile(Global.RUNTIME_PATH + "nunu.min.js", dir + "/nunu.min.js");
	Editor.saveProgram(dir + "/app.nsp", true, true, true);
};

/**
 * Export web project to a directory.
 *
 * Saves the project and exports the runtime to run the project.
 *
 * @static
 * @method exportWebProject
 * @param {string} dir Directory to export the project to.
 */
ProjectExporters.exportWebProject = function(dir)
{
	FileSystem.makeDirectory(dir);
	FileSystem.copyFile(Global.RUNTIME_PATH + "vr.png", dir + "/vr.png");
	FileSystem.copyFile(Global.RUNTIME_PATH + "fullscreen.png", dir + "/fullscreen.png");
	FileSystem.copyFile(Global.RUNTIME_PATH + "logo.png", dir + "/logo.png");
	FileSystem.copyFile(Global.RUNTIME_PATH + "index.html", dir + "/index.html");
	FileSystem.copyFile(Global.RUNTIME_PATH + "nunu.min.js", dir + "/nunu.min.js");
	Editor.saveProgram(dir + "/app.nsp", true, true, true);
};

/**
 * Export web project as a zip package using JSZip.
 *
 * Used in the web version to export projects.
 *
 * @static
 * @method exportWebProjectZip
 * @param {string} fname Name of the file.
 */
ProjectExporters.exportWebProjectZip = function(fname)
{
	var zip = new JSZip();
	zip.file("index.html", FileSystem.readFile(Global.RUNTIME_PATH + "index.html"));
	zip.file("nunu.min.js", FileSystem.readFile(Global.RUNTIME_PATH + "nunu.min.js"));
	
	var pson = new StaticPair();
	var data = pson.toArrayBuffer(Editor.program.toJSON());

	zip.file("app.nsp", Base64Utils.fromArraybuffer(data), {base64: true});
	zip.file("logo.png", FileSystem.readFileBase64(Global.RUNTIME_PATH + "logo.png"), {base64: true});
	zip.file("fullscreen.png", FileSystem.readFileBase64(Global.RUNTIME_PATH + "fullscreen.png"), {base64: true});
	zip.file("vr.png", FileSystem.readFileBase64(Global.RUNTIME_PATH + "vr.png"), {base64: true});

	zip.generateAsync({type: "blob"}).then(function(content)
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
};

/**
 * Export a NWJS project folder.
 *
 * Only the runtime and javascript portion of the project.
 *
 * @static
 * @method exportNWJSProject
 * @param {string} dir Output directory.
 */
ProjectExporters.exportNWJSProject = function(dir, target)
{
	// Export web project
	ProjectExporters.exportWebProject(ProjectExporters.TEMP);

	var config = Editor.program.targetConfig;

	// Write package json with nwjs builder configuration
	FileSystem.writeFile(ProjectExporters.TEMP + "/package.json", JSON.stringify(
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
		{plugin: false},
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
			}
		}
		}));

	// Build application
	var system = window.require("child_process");

	// Delete temporary folders
	if (FileSystem.fileExists(ProjectExporters.TEMP))
	{
		FileSystem.deleteFolder(ProjectExporters.TEMP);
	}
};

/**
 * Export NWJS windows project.
 *
 * @static
 * @method exportWindowsProject
 * @param {string} dir Output directory.
 */
ProjectExporters.exportWindows = function(dir)
{
	ProjectExporters.exportNWJSProject(dir, "win-x64");
};

/**
 * Export NWJS linux project.
 *
 * @static
 * @method exportLinuxProject
 * @param {string} dir Output directory.
 */
ProjectExporters.exportLinux = function(dir)
{
	ProjectExporters.exportNWJSProject(dir, "linux-x64");
};

/**
 * Export NWJS macOS project.
 *
 * @static
 * @method exportMacOSProject
 * @param {string} dir Output directory.
 */
ProjectExporters.exportMacOS = function(dir)
{
	ProjectExporters.exportNWJSProject(dir, "mac-x64");
};

/**
 * Export a android project using cordova.
 *
 * Cordova has to be installed from NPM globaly, it is run trough the command line.
 *
 * @static
 * @method exportAndroid
 * @param {number} mode The app can be just run on the device, or exported as a signed or unsigned apk.
 * @param {string} outputPath Path to stored the output apk file in case there is one to store.
 */
ProjectExporters.exportAndroid = function(mode, outputPath)
{
	// Clean the temporary files created under the temporary folder.
	function clenanUp()
	{
		if (FileSystem.fileExists(ProjectExporters.TEMP))
		{
			FileSystem.deleteFolder(ProjectExporters.TEMP);
		}
	}

	var system = window.require("child_process");
	var name = Editor.program.name !== "" ? Editor.program.name : "program";
	var author = Editor.program.author !== "" ? Editor.program.author : "author";
	var packageName = "com." + author + "." + name;

	// Delete old project data
	clenanUp();

	// Create cordova project
	var output = system.execSync("cordova create temp " + packageName + " " + name).toString();
	if (output.indexOf("Creating") === -1)
	{
		console.error("nunuStudio: Failed to create cordova project.");
	}

	// Export nunu project
	ProjectExporters.exportCordovaProject(ProjectExporters.TEMP + "/www");


	setTimeout(function()
	{
		// Android platform project
		var output = system.execSync("cordova platform add android", {cwd: ProjectExporters.TEMP}).toString();
		if (output.indexOf("Android project created") === -1)
		{
			console.error("nunuStudio: Failed to create cordova android project.");
		}

		// Check requirements
		output = system.execSync("cordova requirements", {cwd: ProjectExporters.TEMP}).toString();

		if (output.indexOf("Java JDK: installed") === -1)
		{
			Editor.alert("Missing java JDK (get it at http:// www.oracle.com/technetwork/java/javase/downloads/index.html)");
			console.error("nunuStudio: Missing java JDK (get it at http:// www.oracle.com/technetwork/java/javase/downloads/index.html)");
			clenanUp();
			return;
		}
		if (output.indexOf("Android SDK: installed true") === -1)
		{
			Editor.alert("Missing Android SDK (get it at https:// developer.android.com/studio/)");
			console.error("nunuStudio: Missing Android SDK (get it at https:// developer.android.com/studio/)");
			clenanUp();
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
		if (mode === ProjectExporters.ANDROID_RUN)
		{
			// Build code
			output = system.execSync("cordova build android", {cwd: ProjectExporters.TEMP}).toString();
			if (output.indexOf("SUCCESSFUL") === -1)
			{
				console.error("nunuStudio: Failed to build android project.");
				clenanUp();
				return;
			}

			// Launch on device
			output = system.execSync("cordova run android", {cwd: ProjectExporters.TEMP}).toString();
			if (output.indexOf("SUCCESS") === -1)
			{
				console.error("nunuStudio: Failed to launch android application on device.");
				clenanUp();
				return;
			}
		}
		// Export test version
		else if (mode === ProjectExporters.ANDROID_EXPORT_UNSIGNED)
		{
			output = system.execSync("cordova build android", {cwd: ProjectExporters.TEMP}).toString();
			if (output.indexOf("SUCCESSFUL") === -1)
			{
				console.error("nunuStudio: Failed to build android project.");
				clenanUp();
				return;
			}

			FileSystem.copyFile(ProjectExporters.TEMP + "/platforms/android/app/build/outputs/apk/debug/app-debug.apk", outputPath);
		}
		// Export signed version
		else if (mode === ProjectExporters.ANDROID_EXPORT_SIGNED)
		{
			output = system.execSync("cordova build android --release -- --keystore=\"..\\android.keystore\" --storePassword=android --alias=mykey", {cwd: ProjectExporters.TEMP}).toString();
			if (output.indexOf("SUCCESSFUL") === -1)
			{
				console.error("nunuStudio: Failed to build android project.");
				clenanUp();
				return;
			}

			FileSystem.copyFile(ProjectExporters.TEMP + "/platforms/android/app/build/outputs/apk/debug/app-debug.apk", outputPath);
		}

		clenanUp();

		Editor.alert("Android project exported!");
	}, 500);
};

export {ProjectExporters};
