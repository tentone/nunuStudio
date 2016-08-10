"use strict";

function PerspectiveCameraPanel(parent)
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

	//Fov
	this.form.addText("FOV");
	this.fov = new Slider(this.form.element);
	this.fov.size.set(160, 18);
	this.fov.setRange(30, 160);
	this.fov.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.fov = self.fov.getValue();
			self.obj.updateProjectionMatrix();
			self.fov_text.setText(self.obj.fov);
		}
	});
	this.form.add(this.fov);
	this.fov_text = this.form.addText("");
	this.fov_text.setAlignment(Text.LEFT);
	this.form.nextRow();

	//Select camera as scene default
	this.default = new CheckBox(this.form.element);
	this.default.setText("Default camera");
	this.default.size.set(200, 15);
	this.default.setOnChange(function()
	{
		if(self.obj !== null)
		{
			var scene = ObjectUtils.getScene(self.obj);
			if(scene !== null)
			{
				if(self.default.getValue())
				{
					scene.initial_camera = self.obj.uuid;
				}
				else
				{
					scene.initial_camera = null;
				}
			}
		}
	});
	this.form.add(this.default);

	//Update form
	this.form.updateInterface();
}

//Functions Prototype
PerspectiveCameraPanel.prototype = Object.create(Panel.prototype);
PerspectiveCameraPanel.prototype.updatePanel = updatePanel;

//Update panel content from attached object
function updatePanel()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.position.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);
		this.fov.setValue(this.obj.fov);
		this.fov_text.setText(this.obj.fov);

		var scene = ObjectUtils.getScene(this.obj);
		if(scene !== null)
		{
			this.default.setValue(scene.initial_camera === this.obj.uuid);
		}
		else
		{
			this.default.setValue(false);
		}
	}
}
