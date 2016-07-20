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
	this.tab.options_size.set(200, 30);
	this.tab.element.className = "bar";
	this.tab.mode = TabGroup.LEFT;
	this.tab.updateInterface();

	//Self pointer
	var self = this;

	//General tab
	this.general = this.tab.addOption("General", "editor/files/icons/misc/tool.png", false);

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
	this.theme.addValue("Dark", "dark");
	this.theme.setOnChange(function()
	{
		Settings.general_theme = self.theme.getValue();
	});
	this.general_form.add(this.theme);
	this.general_form.nextRow();

	//Show stats
	this.show_stats = new CheckBox(this.general_form.element);
	this.show_stats.setText("Show stats");
	this.show_stats.size.set(200, 16);
	this.show_stats.setOnChange(function()
	{
		Settings.show_stats = self.show_stats.getValue();
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
		Settings.grid_enabled = self.grid_enabled.getValue();
		Editor.grid_helper.visible = Settings.grid_enabled;
	});
	this.general_form.add(this.grid_enabled);
	this.general_form.nextRow();

	//Enable Axis
	this.axis_enabled = new CheckBox(this.general_form.element);
	this.axis_enabled.setText("Show axis");
	this.axis_enabled.size.set(200, 16);
	this.axis_enabled.setOnChange(function()
	{
		Settings.axis_enabled = self.axis_enabled.getValue();
		Editor.axis_helper.visible = Settings.axis_enabled;
	});
	this.general_form.add(this.axis_enabled);
	this.general_form.nextRow();

	//Enable camera preview
	this.camera_preview_enabled = new CheckBox(this.general_form.element);
	this.camera_preview_enabled.setText("Camera preview");
	this.camera_preview_enabled.size.set(200, 16);
	this.camera_preview_enabled.setOnChange(function()
	{
		Settings.camera_preview_enabled = self.camera_preview_enabled.getValue();
	});
	this.general_form.add(this.camera_preview_enabled);
	this.general_form.nextRow();

	//Enable camera preview
	this.general_form.addText("Preview size");
	this.camera_preview_percentage = new Slider(this.general_form.element);
	this.camera_preview_percentage.size.set(120, 18);
	this.camera_preview_percentage.setRange(0, 0.7);
	this.camera_preview_percentage.setStep(0.05);
	this.camera_preview_percentage.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Settings.camera_preview_percentage = self.camera_preview_percentage.getValue();
			self.camera_preview_percentage_text.setText(Settings.camera_preview_percentage + "%");
		}
	});
	this.general_form.add(this.camera_preview_percentage);
	this.camera_preview_percentage_text = this.general_form.addText("");
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
	this.shadows_type.setOnChange(function()
	{
		Settings.shadows_type = self.shadows_type.getValue();
	});
	this.general_form.add(this.shadows_type);
	this.general_form.nextRow();

	//Antialiasing
	this.antialiasing = new CheckBox(this.general_form.element);
	this.antialiasing.setText("Antialiasing");
	this.antialiasing.size.set(200, 16);
	this.antialiasing.setOnChange(function()
	{
		Settings.antialiasing = self.antialiasing.getValue();
	});
	this.general_form.add(this.antialiasing);
	this.general_form.nextRow();

	//Code tab
	this.code = this.tab.addOption("Code", "editor/files/icons/script/script.png", false);
	
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
	this.code_theme.size.set(150, 20);
	this.code_theme.setOnChange(function()
	{
		Settings.code_theme = self.code_theme.getValue();
	});
	this.code_form.add(this.code_theme);
	this.code_form.nextRow();

	//Get codemirror themes available
	var files = App.getFilesDirectory("lib/codemirror/theme/");
	for(var i = 0; i < files.length; i++)
	{
		var theme = files[i].replace(".css", "");
		this.code_theme.addValue(theme, theme);
	}

	//Code font size
	this.code_form.addText("Code size");
	this.code_font_size = new NumberBox(this.code_form.element);
	this.code_font_size.size.set(60, 18);
	this.code_font_size.setRange(5, 99999);
	this.code_font_size.setStep(1);
	this.code_font_size.setOnChange(function()
	{
		Settings.code_font_size = self.code_font_size.getValue();
	});
	this.code_form.add(this.code_font_size);
	this.code_form.nextRow();

	this.code_line_numbers = new CheckBox(this.code_form.element);
	this.code_line_numbers.setText("Show Line Numbers");
	this.code_line_numbers.size.set(200, 16);
	this.code_line_numbers.setOnChange(function()
	{
		Settings.code_line_numbers = self.code_line_numbers.getValue();
	});
	this.code_form.add(this.code_line_numbers);
	this.code_form.nextRow();

	//About
	this.about = this.tab.addOption("About", "editor/files/icons/misc/about.png", false);
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

//Functions Prototype
SettingsTab.prototype.update = update;
SettingsTab.prototype.updateInterface = updateInterface;
SettingsTab.prototype.destroy = destroy;
SettingsTab.prototype.activate = activate;
SettingsTab.prototype.updateMetadata = updateMetadata;

//Update container object data
function updateMetadata(container){}

//Activate
function activate()
{
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();

	//General elements
	this.show_stats.setValue(Settings.show_stats);
	this.grid_enabled.setValue(Settings.grid_enabled);
	this.axis_enabled.setValue(Settings.axis_enabled);
	this.camera_preview_enabled.setValue(Settings.camera_preview_enabled);
	this.camera_preview_percentage.setValue(Settings.camera_preview_percentage);
	this.camera_preview_percentage_text.setText(Settings.camera_preview_percentage + "%");
	this.shadows_type.setValue(Settings.shadows_type);
	this.antialiasing.setValue(Settings.antialiasing);

	//Code elements
	this.code_theme.setValue(Settings.code_theme);
	this.code_font_size.setValue(Settings.code_font_size);
	this.code_line_numbers.setValue(Settings.code_line_numbers);
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update SettingsTab
function update(){}

//Update division Size
function updateInterface()
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
