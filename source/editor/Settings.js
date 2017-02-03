"use strict";

function Settings(){}

//Constants
Settings.RADIANS = 0;
Settings.DEGREES = 1;

//Load default settings
Settings.loadDefault = function()
{
	//General settings
	Settings.general = {};
	Settings.general.theme = "dark";
	Settings.general.file_preview_size = 70;
	Settings.general.show_stats = false;
	Settings.general.show_uuid = false;

	//Editor settings
	Settings.editor = {};
	Settings.editor.angle_format = Settings.RADIANS;
	Settings.editor.grid_size = 500;
	Settings.editor.grid_spacing = 5;
	Settings.editor.grid_enabled = true;
	Settings.editor.axis_enabled = true;
	Settings.editor.camera_preview_enabled = true;
	Settings.editor.camera_preview_percentage = 0.35;
	Settings.editor.lock_mouse = true;
	Settings.editor.transformation_space = "world";

	//Rendering settings
	Settings.render = {};
	Settings.render.follow_project = false;
	Settings.render.tonemapping = THREE.NoToneMapping;
	Settings.render.tonemapping_exposure = 1.0;
	Settings.render.tonemapping_whitepoint = 1.0;
	Settings.render.antialiasing = true;
	Settings.render.shadows = true;
	Settings.render.shadows_type = THREE.PCFSoftShadowMap;

	//Code editor settings
	Settings.code = {};
	Settings.code.theme = "monokai";
	Settings.code.keymap = "sublime";
	Settings.code.font_size = 14;
	Settings.code.line_numbers = true;
	Settings.code.line_wrapping = false;
	Settings.code.auto_close_brackets = true;
	Settings.code.highlight_active_line = false;
}

//Store settings file
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

	FileSystem.writeFile("config", data);
}

//Load settings file
Settings.load = function()
{
	try
	{
		var data = JSON.parse(FileSystem.readFile("config"));
		
		Settings.general = data.general;
		Settings.editor = data.editor;
		Settings.render = data.render;
		Settings.code = data.code;
	}
	catch(e)
	{
		Settings.loadDefault();
	}
}