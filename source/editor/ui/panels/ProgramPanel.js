"use strict";

function ProgramPanel(parent)
{
	Panel.call(this, parent);

	//Self pointer
	var self = this;

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

	//Mouse lock
	this.lock_pointer = new CheckBox(this.form.element);
	this.lock_pointer.setText("Lock pointer");
	this.lock_pointer.size.set(50, 15);
	this.lock_pointer.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.lock_pointer = self.lock_pointer.getValue();
		}
	});
	this.form.add(this.lock_pointer);
	this.form.nextRow();
	
	//VR
	this.form.addText("Virtual Reality");
	this.form.nextRow();

	//VR Enabled
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
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Super prototypes
ProgramPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
ProgramPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);

	if(this.obj !== null)
	{
		this.author.setText(this.obj.author);
		this.version.setText(this.obj.version);
		this.lock_pointer.setValue(this.obj.lock_pointer);
		this.vr.setValue(this.obj.vr);
		this.vr_scale.setValue(this.obj.vr_scale);
	}
}
