"use strict";

function OrthographicCameraPanel(parent)
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

	//Size
	this.form.addText("Size");
	this.size = new NumberBox(this.form.element);
	this.size.size.set(80, 18);
	this.size.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.size = self.size.getValue();
			self.obj.updateProjectionMatrix();
		}
	});
	this.form.add(this.size);
	this.form.nextRow();

	//Camera resize Mode
	this.form.addText("Resize Mode");
	this.mode = new DropdownList(this.form.element);
	this.mode.size.set(130, 18);
	this.mode.addValue("Horizontal", OrthographicCamera.FIXED_VERTICAL);
	this.mode.addValue("Vertical", OrthographicCamera.FIXED_HORIZONTAL);
	this.mode.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.mode = self.mode.getSelectedIndex();
		}
	});
	this.form.add(this.mode);
	this.form.nextRow();

	//Select camera as scene default
	this.default = new CheckBox(this.form.element);
	this.default.setText("Use camera");
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
					scene.addCamera(self.obj);
				}
				else
				{
					scene.removeCamera(self.obj);
				}
			}
		}
	});
	this.form.add(this.default);
	this.form.nextRow();
	
	//Distance
	this.form.addText("Clipping planes");
	this.form.nextRow();

	//Near
	this.form.addText("Near");
	this.near = new NumberBox(this.form.element);
	this.near.size.set(60, 18);
	this.near.setStep(0.1);
	this.near.setRange(0, Number.MAX_SAFE_INTEGER);
	this.near.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.near = self.near.getValue();
		}
	});
	this.form.add(this.near);

	//Far
	this.form.addText("Far");
	this.far = new NumberBox(this.form.element);
	this.far.size.set(80, 18);
	this.far.setRange(0, Number.MAX_SAFE_INTEGER);
	this.far.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.far = self.far.getValue();
		}
	});
	this.form.add(this.far);
	this.form.nextRow();

	//Viewport
	this.form.addText("Viewport");
	this.form.nextRow();

	//Offset
	this.form.addText("Start");
	this.offset = new CoordinatesBox(this.form.element);
	this.offset.setMode(CoordinatesBox.VECTOR2);
	this.offset.size.set(160, 20);
	this.offset.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.offset.copy(self.offset.getValue());
		}
	});
	this.form.add(this.offset);
	this.form.nextRow();

	//Viewport size
	this.form.addText("Size");
	this.viewport = new CoordinatesBox(this.form.element);
	this.viewport.setMode(CoordinatesBox.VECTOR2);
	this.viewport.size.set(160, 20);
	this.viewport.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.viewport.copy(self.viewport.getValue());
		}
	});
	this.form.add(this.viewport);
	this.form.nextRow();

	//Clear color
	this.clear_color = new CheckBox(this.form.element);
	this.clear_color.setText("Clear color");
	this.clear_color.size.set(200, 15);
	this.clear_color.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.clear_color = self.clear_color.getValue();
		}
	});
	this.form.add(this.clear_color);
	this.form.nextRow();

	//Clear depth
	this.clear_depth = new CheckBox(this.form.element);
	this.clear_depth.setText("Clear depth");
	this.clear_depth.size.set(200, 15);
	this.clear_depth.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.clear_depth = self.clear_depth.getValue();
		}
	});
	this.form.add(this.clear_depth);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

//Super Prototypes
OrthographicCameraPanel.prototype = Object.create(Panel.prototype);

//Update panel content from attached object
OrthographicCameraPanel.prototype.updatePanel = function()
{
	if(this.obj !== null)
	{
		this.name.setText(this.obj.name);
		this.position.setValue(this.obj.position.x, this.obj.position.y, this.obj.position.z);
		this.rotation.setValue(this.obj.rotation.x, this.obj.rotation.y, this.obj.rotation.z);
		this.size.setValue(this.obj.size);
		this.mode.setSelectedIndex(this.obj.mode);
		this.default.setValue(ObjectUtils.getScene(this.obj).cameras.indexOf(this.obj) !== -1);
		this.near.setValue(this.obj.near);
		this.far.setValue(this.obj.far);
		this.offset.setValue(this.obj.offset);
		this.viewport.setValue(this.obj.viewport);
		this.clear_color.setValue(this.obj.clear_color);
		this.clear_depth.setValue(this.obj.clear_depth);
	}
}
