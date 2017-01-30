"use strict";

function GeneralSettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "General", "editor/files/icons/misc/tool.png");

	this.element.style.overflow = "auto";

	//Self pointer
	var self = this;

	//Form
	this.form = new Form(this.element);
	this.form.default_text_width = 125;
	this.form.position.set(5, 5);
	this.form.spacing.set(5, 5);

	//General text
	this.form.addText("General");
	this.form.nextRow();
	
	//Theme
	this.form.addText("Theme");
	this.theme = new DropdownList(this.form.element);
	this.theme.size.set(150, 20);
	this.theme.setOnChange(function()
	{
		var value = self.theme.getValue();
		Settings.general.theme = value;
	});
	this.form.add(this.theme);
	this.form.nextRow();

	//Fill theme dropdown
	for(var i = 0; i < Theme.list.length; i++)
	{
		var theme = Theme.list[i];
		this.theme.addValue(theme, theme);
	}

	//Show stats
	this.form.addText("Performance info");
	this.show_stats = new CheckBox(this.form.element);
	this.show_stats.size.set(20, 16);
	this.show_stats.setOnChange(function()
	{
		Settings.general.show_stats = self.show_stats.getValue();
	});
	this.form.add(this.show_stats);
	this.form.nextRow();

	//Blank Space
	this.form.addText("");
	this.form.nextRow();

	//Scene editor
	this.form.addText("Scene editor");
	this.form.nextRow();

	//Enable Grid
	this.form.addText("Show grid");
	this.grid_enabled = new CheckBox(this.form.element);
	this.grid_enabled.size.set(20, 16);
	this.grid_enabled.setOnChange(function()
	{
		Settings.editor.grid_enabled = self.grid_enabled.getValue();
		Editor.grid_helper.visible = Settings.editor.grid_enabled;
	});
	this.form.add(this.grid_enabled);
	this.form.nextRow();

	//Grid size 
	this.form.addText("Grid size");
	this.grid_size = new NumberBox(this.form.element);
	this.grid_size.size.set(60, 18);
	this.grid_size.setRange(0, Number.MAX_SAFE_INTEGER);
	this.grid_size.setStep(0.05);
	this.grid_size.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Settings.editor.grid_size = self.grid_size.getValue();
			Editor.grid_helper.setSize(Settings.editor.grid_size);
			Editor.grid_helper.update();
		}
	});
	this.form.add(this.grid_size);
	this.form.nextRow();

	//Grid spacing
	this.form.addText("Grid spacing");
	this.grid_spacing = new NumberBox(this.form.element);
	this.grid_spacing.size.set(60, 18);
	this.grid_spacing.setRange(0, Number.MAX_SAFE_INTEGER);
	this.grid_spacing.setStep(1.0);
	this.grid_spacing.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Settings.editor.grid_spacing = self.grid_spacing.getValue();
			Editor.grid_helper.setSpacing(Settings.editor.grid_spacing);
			Editor.grid_helper.update();
		}
	});
	this.form.add(this.grid_spacing);
	this.form.nextRow();

	//Enable Axis
	this.form.addText("Show axis");
	this.axis_enabled = new CheckBox(this.form.element);
	this.axis_enabled.size.set(20, 16);
	this.axis_enabled.setOnChange(function()
	{
		Settings.editor.axis_enabled = self.axis_enabled.getValue();
		Editor.axis_helper.visible = Settings.editor.axis_enabled;
	});
	this.form.add(this.axis_enabled);
	this.form.nextRow();

	//Mouse lock on camera move
	this.form.addText("Lock mouse editor");
	this.lock_mouse = new CheckBox(this.form.element);
	this.lock_mouse.size.set(20, 16);
	this.lock_mouse.setOnChange(function()
	{
		Settings.editor.lock_mouse = self.lock_mouse.getValue();
	});
	this.form.add(this.lock_mouse);
	this.form.nextRow();

	//Tranformations space
	this.form.addText("Transformations space");
	this.transformation_space = new DropdownList(this.form.element);
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
	this.form.add(this.transformation_space);
	this.form.nextRow();

	//Enable camera preview
	this.form.addText("Camera preview");
	this.camera_preview_enabled = new CheckBox(this.form.element);
	this.camera_preview_enabled.size.set(20, 16);
	this.camera_preview_enabled.setOnChange(function()
	{
		Settings.editor.camera_preview_enabled = self.camera_preview_enabled.getValue();
	});
	this.form.add(this.camera_preview_enabled);
	this.form.nextRow();

	//Enable camera preview
	this.form.addText("Preview size");
	this.camera_preview_percentage = new Slider(this.form.element);
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
	this.form.add(this.camera_preview_percentage);
	this.form.nextRow();

	//Blank Space
	this.form.addText("");
	this.form.nextRow();

	//Asset explorer
	this.form.addText("Asset explorer");
	this.form.nextRow();

	//Code font size
	this.form.addText("Preview size");
	this.file_preview_size = new NumberBox(this.form.element);
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
	this.form.add(this.file_preview_size);
	this.form.nextRow();

	//Blank Space
	this.form.addText("");
	this.form.nextRow();

	//Renderer settings
	this.form.addText("Rendering Quality");
	this.form.nextRow();

	//Use project settings
	this.form.addText("Follow project");
	this.follow_project = new CheckBox(this.form.element);
	this.follow_project.size.set(20, 16);
	this.follow_project.setOnChange(function()
	{
		Settings.render.follow_project = self.follow_project.getValue();
	});
	this.form.add(this.follow_project);
	this.form.nextRow();

	//Antialiasing
	this.form.addText("Antialiasing");
	this.antialiasing = new CheckBox(this.form.element);
	this.antialiasing.size.set(20, 16);
	this.antialiasing.setOnChange(function()
	{
		Settings.render.antialiasing = self.antialiasing.getValue();
	});
	this.form.add(this.antialiasing);
	this.form.nextRow();

	//Shadows
	this.form.addText("Shadows");
	this.shadows = new CheckBox(this.form.element);
	this.shadows.size.set(20, 15);
	this.shadows.setOnChange(function()
	{	
		Settings.render.shadows = self.shadows.getValue();
	});
	this.form.add(this.shadows);
	this.form.nextRow();

	//Shadows settings
	this.form.addText("Shadows type");
	this.shadows_type = new DropdownList(this.form.element);
	this.shadows_type.size.set(150, 20);
	this.shadows_type.addValue("Basic", THREE.BasicShadowMap);
	this.shadows_type.addValue("PCF", THREE.PCFShadowMap);
	this.shadows_type.addValue("PCF Soft", THREE.PCFSoftShadowMap);
	//this.shadows_type.addValue("PCSS Soft", THREE.PCSSSoftShadowMap);
	this.shadows_type.setOnChange(function()
	{
		Settings.render.shadows_type = self.shadows_type.getValue();
	});
	this.form.add(this.shadows_type);
	this.form.nextRow();
}

