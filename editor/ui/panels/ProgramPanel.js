"use strict";

function ProgramPanel(parent)
{
	Panel.call(this, parent);

	//Self pointer
	var self = this;

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.name = self.name.getText();
			Editor.updateObjectViews();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	//Author
	this.form.addText("Author");
	this.author = new TextBox(this.form.element);
	this.author.position.set(50, 35);
	this.author.size.set(200, 18);
	this.author.updateInterface();
	this.author.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.author = self.author.getText();
		}
	});
	this.form.add(this.author);
	this.form.nextRow();
	
	//Version
	this.form.addText("Version");
	this.version = new TextBox(this.form.element);
	this.version.size.set(100, 18);
	this.version.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.version = self.version.getText();
		}
	});
	this.form.add(this.version);
	this.form.nextRow();

	//VR
	this.vr = new CheckBox(this.form.element);
	this.vr.setText("VR Enabled");
	this.vr.size.set(50, 15);
	this.vr.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.vr = self.vr.getValue();
		}
	});
	this.form.add(this.vr);
	this.form.nextRow();

	//VR Movement Scale
	this.form.addText("VR Movement Scale");
	this.vr_scale = new NumberBox(this.form.element);
	this.vr_scale.size.set(50, 18);
	this.vr_scale.setRange(0, 1000);
	this.vr_scale.setStep(0.05);
	this.vr_scale.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.vr_scale = self.vr_scale.getValue();
		}
	});
	this.form.add(this.vr_scale);

	//Update form
	this.form.updateInterface();
}

//Functions Prototype
ProgramPanel.prototype = Object.create(Panel.prototype);
ProgramPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.author.setText(this.obj.author);
		this.version.setText(this.obj.version);
		this.vr.setValue(this.obj.vr);
		this.vr_scale.setValue(this.obj.vr_scale);
	}
}
