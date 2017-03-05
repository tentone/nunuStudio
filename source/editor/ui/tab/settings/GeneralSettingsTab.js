"use strict";

function GeneralSettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "General", "editor/files/icons/misc/tool.png");

	this.element.style.overflow = "auto";

	//Self pointer
	var self = this;

	//Form
	this.form = new Form(this.element);
	this.form.defaultTextWidth = 125;
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
	this.showStats = new CheckBox(this.form.element);
	this.showStats.size.set(20, 16);
	this.showStats.setOnChange(function()
	{
		Settings.general.showStats = self.showStats.getValue();
	});
	this.form.add(this.showStats);
	this.form.nextRow();

	//Show UUID
	this.form.addText("Show object UUID");
	this.showUUID = new CheckBox(this.form.element);
	this.showUUID.size.set(20, 16);
	this.showUUID.setOnChange(function()
	{
		Settings.general.showUUID = self.showUUID.getValue();
		Editor.selectObjectPanel();
	});
	this.form.add(this.showUUID);
	this.form.nextRow();

	//Blank Space
	this.form.addText("");
	this.form.nextRow();

	//Scene editor
	this.form.addText("Scene editor");
	this.form.nextRow();

	//Enable Grid
	this.form.addText("Show grid");
	this.gridEnabled = new CheckBox(this.form.element);
	this.gridEnabled.size.set(20, 16);
	this.gridEnabled.setOnChange(function()
	{
		Settings.editor.gridEnabled = self.gridEnabled.getValue();
		Editor.gridHelper.visible = Settings.editor.gridEnabled;
	});
	this.form.add(this.gridEnabled);
	this.form.nextRow();

	//Grid size 
	this.form.addText("Grid size");
	this.gridSize = new NumberBox(this.form.element);
	this.gridSize.size.set(60, 18);
	this.gridSize.setRange(0, Number.MAX_SAFE_INTEGER);
	this.gridSize.setStep(0.05);
	this.gridSize.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Settings.editor.gridSize = self.gridSize.getValue();
			Editor.gridHelper.setSize(Settings.editor.gridSize);
			Editor.gridHelper.update();
		}
	});
	this.form.add(this.gridSize);
	this.form.nextRow();

	//Grid spacing
	this.form.addText("Grid spacing");
	this.gridSpacing = new NumberBox(this.form.element);
	this.gridSpacing.size.set(60, 18);
	this.gridSpacing.setRange(0, Number.MAX_SAFE_INTEGER);
	this.gridSpacing.setStep(1.0);
	this.gridSpacing.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Settings.editor.gridSpacing = self.gridSpacing.getValue();
			Editor.gridHelper.setSpacing(Settings.editor.gridSpacing);
			Editor.gridHelper.update();
		}
	});
	this.form.add(this.gridSpacing);
	this.form.nextRow();

	//Enable Axis
	this.form.addText("Show axis");
	this.axisEnabled = new CheckBox(this.form.element);
	this.axisEnabled.size.set(20, 16);
	this.axisEnabled.setOnChange(function()
	{
		Settings.editor.axisEnabled = self.axisEnabled.getValue();
		Editor.axisHelper.visible = Settings.editor.axisEnabled;
	});
	this.form.add(this.axisEnabled);
	this.form.nextRow();

	//Mouse lock on camera move
	this.form.addText("Lock mouse editor");
	this.lockMouse = new CheckBox(this.form.element);
	this.lockMouse.size.set(20, 16);
	this.lockMouse.setOnChange(function()
	{
		Settings.editor.lockMouse = self.lockMouse.getValue();
	});
	this.form.add(this.lockMouse);
	this.form.nextRow();

	//Tranformations space
	this.form.addText("Transformations space");
	this.transformationSpace = new DropdownList(this.form.element);
	this.transformationSpace.size.set(150, 20);
	this.transformationSpace.addValue("Local", "local");
	this.transformationSpace.addValue("World", "world");
	this.transformationSpace.setOnChange(function()
	{
		Settings.editor.transformationSpace = self.transformationSpace.getValue();
		if(Editor.tool !== null && Editor.toolMode !== Editor.MODE_SCALE)
		{
			Editor.tool.setSpace(Settings.editor.transformationSpace);
		}
	});
	this.form.add(this.transformationSpace);
	this.form.nextRow();

	//Enable camera preview
	this.form.addText("Camera preview");
	this.cameraPreviewEnabled = new CheckBox(this.form.element);
	this.cameraPreviewEnabled.size.set(20, 16);
	this.cameraPreviewEnabled.setOnChange(function()
	{
		Settings.editor.cameraPreviewEnabled = self.cameraPreviewEnabled.getValue();
	});
	this.form.add(this.cameraPreviewEnabled);
	this.form.nextRow();

	//Enable camera preview
	this.form.addText("Preview size");
	this.cameraPreviewPercentage = new Slider(this.form.element);
	this.cameraPreviewPercentage.size.set(120, 18);
	this.cameraPreviewPercentage.setRange(0.05, 0.7);
	this.cameraPreviewPercentage.setStep(0.05);
	this.cameraPreviewPercentage.setOnChange(function()
	{
		if(self.obj !== null)
		{
			Settings.editor.cameraPreviewPercentage = self.cameraPreviewPercentage.getValue();
		}
	});
	this.form.add(this.cameraPreviewPercentage);
	this.form.nextRow();

	//Blank Space
	this.form.addText("");
	this.form.nextRow();

	//Asset explorer
	this.form.addText("Asset explorer");
	this.form.nextRow();

	//Code font size
	this.form.addText("Preview size");
	this.filePreviewSize = new NumberBox(this.form.element);
	this.filePreviewSize.size.set(60, 18);
	this.filePreviewSize.setRange(60, 500);
	this.filePreviewSize.setStep(1);
	this.filePreviewSize.setOnChange(function()
	{
		var value = self.filePreviewSize.getValue();
		Settings.general.filePreviewSize = value;
		Interface.assetExplorer.filesSize.set(value, value);
		Editor.updateAssetExplorer();
	});
	this.form.add(this.filePreviewSize);
	
	//Update form
	this.form.updateInterface();
}

GeneralSettingsTab.prototype = Object.create(TabElement.prototype);

//Activate
GeneralSettingsTab.prototype.activate = function()
{
	Editor.setState(Editor.STATE_IDLE);

	//General
	this.theme.setValue(Settings.general.theme);
	this.filePreviewSize.setValue(Settings.general.filePreviewSize);
	this.showStats.setValue(Settings.general.showStats);
	this.showUUID.setValue(Settings.general.showUUID);

	//Editor
	this.gridEnabled.setValue(Settings.editor.gridEnabled);
	this.gridSize.setValue(Settings.editor.gridSize);
	this.gridSpacing.setValue(Settings.editor.gridSpacing);
	this.axisEnabled.setValue(Settings.editor.axisEnabled);
	this.lockMouse.setValue(Settings.editor.lockMouse);
	this.transformationSpace.setValue(Settings.editor.transformationSpace);
	this.cameraPreviewEnabled.setValue(Settings.editor.cameraPreviewEnabled);
	this.cameraPreviewPercentage.setValue(Settings.editor.cameraPreviewPercentage);
};

//Update division Size
GeneralSettingsTab.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		//Element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
