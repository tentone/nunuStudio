"use strict";

function ConeGeometryForm(form, obj)
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

	this.form.addText("Cone Geometry");
	this.form.nextRow();

	//Radius
	this.form.addText("Radius");
	this.radius = new NumberBox(this.form.element);
	this.radius.size.set(40, 18);
	this.radius.setStep(0.1);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();

	this.form.addText("Height");
	this.height = new NumberBox(this.form.element);
	this.height.size.set(40, 18);
	this.height.setStep(0.1);
	this.height.setOnChange(updateGeometry);
	this.form.add(this.height);
	this.form.nextRow();

	//Segments
	this.form.addText("Segments");
	this.form.addText("R", true);
	this.radialSegments = new NumberBox(this.form.element);
	this.radialSegments.size.set(40, 18);
	this.radialSegments.setRange(3, Number.MAX_SAFE_INTEGER);
	this.radialSegments.setStep(1);
	this.radialSegments.setOnChange(updateGeometry);
	this.form.add(this.radialSegments);

	this.form.addText("H", true);
	this.heightSegments = new NumberBox(this.form.element);
	this.heightSegments.setRange(1, Number.MAX_SAFE_INTEGER);
	this.heightSegments.size.set(40, 18);
	this.heightSegments.setStep(1);
	this.heightSegments.setOnChange(updateGeometry);
	this.form.add(this.heightSegments);
	this.form.nextRow();

	//Buffer
	this.buffer = new CheckBox(this.form.element);
	this.form.addText("Buffered");
	this.buffer.size.set(15, 15);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

ConeGeometryForm.prototype.updateGeometry = function()
{
	this.obj.geometry.dispose();

	if(this.buffer.getValue())
	{
		this.obj.geometry = new THREE.ConeBufferGeometry(this.radius.getValue(), this.height.getValue(), this.radialSegments.getValue(), this.heightSegments.getValue());
	}
	else
	{
		this.obj.geometry = new THREE.ConeGeometry(this.radius.getValue(), this.height.getValue(), this.radialSegments.getValue(), this.heightSegments.getValue());
	}
};

ConeGeometryForm.prototype.updateValues = function()
{
	this.radius.setValue(this.obj.geometry.parameters.radius || 20);
	this.height.setValue(this.obj.geometry.parameters.height || 100);
	this.radialSegments.setValue(this.obj.geometry.parameters.radialSegments || 8);
	this.heightSegments.setValue(this.obj.geometry.parameters.heightSegments || 1);
	this.buffer.setValue(this.obj.geometry instanceof THREE.BufferGeometry);
};