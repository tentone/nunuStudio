"use strict";

function LeapPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Mode
	this.form.addText("Mode");
	this.mode = new DropdownList(this.form.element);
	this.mode.size.set(80, 18);
	this.mode.addValue("Desk", Script.INIT);
	this.mode.addValue("HMD", Script.LOOP);
	this.mode.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.mode = self.mode.getSelectedIndex();
		}
	});
	this.form.add(this.mode);
	this.form.nextRow();

	//Debug model
	this.debug_model = new CheckBox(this.form.element);
	this.debug_model.setText("Debug model");
	this.debug_model.size.set(200, 15);
	this.debug_model.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.debug_model = self.debug_model.getValue();
		}
	});
	this.form.add(this.debug_model);
	this.form.nextRow();

	//Gestures Enabled
	this.gestures_enabled = new CheckBox(this.form.element);
	this.gestures_enabled.setText("Gestures Enabled");
	this.gestures_enabled.size.set(200, 15);
	this.gestures_enabled.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.gestures_enabled = self.gestures_enabled.getValue();
		}
	});
	this.form.add(this.gestures_enabled);
	this.form.nextRow();

	//Poses Enabled
	this.poses_enabled = new CheckBox(this.form.element);
	this.poses_enabled.setText("Poses Enabled");
	this.poses_enabled.size.set(200, 15);
	this.poses_enabled.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.poses_enabled = self.poses_enabled.getValue();
		}
	});
	this.form.add(this.poses_enabled);

	//Update form
	this.form.updateInterface();
}

//Super prototypes
LeapPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
LeapPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	if(this.obj !== null)
	{
		this.mode.setSelectedIndex(this.obj.mode);
		this.debug_model.setValue(this.obj.debug_model);
		this.gestures_enabled.setValue(this.obj.gestures_enabled);
		this.poses_enabled.setValue(this.obj.poses_enabled);
	}
}
