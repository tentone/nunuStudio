"use strict";

function TorusGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	//Update geometry function
	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText("Torus Geometry");
	this.form.nextRow();

	//Radius
	this.form.addText("Radius");
	this.radius = new NumberBox(this.form);
	this.radius.size.set(40, 18);
	this.radius.setStep(0.1);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();
	
	//Tube
	this.form.addText("Tube");
	this.tube = new NumberBox(this.form);
	this.tube.size.set(40, 18);
	this.tube.setStep(0.1);
	this.tube.setOnChange(updateGeometry);
	this.form.add(this.tube);
	this.form.nextRow();

	//Segments
	this.form.addText("Segments");
	this.form.addText("R", true);
	this.radialSegments = new NumberBox(this.form);
	this.radialSegments.size.set(40, 18);
	this.radialSegments.setStep(1);
	this.radialSegments.setOnChange(updateGeometry);
	this.form.add(this.radialSegments);

	this.form.addText("T", true);
	this.tubularSegments = new NumberBox(this.form);
	this.tubularSegments.size.set(40, 18);
	this.tubularSegments.setStep(1);
	this.tubularSegments.setOnChange(updateGeometry);
	this.form.add(this.tubularSegments);
	this.form.nextRow();
	
	//Arc
	this.form.addText("Arc");
	this.arc = new NumberBox(this.form);
	this.arc.size.set(40, 18);
	this.arc.setStep(0.1);
	this.arc.setRange(0, Math.PI * 2);
	this.arc.setOnChange(updateGeometry);
	this.form.add(this.arc);
	this.form.nextRow();

	//Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText("Buffered");
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

TorusGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();
	var GeometryConstructor = this.buffer.getValue() ? THREE.TorusBufferGeometry : THREE.TorusGeometry;
	Editor.history.add(new ChangeAction(this.object, "geometry", new GeometryConstructor(this.radius.getValue(), this.tube.getValue(), this.radialSegments.getValue(), this.tubularSegments.getValue(), this.arc.getValue())));
};

TorusGeometryForm.prototype.updateValues = function()
{
	this.radius.setValue(this.object.geometry.parameters.radius || 100);
	this.tube.setValue(this.object.geometry.parameters.tube || 40);
	this.radialSegments.setValue(this.object.geometry.parameters.radialSegments || 8);
	this.tubularSegments.setValue(this.object.geometry.parameters.tubularSegments || 6);
	this.arc.setValue(this.object.geometry.parameters.arc || Math.PI * 2);
	this.buffer.setValue(this.object.geometry instanceof THREE.BufferGeometry);
};