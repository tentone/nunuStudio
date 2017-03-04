"use strict";

function BoxGeometryForm(form, obj)
{
	this.form = form;
	this.obj = obj;
	
	//Self pointer
	var self = this;

	//Update geometry function
	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText("Box Geometry");
	this.form.nextRow();
	
	//Size
	this.form.addText("Size")
	this.form.addText("X", true);
	this.width = new NumberBox(this.form.element);
	this.width.size.set(40, 18);
	this.width.setStep(0.1);
	this.width.setOnChange(updateGeometry);
	this.form.add(this.width);

	this.form.addText("Y", true);
	this.height = new NumberBox(this.form.element);
	this.height.size.set(40, 18);
	this.height.setStep(0.1);
	this.height.setOnChange(updateGeometry);
	this.form.add(this.height);

	this.form.addText("Z", true);
	this.depth = new NumberBox(this.form.element);
	this.depth.size.set(40, 18);
	this.depth.setStep(0.1);
	this.depth.setOnChange(updateGeometry);
	this.form.add(this.depth);
	this.form.nextRow();

	//Segments
	this.form.addText("Segments")
	this.form.addText("X", true);
	this.widthSegments = new NumberBox(this.form.element);
	this.widthSegments.size.set(40, 18);
	this.widthSegments.setStep(1);
	this.widthSegments.setOnChange(updateGeometry);
	this.form.add(this.widthSegments);

	this.form.addText("Y", true);
	this.heightSegments = new NumberBox(this.form.element);
	this.heightSegments.size.set(40, 18);
	this.heightSegments.setStep(1);
	this.heightSegments.setOnChange(updateGeometry);
	this.form.add(this.heightSegments);

	this.form.addText("Z", true);
	this.depthSegments = new NumberBox(this.form.element);
	this.depthSegments.size.set(40, 18);
	this.depthSegments.setStep(1);
	this.depthSegments.setOnChange(updateGeometry);
	this.form.add(this.depthSegments);
	this.form.nextRow();

	//Buffer
	this.buffer = new CheckBox(this.form.element);
	this.form.addText("Buffered");
	this.buffer.size.set(20, 15);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();

	this.updateValues();
}

BoxGeometryForm.prototype.updateGeometry = function()
{
	this.obj.geometry.dispose();

	if(this.buffer.getValue())
	{
		this.obj.geometry = new BoxBufferGeometry(this.width.getValue(), this.height.getValue(), this.depth.getValue(), this.widthSegments.getValue(), this.heightSegments.getValue(), this.depthSegments.getValue());
	}
	else
	{
		this.obj.geometry = new BoxGeometry(this.width.getValue(), this.height.getValue(), this.depth.getValue(), this.widthSegments.getValue(), this.heightSegments.getValue(), this.depthSegments.getValue());
	}
};

BoxGeometryForm.prototype.updateValues = function()
{
	this.width.setValue(this.obj.geometry.parameters.width || 1);
	this.height.setValue(this.obj.geometry.parameters.height || 1);
	this.depth.setValue(this.obj.geometry.parameters.depth || 1);
	this.widthSegments.setValue(this.obj.geometry.parameters.widthSegments || 1);
	this.heightSegments.setValue(this.obj.geometry.parameters.heightSegments || 1);
	this.depthSegments.setValue(this.obj.geometry.parameters.depthSegments || 1);
	this.buffer.setValue(this.obj.geometry instanceof THREE.BufferGeometry);
};