"use strict";

function PerspectiveCameraPanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Fov
	this.form.addText("FOV");
	this.fov = new Slider(this.form);
	this.fov.size.set(160, 18);
	this.fov.setRange(30, 160);
	this.fov.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "fov", self.fov.getValue()));
		self.object.updateProjectionMatrix();
	});
	this.form.add(this.fov);
	this.form.nextRow();

	//Camera used
	this.use = new CheckBox(this.form);
	this.form.addText("Use camera");
	this.use.size.set(18, 18);
	this.use.setOnChange(function()
	{
		var scene = self.object.getScene();
		if(self.use.getValue() && scene !== null)
		{
			scene.addCamera(self.object);
		}
		else
		{
			scene.removeCamera(self.object);
		}
	});
	this.form.add(this.use);
	this.form.nextRow();

	//Distance
	this.form.addText("Clipping planes");
	this.form.nextRow();

	//Near
	this.form.addText("Near");
	this.near = new NumberBox(this.form);
	this.near.size.set(60, 18);
	this.near.setStep(0.1);
	this.near.setRange(0, Number.MAX_SAFE_INTEGER);
	this.near.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "near", self.near.getValue()));
	});
	this.form.add(this.near);
	this.form.nextRow();
	
	//Far
	this.form.addText("Far");
	this.far = new NumberBox(this.form);
	this.far.size.set(80, 18);
	this.far.setRange(0, Number.MAX_SAFE_INTEGER);
	this.far.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "far", self.far.getValue()));
	});
	this.form.add(this.far);
	this.form.nextRow();

	//Viewport
	this.form.addText(Locale.viewport);
	this.form.nextRow();
	this.viewport = new ViewportFormTemplate(this.form, object);
	
	//Order
	this.form.addText("Render Order").setAltText("Camera with lower order renders first.");
	this.order = new NumberBox(this.form);
	this.order.size.set(80, 18);
	this.order.setRange(0, Number.MAX_SAFE_INTEGER);
	this.order.setStep(1);
	this.order.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "order", self.order.getValue()));
		var scene = self.object.getScene();
		scene.updateCameraOrder();
	});
	this.form.add(this.order);
	this.form.nextRow();

	//Clear color
	this.clearColor = new CheckBox(this.form);
	this.form.addText("Clear color");
	this.clearColor.size.set(18, 18);
	this.clearColor.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "clearColor", self.clearColor.getValue()));
	});
	this.form.add(this.clearColor);
	this.form.nextRow();

	//Clear depth
	this.clearDepth = new CheckBox(this.form);
	this.form.addText("Clear depth");
	this.clearDepth.size.set(18, 18);
	this.clearDepth.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "clearDepth", self.clearDepth.getValue()));
	});
	this.form.add(this.clearDepth);
	this.form.nextRow();

	//Clear stencil
	this.clearStencil = new CheckBox(this.form);
	this.form.addText("Clear stencil");
	this.clearStencil.size.set(18, 18);
	this.clearStencil.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "clearStencil", self.clearStencil.getValue()));
	});
	this.form.add(this.clearStencil);
	this.form.nextRow();
}

PerspectiveCameraPanel.prototype = Object.create(ObjectPanel.prototype);

PerspectiveCameraPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);

	this.fov.setValue(this.object.fov);
	this.use.setValue(this.object.getScene().isCameraActive(this.object));
	this.near.setValue(this.object.near);
	this.far.setValue(this.object.far);
	this.order.setValue(this.object.order);
	this.clearColor.setValue(this.object.clearColor);
	this.clearDepth.setValue(this.object.clearDepth);
	this.clearStencil.setValue(this.object.clearStencil);
	this.viewport.attach(this.object.viewport);
};
