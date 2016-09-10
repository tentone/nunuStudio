"use strict";

function SettingsTab(parent)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}
	
	//ID
	var id = "settings" + SettingsTab.id;
	SettingsTab.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

	//Prevent Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Options tab container
	this.tab = new TabGroup(this.element);
	this.tab.element.style.cursor = "default";
	this.tab.element.style.backgroundColor = Editor.theme.bar_color;
	this.tab.button_size.set(200, 30);
	this.tab.mode = TabGroup.LEFT;
	this.tab.updateInterface();

	//Self pointer
	var self = this;

	//General tab
	this.general = this.tab.addTab("General", "editor/files/icons/misc/tool.png", false);

	//General form
	this.general_form = new Form(this.general.element);
	this.general_form.position.set(5, 5);
	this.general_form.spacing.set(5, 5);
	this.general.attachComponent(this.general_form);

	//General text
	this.general_form.addText("General");
	this.general_form.nextRow();
	
	//Theme
	this.general_form.addText("Theme");
	this.theme = new DropdownList(this.general_form.element);
	this.theme.size.set(150, 20);
	this.theme.setOnChange(function()
	{
		var value = self.theme.getValue();
		Settings.general.theme = value;
	});
	this.general_form.add(this.theme);
	this.general_form.nextRow();

	//Fill theme dropdown
	for(var i = 0; i < Theme.list.length; i++)
	{
		var theme = Theme.list[i];
		this.theme.addValue(theme, theme);
	}

	//Show stats
	this.show_stats = new CheckBox(this.general_form.element);
	this.show_stats.setText("Show performance info");
	this.show_stats.size.set(200, 16);
	this.show_stats.setOnChange(function()
	{
		Settings.general.show_stats = self.show_stats.getValue();
	});
	this.general_form.add(this.show_stats);
	this.general_form.nextRow();

	//Blank Space
	this.general_form.addText("");
	this.general_form.nextRow();

	//Scene editor
	this.general_form.addText("Scene editor");
	this.general_form.nextRow();

	//Enable Grid
	this.grid_enabled = new CheckBox(this.general_form.element);
	this.grid_enabled.setText("Show grid");
	this.grid_enabled.size.set(200, 16);
	this.grid_enabled.setOnChange(function()
	{
		Settings.editor.grid_enabled = self.grid_enabled.getValue();
		Editor.grid_helper.visible = Settings.editor.grid_enabled;
	});
	this.general_form.add(this.grid_enabled);
	this.general_form.nextRow();

	//Enable Axis
	this.axis_enabled = new CheckBox(this.general_form.element);
	this.axis_enabled.setText("Show axis");
	this.axis_enabled.size.set(200, 16);
	this.axis_enabled.setOnChange(function()
	{
		Settings.editor.axis_enabled = self.axis_enabled.getValue();
		Editor.axis_helper.visible = Settings.editor.axis_enabled;
	});
	this.general_form.add(this.axis_enabled);
	this.general_form.nextRow();

	//Mouse lock on camera move
	this.lock_mouse = new CheckBox(this.general_form.element);
	this.lock_mouse.setText("Lock mouse editor");
	this.lock_mouse.size.set(200, 16);
	this.lock_mouse.setOnChange(function()
	{
		Settings.editor.lock_mouse = self.lock_mouse.getValue();
	});
	this.general_form.add(this.lock_mouse);
	this.general_form.nextRow();

	//Tranformations space
	this.general_form.addText("Transformations space");
	this.transformation_space = new DropdownList(this.general_form.element);
	this.transformation_space.size.set(150, 20);
	this.transformation_space.addValue("Local", "local");
	this.transformation_space.addValue("World", "world");
	this.transformation_space.setOnChange(function()
	{
		Settings.editor.transformation_space = self.transformation_space.getValue();
		if(Editor.tool !== null && Editor.tool_mode !== Editor.MODE_SCALE)
		{
			Editor.tool.setSpace(Settings.editor.transformation_space);
		}
	});
	this.general_form.add(this.transformation_space);
	this.general_form.nextRow();

	//Enable camera preview
	this.camera_preview_enabled = new CheckBox(this.general_form.element);
	this.camera_preview_enabled.setText("Camera preview");
	this.camera_preview_enabled.size.set(200, 16);
	this.camera_preview_enabled.setOnChange(function()
	{
		Settings.editor.camera_preview_enabled = self.camera_preview_enabled.getValue();
	});
	this.general_form.add(this.camera_preview_enabled);
	this.general_form.nextRow();

	//Enable camera preview
	this.general_form.addText("Preview size");
	this.camera_preview_percentage = new Slider(this.general_form.element);
	this.camera_preview_percentage.size.set(120, 18);
	this.camera_preview_percentage.setRange(0.05, 0.7);
	this.camera_preview_percentage.setStep(0.05);
	this.camera_preview_percentage.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Settings.editor.camera_preview_percentage = self.camera_preview_percentage.getValue();
		}
	});
	this.general_form.add(this.camera_preview_percentage);
	this.general_form.nextRow();

	//Blank Space
	this.general_form.addText("");
	this.general_form.nextRow();

	//Asset explorer
	this.general_form.addText("Asset explorer");
	this.general_form.nextRow();

	//Code font size
	this.general_form.addText("Preview size");
	this.file_preview_size = new NumberBox(this.general_form.element);
	this.file_preview_size.size.set(60, 18);
	this.file_preview_size.setRange(60, 500);
	this.file_preview_size.setStep(1);
	this.file_preview_size.setOnChange(function()
	{
		var value = self.file_preview_size.getValue();
		Settings.general.file_preview_size = value;
		Interface.asset_explorer.files_size.set(value, value);
		Editor.updateAssetExplorer();
	});
	this.general_form.add(this.file_preview_size);
	this.general_form.nextRow();

	//Blank Space
	this.general_form.addText("");
	this.general_form.nextRow();

	//Renderer settings
	this.general_form.addText("Rendering Quality");
	this.general_form.nextRow();

	//Shadows settings
	this.general_form.addText("Shadows type");
	this.shadows_type = new DropdownList(this.general_form.element);
	this.shadows_type.size.set(150, 20);
	this.shadows_type.addValue("Basic", THREE.BasicShadowMap);
	this.shadows_type.addValue("PCF", THREE.PCFShadowMap);
	this.shadows_type.addValue("PCF Soft", THREE.PCFSoftShadowMap);
	//this.shadows_type.addValue("PCSS Soft", THREE.PCSSSoftShadowMap);
	this.shadows_type.setOnChange(function()
	{
		Settings.render.shadows_type = self.shadows_type.getValue();
	});
	this.general_form.add(this.shadows_type);
	this.general_form.nextRow();

	//Antialiasing
	this.antialiasing = new CheckBox(this.general_form.element);
	this.antialiasing.setText("Antialiasing");
	this.antialiasing.size.set(200, 16);
	this.antialiasing.setOnChange(function()
	{
		Settings.render.antialiasing = self.antialiasing.getValue();
	});
	this.general_form.add(this.antialiasing);
	this.general_form.nextRow();

	//Code tab
	this.code = this.tab.addTab("Code", "editor/files/icons/script/script.png", false);
	
	//Code form
	this.code_form = new Form(this.code.element);
	this.code_form.position.set(5, 5);
	this.code_form.spacing.set(5, 5);
	this.code.attachComponent(this.code_form);

	//Code editor text
	this.code_form.addText("Code Editor");
	this.code_form.nextRow();

	//Code Theme
	this.code_form.addText("Editor theme");
	this.code_theme = new DropdownList(this.code_form.element);
	this.code_theme.size.set(120, 20);
	this.code_theme.setOnChange(function()
	{
		Settings.code.theme = self.code_theme.getValue();
	});
	this.code_form.add(this.code_theme);
	this.code_form.nextRow();

	//Get codemirror themes available
	var files = FileSystem.getFilesDirectory("lib/codemirror/theme/");
	for(var i = 0; i < files.length; i++)
	{
		var theme = files[i].replace(".css", "");
		this.code_theme.addValue(theme, theme);
	}

	//Code keymap
	this.code_form.addText("Key bindings");
	this.code_keymap = new DropdownList(this.code_form.element);
	this.code_keymap.size.set(120, 20);
	this.code_keymap.addValue("codemirror", "default");
	this.code_keymap.addValue("sublime", "sublime");
	this.code_keymap.addValue("vim", "vim");
	this.code_keymap.addValue("emacs", "emacs");
	this.code_keymap.setOnChange(function()
	{
		Settings.code.keymap = self.code_keymap.getValue();
	});
	this.code_form.add(this.code_keymap);
	this.code_form.nextRow();

	//Code font size
	this.code_form.addText("Font size");
	this.code_font_size = new NumberBox(this.code_form.element);
	this.code_font_size.size.set(60, 18);
	this.code_font_size.setRange(5, 99999);
	this.code_font_size.setStep(1);
	this.code_font_size.setOnChange(function()
	{
		Settings.code.font_size = self.code_font_size.getValue();
	});
	this.code_form.add(this.code_font_size);
	this.code_form.nextRow();

	//Show line numbers
	this.code_line_numbers = new CheckBox(this.code_form.element);
	this.code_line_numbers.setText("Show line number");
	this.code_line_numbers.size.set(200, 16);
	this.code_line_numbers.setOnChange(function()
	{
		Settings.code.line_numbers = self.code_line_numbers.getValue();
	});
	this.code_form.add(this.code_line_numbers);
	this.code_form.nextRow();

	//Line wrapping
	this.code_line_wrapping = new CheckBox(this.code_form.element);
	this.code_line_wrapping.setText("Line wrap");
	this.code_line_wrapping.size.set(200, 16);
	this.code_line_wrapping.setOnChange(function()
	{
		Settings.code.line_wrapping = self.code_line_wrapping.getValue();
	});
	this.code_form.add(this.code_line_wrapping);
	this.code_form.nextRow();

	//Auto close brackets
	this.code_auto_close_brackets = new CheckBox(this.code_form.element);
	this.code_auto_close_brackets.setText("Auto close brackets");
	this.code_auto_close_brackets.size.set(200, 16);
	this.code_auto_close_brackets.setOnChange(function()
	{
		Settings.code.auto_close_brackets = self.code_auto_close_brackets.getValue();
	});
	this.code_form.add(this.code_auto_close_brackets);
	this.code_form.nextRow();

	//Highlight active line
	this.code_highlight_active_line = new CheckBox(this.code_form.element);
	this.code_highlight_active_line.setText("Highlight line");
	this.code_highlight_active_line.size.set(200, 16);
	this.code_highlight_active_line.setOnChange(function()
	{
		Settings.code.highlight_active_line = self.code_highlight_active_line.getValue();
	});
	this.code_form.add(this.code_highlight_active_line);
	this.code_form.nextRow();

	//About
	this.about = this.tab.addTab("About", "editor/files/icons/misc/about.png", false);
	this.about.attachComponent(new AboutTab(this.about.element));
	this.about.updateInterface();
	
	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//SettingsTab counter
