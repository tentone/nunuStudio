"use strict";

function SphereGeometryForm(form, obj)
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

	this.form.addText("Sphere Geometry");
	this.form.nextRow();

	//Radius
	this.form.addText("Radius")
	this.radius = new NumberBox(this.form.element);
	this.radius.size.set(40, 18);
	this.radius.setStep(0.1);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();

	//Segments
	this.form.addText("Segments")
	this.form.addText("W", true);
	this.widthSegments = new NumberBox(this.form.element);
	this.widthSegments.size.set(40, 18);
	this.widthSegments.setStep(1);
	this.widthSegments.setOnChange(updateGeometry);
	this.form.add(this.widthSegments);

	this.form.addText("H", true);
	this.heightSegments = new NumberBox(this.form.element);
	this.heightSegments.size.set(40, 18);
	this.heightSegments.setStep(1);
	this.heightSegments.setOnChange(updateGeometry);
	this.form.add(this.heightSegments);
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

SphereGeometryForm.prototype.updateGeometry = function()
{
	this.obj.geometry.dispose();

	if(this.buffer.getValue())
	{
		this.obj.geometry = new SphereBufferGeometry(this.radius.getValue(), this.widthSegments.getValue(), this.heightSegments.getValue());
	}
	else
	{
		this.obj.geometry = new SphereGeometry(this.radius.getValue(), this.widthSegments.getValue(), this.heightSegments.getValue());
	}
};

SphereGeometryForm.prototype.updateValues = function()
{
	this.radius.setValue(this.obj.geometry.parameters.radius || 50);
	this.widthSegments.setValue(this.obj.geometry.parameters.widthSegments || 8);
	this.heightSegments.setValue(this.obj.geometry.parameters.heightSegments || 6);
	this.buffer.setValue(this.obj.geometry instanceof THREE.BufferGeometry);
};