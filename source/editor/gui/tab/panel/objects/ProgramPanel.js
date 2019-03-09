"use strict";

function ProgramPanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

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
		Editor.addAction(new ChangeAction(self.object, "author", self.author.getText()));
	});
	this.form.add(this.author);
	this.form.nextRow();
	
	//Version
	this.form.addText("Version");
	this.version = new TextBox(this.form);
	this.version.size.set(100, 18);
	this.version.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "version", self.version.getText()));
	});
	this.form.add(this.version);
	this.form.nextRow();

	//Mouse lock
	this.lockPointer = new CheckBox(this.form);
	this.form.addText("Lock pointer");
	this.lockPointer.size.set(18, 18);
	this.lockPointer.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "lockPointer", self.lockPointer.getValue()));
	});
	this.form.add(this.lockPointer);
	this.form.nextRow();
	
	//Handle pixel ratio
	this.handlePixelRatio = new CheckBox(this.form);
	this.form.addText("Pixel Ratio");
	this.handlePixelRatio.size.set(18, 18);
	this.handlePixelRatio.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "handlePixelRatio", self.handlePixelRatio.getValue()));
	});
	this.form.add(this.handlePixelRatio);
	this.form.nextRow()

	//VR
	this.form.addText("Virtual Reality");
	this.form.nextRow();

	//VR Enabled
	this.vr = new CheckBox(this.form);
	this.form.addText("VR Enabled");
	this.vr.size.set(18, 18);
	this.vr.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "vr", self.vr.getValue()));
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
		Editor.addAction(new ChangeAction(self.object, "vrScale", self.vrScale.getValue()));
	});
	this.form.add(this.vrScale);
	this.form.nextRow();

	//Rendering
	this.form.addText("Rendering");
	this.form.nextRow();
	this.rendererConfig = new RendererConfigurationFormTemplate(this.form, object.rendererConfig);
}

ProgramPanel.prototype = Object.create(ObjectPanel.prototype);

ProgramPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	this.author.setText(this.object.author);
	this.version.setText(this.object.version);
	this.lockPointer.setValue(this.object.lockPointer);
	this.handlePixelRatio.setValue(this.object.handlePixelRatio);
	this.vr.setValue(this.object.vr);
	this.vrScale.setValue(this.object.vrScale);

	this.rendererConfig.attach(this.object.rendererConfig);
};
