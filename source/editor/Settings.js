"use strict";

function Settings(){}

//Angles
Settings.RADIANS = 0;
Settings.DEGREES = 1;

//Navigation
Settings.FREE = 10;
Settings.ORBIT = 11;

//Position
Settings.TOP_LEFT = 20;
Settings.TOP_RIGHT = 21;
Settings.BOTTOM_LEFT = 22;
Settings.BOTTOM_RIGHT = 23;

//Load default settings
Settings.loadDefault = function()
{
	//General
	Settings.general = {};
	Settings.general.theme = "dark";
	Settings.general.filePreviewSize = 70;
	Settings.general.showStats = false;
	Settings.general.showUUID = false;

	//Editor
	Settings.editor = {};
	Settings.editor.angleFormat = Settings.RADIANS;
	Settings.editor.snap = false;
	Settings.editor.snapAngle = 0.1;
	Settings.editor.gridSize = 500;
	Settings.editor.gridSpacing = 5;
	Settings.editor.gridEnabled = true;
	Settings.editor.axisEnabled = true;
	Settings.editor.cameraPreviewEnabled = true;
	Settings.editor.cameraPreviewPercentage = 0.35;
	Settings.editor.cameraPreviewPosition = Settings.BOTTOM_RIGHT;
	Settings.editor.lockMouse = true;
	Settings.editor.transformationSpace = "world";
	Settings.editor.navigation = Settings.FREE;
	Settings.editor.invertNavigation = false;
	Settings.editor.keyboardNavigation = false;

	Settings.editor.keyboardNavigationSpeed = 0.5;
	Settings.editor.mouseLookSensitivity = 0.002;
	Settings.editor.mouseMoveSpeed = 0.001;
	Settings.editor.mouseWheelSensitivity = 0.0005;
	
	//Render
	Settings.render = {};
	Settings.render.followProject = true;
	Settings.render.toneMapping = THREE.LinearToneMapping;
	Settings.render.toneMappingExposure = 1.0;
	Settings.render.toneMappingWhitePoint = 1.0;
	Settings.render.antialiasing = true;
	Settings.render.shadows = true;
	Settings.render.shadowsType = THREE.PCFSoftShadowMap;

	//Code
	Settings.code = {};
	Settings.code.theme = "monokai";
	Settings.code.keymap = "sublime";
	Settings.code.fontSize = 14;
	Settings.code.lineNumbers = true;
	Settings.code.lineWrapping = false;
	Settings.code.autoCloseBrackets = true;
	Settings.code.highlightActiveLine = false;
	Settings.code.showMatchesOnScrollbar = true;
	Settings.code.dragFiles = true;
};

Settings.loadDefault();

//Store settings
Settings.store = function()
{
	var data = JSON.stringify(
	{
		general: Settings.general,
		editor: Settings.editor,
		render: Settings.render,
		code: Settings.code
	}, null, "\t");

	data.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, "$1");
	
	//Store file
	if(Nunu.runningOnDesktop())
	{
		FileSystem.writeFile("config", data);
	}
	//Cookie
	else
	{
		Cookies.set("config", data);
	}
};

//Load settings
Settings.load = function()
{
	try
	{
		if(Nunu.runningOnDesktop())
		{
			var data = JSON.parse(FileSystem.readFile("config"));
		}
		else
		{
			var data = JSON.parse(Cookies.get("config"));
		}

		for(var i in data)
		{
			if(Settings[i] === undefined)
			{
				Settings[i] = {};
			}

			for(var j in data[i])
			{
				Settings[i][j] = data[i][j];
			}
		}
	}
	catch(e)
	{
		console.warn("nunuStudio: Failed to load configuration file");
	}
};