GeneralSettingsTab.prototype = Object.create(TabElement.prototype);

//Activate
GeneralSettingsTab.prototype.activate = function()
{
	Editor.setState(Editor.STATE_IDLE);

	//General
	this.theme.setValue(Settings.general.theme);
	this.file_preview_size.setValue(Settings.general.file_preview_size);
	this.show_stats.setValue(Settings.general.show_stats);

	//Editor
	this.grid_enabled.setValue(Settings.editor.grid_enabled);
	this.grid_size.setValue(Settings.editor.grid_size);
	this.grid_spacing.setValue(Settings.editor.grid_spacing);
	this.axis_enabled.setValue(Settings.editor.axis_enabled);
	this.lock_mouse.setValue(Settings.editor.lock_mouse);
	this.transformation_space.setValue(Settings.editor.transformation_space);
	this.camera_preview_enabled.setValue(Settings.editor.camera_preview_enabled);
	this.camera_preview_percentage.setValue(Settings.editor.camera_preview_percentage);

	//Render
	this.follow_project.setValue(Settings.render.follow_project);
	this.antialiasing.setValue(Settings.render.antialiasing);
	this.shadows.setValue(Settings.render.shadows);
	this.shadows_type.setValue(Settings.render.shadows_type);
}

//Update division Size
GeneralSettingsTab.prototype.updateInterface = function()
{
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
	
	//Form
	this.form.visible = this.visible;
	this.form.updateInterface();

	//Update base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
