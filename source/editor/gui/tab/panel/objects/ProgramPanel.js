"use strict";

function ProgramPanel(parent, obj)
{
	ObjectPanel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Program information
	this.form.addText("Information");
	this.form.nextRow();

	//Author
	this.form.addText("Author");
	this.author = new TextBox(this.form);
	this.author.position.set(50, 35);
	this.author.size.set(190, 18);
	this.author.updateInterface();
	this.author.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "author", self.author.getText()));
	});
	this.form.add(this.author);
	this.form.nextRow();
	
	//Version
	this.form.addText("Version");
	this.version = new TextBox(this.form);
	this.version.size.set(100, 18);
	this.version.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "version", self.version.getText()));
	});
	this.form.add(this.version);
	this.form.nextRow();

	//Mouse lock
	this.lockPointer = new CheckBox(this.form);
	this.form.addText("Lock pointer");
	this.lockPointer.size.set(15, 15);
	this.lockPointer.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "lockPointer", self.lockPointer.getValue()));
	});
	this.form.add(this.lockPointer);
	this.form.nextRow();
	
	//Handle pixel ratio
	this.handlePixelRatio = new CheckBox(this.form);
	this.form.addText("Pixel Ratio");
	this.handlePixelRatio.size.set(15, 15);
	this.handlePixelRatio.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "handlePixelRatio", self.handlePixelRatio.getValue()));
	});
	this.form.add(this.handlePixelRatio);
	this.form.nextRow()

	//VR
	this.form.addText("Virtual Reality");
	this.form.nextRow();

	//VR Enabled
	this.vr = new CheckBox(this.form);
	this.form.addText("VR Enabled");
	this.vr.size.set(15, 15);
	this.vr.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "vr", self.vr.getValue()));
	});
	this.form.add(this.vr);
	this.form.nextRow();

	//VR Movement Scale
	this.form.addText("Room Scale");
	this.vrScale = new NumberBox(this.form);
	this.vrScale.size.set(50, 18);
	this.vrScale.setRange(0, 1000);
	this.vrScale.setStep(0.05);
	this.vrScale.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "vrScale", self.vrScale.getValue()));
	});
	this.form.add(this.vrScale);
	this.form.nextRow();

	//Rendering
	this.form.addText("Rendering");
	this.form.nextRow();

	//Antialiasing
	this.antialiasing = new CheckBox(this.form);
	this.form.addText("Antialiasing");
	this.antialiasing.size.set(15, 15);
	this.antialiasing.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "antialiasing", self.antialiasing.getValue()));
		
		var tab = Editor.gui.tab.getActiveTab();
		if(tab instanceof SceneEditor)
		{
			tab.reloadContext();
		}
	});
	this.form.add(this.antialiasing);
	this.form.nextRow();

	//Shadows
	this.shadows = new CheckBox(this.form);
	this.form.addText("Shadows");
	this.shadows.size.set(15, 15);
	this.shadows.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "shadows", self.shadows.getValue()));
		self.updateRenderer();
	});
	this.form.add(this.shadows);
	this.form.nextRow();

	//Shadow type
	this.form.addText("Shadows type");
	this.shadowsType = new DropdownList(this.form);
	this.shadowsType.size.set(120, 20);
	this.shadowsType.addValue("Basic", THREE.BasicShadowMap);
	this.shadowsType.addValue("PCF", THREE.PCFShadowMap);
	this.shadowsType.addValue("PCF Soft", THREE.PCFSoftShadowMap);
	this.shadowsType.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "shadowsType", self.shadowsType.getValue()));
		self.updateRenderer();
	});
	this.form.add(this.shadowsType);
	this.form.nextRow();

	//Tonemapping
	this.form.addText("Tonemapping");
	this.toneMapping = new DropdownList(this.form);
	this.toneMapping.size.set(120, 20);
	this.toneMapping.addValue("None", THREE.NoToneMapping);
	this.toneMapping.addValue("Linear", THREE.LinearToneMapping);
	this.toneMapping.addValue("Reinhard", THREE.ReinhardToneMapping);
	this.toneMapping.addValue("Uncharted", THREE.Uncharted2ToneMapping);
	this.toneMapping.addValue("Cineon", THREE.CineonToneMapping);
	this.toneMapping.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "toneMapping", self.toneMapping.getValue()));
		self.updateRenderer();
	});
	this.form.add(this.toneMapping);
	this.form.nextRow();

	//Tonemapping exposure
	this.form.addText("Exposure");
	this.toneMappingExposure = new NumberBox(this.form);
	this.toneMappingExposure.size.set(40, 18);
	this.toneMappingExposure.setRange(0.0, Number.MAX_SAFE_INTEGER);
	this.toneMappingExposure.setStep(0.1);
	this.toneMappingExposure.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "toneMappingExposure", self.toneMappingExposure.getValue()));
		self.updateRenderer();
	});
	this.form.add(this.toneMappingExposure);
	this.form.nextRow();

	//Tonemapping whitepoint
	this.form.addText("Whitepoint");
	this.toneMappingWhitePoint = new NumberBox(this.form);
	this.toneMappingWhitePoint.size.set(40, 18);
	this.toneMappingWhitePoint.setRange(0.0, Number.MAX_SAFE_INTEGER);
	this.toneMappingWhitePoint.setStep(0.1);
	this.toneMappingWhitePoint.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "toneMappingWhitePoint", self.toneMappingWhitePoint.getValue()));
		self.updateRenderer();
	});
	this.form.add(this.toneMappingWhitePoint);
	this.form.nextRow();

}

ProgramPanel.prototype = Object.create(ObjectPanel.prototype);

ProgramPanel.prototype.updateRenderer = function()
{
	var tab = Editor.gui.tab.getActiveTab();
	
	if(tab instanceof SceneEditor)
	{
		tab.initializeRenderer();
	}
};

//Update panel content from attached object
ProgramPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	this.author.setText(this.obj.author);
	this.version.setText(this.obj.version);
	this.lockPointer.setValue(this.obj.lockPointer);
	this.handlePixelRatio.setValue(this.obj.handlePixelRatio);
	this.vr.setValue(this.obj.vr);
	this.vrScale.setValue(this.obj.vrScale);

	this.shadows.setValue(this.obj.shadows);
	this.shadowsType.setValue(this.obj.shadowsType);
	this.antialiasing.setValue(this.obj.antialiasing);
	this.toneMapping.setValue(this.obj.toneMapping);
	this.toneMappingExposure.setValue(this.obj.toneMappingExposure);
	this.toneMappingWhitePoint.setValue(this.obj.toneMappingWhitePoint);
};
