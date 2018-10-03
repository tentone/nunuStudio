"use strict";

function OrthographicCameraPanel(parent, object)
{
	//Scene
	this.scene = null;

	//Panel
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Size
	this.form.addText("Size");
	this.size = new NumberBox(this.form);
	this.size.size.set(80, 18);
	this.size.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "size", self.size.getValue()));
		self.object.updateProjectionMatrix();
	});
	this.form.add(this.size);
	this.form.nextRow();

	//Camera resize Mode
	this.form.addText("Resize Mode");
	this.mode = new DropdownList(this.form);
	this.mode.size.set(130, 18);
	this.mode.addValue("Horizontal", OrthographicCamera.RESIZE_HORIZONTAL);
	this.mode.addValue("Vertical", OrthographicCamera.RESIZE_VERTICAL);
	this.mode.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "mode", self.mode.getSelectedIndex()));
	});
	this.form.add(this.mode);
	this.form.nextRow();

	//Camera used
	this.use = new CheckBox(this.form);
	this.form.addText("Use camera");
	this.use.size.set(18, 18);
	this.use.setOnChange(function()
	{
		if(self.object !== null && self.scene !== null)
		{
			if(self.use.getValue())
			{
				self.scene.addCamera(self.object);
			}
			else
			{
				self.scene.removeCamera(self.object);
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
	this.near = new NumberBox(this.form);
	this.near.size.set(60, 18);
	this.near.setStep(0.1);
	this.near.setRange(0, Number.MAX_SAFE_INTEGER);
	this.near.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "near", self.near.getValue()));
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
		Editor.history.add(new ChangeAction(self.object, "far", self.far.getValue()));
	});
	this.form.add(this.far);
	this.form.nextRow();

	//Viewport
	this.form.addText("Viewport");
	this.form.nextRow();

	//Offset
	this.form.addText("Position");
	this.offset = new VectorBox(this.form);
	this.offset.setType(VectorBox.VECTOR2);
	this.offset.setStep(0.05);
	this.offset.size.set(160, 18);
	this.offset.setOnChange(function()
	{	
		var value = self.offset.getValue();
		Editor.history.add(new ActionBundle(
		[
			new ChangeAction(self.object.offset, "x", value.x),
			new ChangeAction(self.object.offset, "y", value.y)
		]));
	});
	this.form.add(this.offset);
	this.form.nextRow();

	//Size
	this.form.addText("Size");
	this.viewport = new VectorBox(this.form);
	this.viewport.setType(VectorBox.VECTOR2);
	this.viewport.setStep(0.05);
	this.viewport.size.set(160, 18);
	this.viewport.setOnChange(function()
	{
		var value = self.viewport.getValue();
		Editor.history.add(new ActionBundle(
		[
			new ChangeAction(self.object.viewport, "x", value.x),
			new ChangeAction(self.object.viewport, "y", value.y)
		]));
	});
	this.form.add(this.viewport);
	this.form.nextRow();

	//Order
	this.form.addText("Render Order").setAltText("Camera with lower order renders first.");
	this.order = new NumberBox(this.form);
	this.order.size.set(80, 18);
	this.order.setRange(0, Number.MAX_SAFE_INTEGER);
	this.order.setStep(1);
	this.order.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "order", self.order.getValue()));
		self.scene.updateCameraOrder();
	});
	this.form.add(this.order);
	this.form.nextRow();

	//Clear color
	this.form.addText("Clear color");
	this.clearColor = new CheckBox(this.form);
	this.clearColor.size.set(18, 18);
	this.clearColor.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "clearColor", self.clearColor.getValue()));
	});
	this.form.add(this.clearColor);
	this.form.nextRow();

	//Clear depth
	this.clearDepth = new CheckBox(this.form);
	this.form.addText("Clear depth");
	this.clearDepth.size.set(18, 18);
	this.clearDepth.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "clearDepth", self.clearDepth.getValue()));
	});
	this.form.add(this.clearDepth);
	this.form.nextRow();

	//Clear stencil
	this.clearStencil = new CheckBox(this.form);
	this.form.addText("Clear stencil");
	this.clearStencil.size.set(18, 18);
	this.clearStencil.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "clearStencil", self.clearStencil.getValue()));
	});
	this.form.add(this.clearStencil);
	this.form.nextRow();
}

OrthographicCameraPanel.prototype = Object.create(ObjectPanel.prototype);

OrthographicCameraPanel.prototype.attach = function(object)
{
	ObjectPanel.prototype.attach.call(this, object);

	this.scene = object.getScene();
}

OrthographicCameraPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	this.size.setValue(this.object.size);
	this.mode.setSelectedIndex(this.object.mode);
	this.use.setValue(this.scene.cameras.indexOf(this.object) !== -1);
	this.near.setValue(this.object.near);
	this.far.setValue(this.object.far);
	this.offset.setValue(this.object.offset);
	this.viewport.setValue(this.object.viewport);
	this.order.setValue(this.object.order);
	this.clearColor.setValue(this.object.clearColor);
	this.clearDepth.setValue(this.object.clearDepth);
	this.clearStencil.setValue(this.object.clearStencil);
};
