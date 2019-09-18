"use strict";

function SphereGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText("Sphere Geometry");
	this.form.nextRow();

	//Radius
	this.form.addText("Radius");
	this.radius = new NumberBox(this.form);
	this.radius.size.set(40, 18);
	this.radius.setStep(0.1);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();

	//Segments
	this.form.addText("Segments");
	this.segmentsRow = new NumberRow(this.form);
	this.segmentsRow.size.set(0, 18);

	this.widthSegments = this.segmentsRow.addValue("W");
	this.widthSegments.setStep(1);
	this.widthSegments.setOnChange(updateGeometry);

	this.heightSegments = this.segmentsRow.addValue("H");
	this.heightSegments.setStep(1);
	this.heightSegments.setOnChange(updateGeometry);

	this.form.add(this.segmentsRow);
	this.form.nextRow();

	this.form.addText("Phi Start");
	this.phiStart = new NumberBox(this.form);
	this.phiStart.size.set(40, 18);
	this.phiStart.setStep(0.01);
	this.phiStart.setOnChange(updateGeometry);
	this.form.add(this.phiStart);
	this.form.nextRow();
	
	this.form.addText("Phi Length");
	this.phiLength = new NumberBox(this.form);
	this.phiLength.size.set(40, 18);
	this.phiLength.setStep(0.01);
	this.phiLength.setOnChange(updateGeometry);
	this.form.add(this.phiLength);
	this.form.nextRow();

	this.form.addText("Theta Start");
	this.thetaStart = new NumberBox(this.form);
	this.thetaStart.size.set(40, 18);
	this.thetaStart.setStep(0.01);
	this.thetaStart.setOnChange(updateGeometry);
	this.form.add(this.thetaStart);
	this.form.nextRow();

	this.form.addText("Theta Length");
	this.thetaLength = new NumberBox(this.form);
	this.thetaLength.size.set(40, 18);
	this.thetaLength.setStep(0.01);
	this.thetaLength.setOnChange(updateGeometry);
	this.form.add(this.thetaLength);
	this.form.nextRow();

	//Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText("Buffered");
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

SphereGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();
	var GeometryConstructor = this.buffer.getValue() ? THREE.SphereBufferGeometry : THREE.SphereGeometry;
	Editor.addAction(new ChangeAction(this.object, "geometry", new GeometryConstructor(this.radius.getValue(), this.widthSegments.getValue(), this.heightSegments.getValue(), this.phiStart.getValue(), this.phiLength.getValue(), this.thetaStart.getValue(), this.thetaLength.getValue())));
};

SphereGeometryForm.prototype.updateValues = function()
{
	this.radius.setValue(this.object.geometry.parameters.radius || 50);
	this.widthSegments.setValue(this.object.geometry.parameters.widthSegments || 8);
	this.heightSegments.setValue(this.object.geometry.parameters.heightSegments || 6);
	this.phiStart.setValue(this.object.geometry.parameters.phiStart || 0);
	this.phiLength.setValue(this.object.geometry.parameters.phiLength || Math.PI * 2);
	this.thetaStart.setValue(this.object.geometry.parameters.thetaStart || 0);
	this.thetaLength.setValue(this.object.geometry.parameters.thetaStart || Math.PI);
	this.buffer.setValue(this.object.geometry instanceof THREE.BufferGeometry);
};