"use strict";

function ProgramPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Program information
	this.form.addText("Information");
	this.form.nextRow();

	//Author
	this.form.addText("Author");
	this.author = new TextBox(this.form.element);
	this.author.position.set(50, 35);
	this.author.size.set(190, 18);
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

	//Mouse lock
	this.lockPointer = new CheckBox(this.form.element);
	this.form.addText("Lock pointer");
	this.lockPointer.size.set(20, 15);
	this.lockPointer.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.lockPointer = self.lockPointer.getValue();
		}
	});
	this.form.add(this.lockPointer);
	this.form.nextRow();
	
	//VR
	this.form.addText("Virtual Reality");
	this.form.nextRow();

	//VR Enabled
	this.vr = new CheckBox(this.form.element);
	this.form.addText("VR Enabled");
	this.vr.size.set(20, 15);
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
	this.form.addText("Room Scale");
	this.vrScale = new NumberBox(this.form.element);
	this.vrScale.size.set(50, 18);
	this.vrScale.setRange(0, 1000);
	this.vrScale.setStep(0.05);
	this.vrScale.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.vrScale = self.vrScale.getValue();
		}
	});
	this.form.add(this.vrScale);
	this.form.nextRow();

	//Rendering
	this.form.addText("Rendering");
	this.form.nextRow();

	//Antialiasing
	this.antialiasing = new CheckBox(this.form.element);
	this.form.addText("Antialiasing");
	this.antialiasing.size.set(20, 15);
	this.antialiasing.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.antialiasing = self.antialiasing.getValue();
		}
	});
	this.form.add(this.antialiasing);
	this.form.nextRow();

	//Shadows
	this.shadows = new CheckBox(this.form.element);
	this.form.addText("Shadows");
	this.shadows.size.set(20, 15);
	this.shadows.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.shadows = self.shadows.getValue();
		}
	});
	this.form.add(this.shadows);
	this.form.nextRow();

	//Shadow type
	this.form.addText("Shadows type");
	this.shadowsType = new DropdownList(this.form.element);
	this.shadowsType.size.set(120, 20);
	this.shadowsType.addValue("Basic", THREE.BasicShadowMap);
	this.shadowsType.addValue("PCF", THREE.PCFShadowMap);
	this.shadowsType.addValue("PCF Soft", THREE.PCFSoftShadowMap);
	this.shadowsType.setOnChange(function()
	{
		self.obj.shadowsType = self.shadowsType.getValue();
	});
	this.form.add(this.shadowsType);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

ProgramPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
ProgramPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);

	if(this.obj !== null)
	{
		this.author.setText(this.obj.author);
		this.version.setText(this.obj.version);
		this.lockPointer.setValue(this.obj.lockPointer);
		this.vr.setValue(this.obj.vr);
		this.vrScale.setValue(this.obj.vrScale);

		this.shadows.setValue(this.obj.shadows);
		this.shadowsType.setValue(this.obj.shadowsType);
		this.antialiasing.setValue(this.obj.antialiasing);
	}
}
