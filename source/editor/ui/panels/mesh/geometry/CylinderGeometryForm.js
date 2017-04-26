"use strict";

function CylinderGeometryForm(form, obj)
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

	this.form.addText("Cylinder Geometry");
	this.form.nextRow();

	//Radius
	this.form.addText("Radius");
	this.form.addText("T", true);
	this.radiusTop = new NumberBox(this.form.element);
	this.radiusTop.size.set(40, 18);
	this.radiusTop.setStep(0.1);
	this.radiusTop.setOnChange(updateGeometry);
	this.form.add(this.radiusTop);

	this.form.addText("B", true);
	this.radiusBottom = new NumberBox(this.form.element);
	this.radiusBottom.size.set(40, 18);
	this.radiusBottom.setStep(0.1);
	this.radiusBottom.setOnChange(updateGeometry);
	this.form.add(this.radiusBottom);
	this.form.nextRow();

	//Height
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
	this.radialSegments.setStep(1);
	this.radialSegments.setOnChange(updateGeometry);
	this.form.add(this.radialSegments);

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

CylinderGeometryForm.prototype.updateGeometry = function()
{
	this.obj.geometry.dispose();

	if(this.buffer.getValue())
	{
		this.obj.geometry = new CylinderBufferGeometry(this.radiusTop.getValue(), this.radiusBottom.getValue(), this.height.getValue(), this.radialSegments.getValue(), this.heightSegments.getValue());
	}
	else
	{
		this.obj.geometry = new CylinderGeometry(this.radiusTop.getValue(), this.radiusBottom.getValue(), this.height.getValue(), this.radialSegments.getValue(), this.heightSegments.getValue());
	}
};

CylinderGeometryForm.prototype.updateValues = function()
{
	this.radiusTop.setValue(this.obj.geometry.parameters.radiusTop || 20);
	this.radiusBottom.setValue(this.obj.geometry.parameters.radiusBottom || 20);
	this.height.setValue(this.obj.geometry.parameters.height || 100);
	this.radialSegments.setValue(this.obj.geometry.parameters.radialSegments || 8);
	this.heightSegments.setValue(this.obj.geometry.parameters.heightSegments || 1);
	this.buffer.setValue(this.obj.geometry instanceof THREE.BufferGeometry);
};