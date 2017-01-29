"use strict";

function PerspectiveCameraPanel(parent, obj)
{
	//Scene
	this.scene = null;

	//Panel
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

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
		}
	});
	this.form.add(this.fov);
	this.form.nextRow();

	//Camera used
	this.use = new CheckBox(this.form.element);
	this.form.addText("Use camera");
	this.use.size.set(200, 15);
	this.use.setOnChange(function()
	{
		if(self.obj !== null && self.scene !== null)
		{
			if(self.use.getValue())
			{
				self.scene.addCamera(self.obj);
			}
			else
			{
				self.scene.removeCamera(self.obj);
			}
		}
	});
	this.form.add(this.use);
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
	this.form.addText("Position");
	this.offset = new CoordinatesBox(this.form.element);
	this.offset.setMode(CoordinatesBox.VECTOR2);
	this.offset.setStep(0.05);
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

	//Size
	this.form.addText("Size");
	this.viewport = new CoordinatesBox(this.form.element);
	this.viewport.setMode(CoordinatesBox.VECTOR2);
	this.viewport.setStep(0.05);
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
	
	//Order
	this.form.addText("Draw Order");
	this.order = new NumberBox(this.form.element);
	this.order.size.set(80, 18);
	this.order.setRange(0, Number.MAX_SAFE_INTEGER);
	this.order.setStep(1);
	this.order.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.order = self.order.getValue();
			self.scene.updateCameraOrder();
		}
	});
	this.form.add(this.order);
	this.form.nextRow();

	//Clear color
	this.clear_color = new CheckBox(this.form.element);
	this.form.addText("Clear color");
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
	this.form.addText("Clear depth");
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

//Super prototypes
PerspectiveCameraPanel.prototype = Object.create(Panel.prototype);

//Attach camera
PerspectiveCameraPanel.prototype.attach = function(obj)
{
	Panel.prototype.attach.call(this, obj);
	this.scene = ObjectUtils.getScene(obj);
}

//Update panel content from attached object
PerspectiveCameraPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);

	if(this.obj !== null)
	{
		this.fov.setValue(this.obj.fov);
		this.use.setValue(this.scene.cameras.indexOf(this.obj) !== -1);
		this.near.setValue(this.obj.near);
		this.far.setValue(this.obj.far);
		this.offset.setValue(this.obj.offset);
		this.viewport.setValue(this.obj.viewport);
		this.order.setValue(this.obj.order);
		this.clear_color.setValue(this.obj.clear_color);
		this.clear_depth.setValue(this.obj.clear_depth);
	}
}
