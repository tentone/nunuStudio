"use strict";

function LeapPanel(parent)
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

	//Position
	this.form.addText("Position");
	this.position = new CoordinatesBox(this.form.element);
	this.position.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var position = self.position.getValue();
			self.obj.position.set(position.x, position.y, position.z);
		}
	});
	this.form.add(this.position);
	this.form.nextRow();

	//Scale
	this.form.addText("Scale");
	this.scale = new CoordinatesBox(this.form.element);
	this.scale.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var scale = self.scale.getValue();
			self.obj.scale.set(scale.x, scale.y, scale.z);
		}
	});
	this.form.add(this.scale);
	this.form.nextRow();

	//Rotation
	this.form.addText("Rotation");
	this.rotation = new CoordinatesBox(this.form.element);
	this.rotation.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var rotation = self.rotation.getValue();
			self.obj.rotation.set(rotation.x, rotation.y, rotation.z);
		}
	});
	this.form.add(this.rotation);
	this.form.nextRow();

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

//Functions Prototype
LeapPanel.prototype = Object.create(Panel.prototype);
LeapPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.position.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.scale.setValue(this.obj.scale.x, this.obj.scale.y, this.obj.scale.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);
		this.mode.setSelectedIndex(this.obj.mode);
		this.debug_model.setValue(this.obj.debug_model);
		this.gestures_enabled.setValue(this.obj.gestures_enabled);
		this.poses_enabled.setValue(this.obj.poses_enabled);
	}
}
