"use strict";

function CylinderGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText("Cylinder Geometry");
	this.form.nextRow();

	//Radius
	this.form.addText("Radius");
	this.form.addText("T", true);
	this.radiusTop = new NumberBox(this.form);
	this.radiusTop.size.set(40, 18);
	this.radiusTop.setStep(0.1);
	this.radiusTop.setOnChange(updateGeometry);
	this.form.add(this.radiusTop);

	this.form.addText("B", true);
	this.radiusBottom = new NumberBox(this.form);
	this.radiusBottom.size.set(40, 18);
	this.radiusBottom.setStep(0.1);
	this.radiusBottom.setOnChange(updateGeometry);
	this.form.add(this.radiusBottom);
	this.form.nextRow();

	//Height
	this.form.addText("Height");
	this.height = new NumberBox(this.form);
	this.height.size.set(40, 18);
	this.height.setStep(0.1);
	this.height.setOnChange(updateGeometry);
	this.form.add(this.height);
	this.form.nextRow();

	//Segments
	this.form.addText("Segments");
	this.form.addText("R", true);
	this.radialSegments = new NumberBox(this.form);
	this.radialSegments.size.set(40, 18);
	this.radialSegments.setStep(1);
	this.radialSegments.setOnChange(updateGeometry);
	this.form.add(this.radialSegments);

	this.form.addText("H", true);
	this.heightSegments = new NumberBox(this.form);
	this.heightSegments.size.set(40, 18);
	this.heightSegments.setStep(1);
	this.heightSegments.setOnChange(updateGeometry);
	this.form.add(this.heightSegments);
	this.form.nextRow();

	//Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText("Buffered");
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

CylinderGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();
	var GeometryConstructor = this.buffer.getValue() ? THREE.CylinderBufferGeometry : THREE.CylinderGeometry;
	Editor.addAction(new ChangeAction(this.object, "geometry", new GeometryConstructor(this.radiusTop.getValue(), this.radiusBottom.getValue(), this.height.getValue(), this.radialSegments.getValue(), this.heightSegments.getValue())));
};

CylinderGeometryForm.prototype.updateValues = function()
{
	this.radiusTop.setValue(this.object.geometry.parameters.radiusTop || 20);
	this.radiusBottom.setValue(this.object.geometry.parameters.radiusBottom || 20);
	this.height.setValue(this.object.geometry.parameters.height || 100);
	this.radialSegments.setValue(this.object.geometry.parameters.radialSegments || 8);
	this.heightSegments.setValue(this.object.geometry.parameters.heightSegments || 1);
	this.buffer.setValue(this.object.geometry instanceof THREE.BufferGeometry);
};