SettingsTab.id = 0;

//Update container object data
SettingsTab.prototype.updateMetadata = function(container){}

//Activate
SettingsTab.prototype.activate = function()
{
	Editor.setState(Editor.STATE_IDLE);

	//General
	this.theme.setValue(Settings.general.theme);
	this.file_preview_size.setValue(Settings.general.file_preview_size);
	this.show_stats.setValue(Settings.general.show_stats);

	//Editor
	this.grid_enabled.setValue(Settings.editor.grid_enabled);
	this.axis_enabled.setValue(Settings.editor.axis_enabled);
	this.lock_mouse.setValue(Settings.editor.lock_mouse);
	this.transformation_space.setValue(Settings.editor.transformation_space);
	this.camera_preview_enabled.setValue(Settings.editor.camera_preview_enabled);
	this.camera_preview_percentage.setValue(Settings.editor.camera_preview_percentage);

	//Render
	this.shadows_type.setValue(Settings.render.shadows_type);
	this.antialiasing.setValue(Settings.render.antialiasing);

	//Code
	this.code_theme.setValue(Settings.code.theme);
	this.code_font_size.setValue(Settings.code.font_size);
	this.code_keymap.setValue(Settings.code.keymap);
	this.code_line_numbers.setValue(Settings.code.line_numbers);
	this.code_line_wrapping.setValue(Settings.code.line_wrapping);
	this.code_auto_close_brackets.setValue(Settings.code.auto_close_brackets);
	this.code_highlight_active_line.setValue(Settings.code.highlight_active_line);
}

//Remove element
SettingsTab.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update SettingsTab
SettingsTab.prototype.update = function(){}

//Update division Size
SettingsTab.prototype.updateInterface = function()
{
	//Fit parent
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update forms
	this.general_form.visible = this.visible;
	this.general_form.updateInterface();
	this.code_form.visible = this.visible;
	this.code_form.updateInterface();

	//Update tab
	this.tab.visible = this.visible;
	this.tab.size.copy(this.size);
	this.tab.updateInterface();

	//Update base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
