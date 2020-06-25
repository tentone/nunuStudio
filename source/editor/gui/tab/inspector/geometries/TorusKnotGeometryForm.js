"use strict";

function TorusKnotGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText(Locale.torusKnot);
	this.form.nextRow();

	// Radius
	this.form.addText(Locale.radius);
	this.radius = new NumberBox(this.form);
	this.radius.size.set(0, 18);
	this.radius.setStep(0.1);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();
	
	// Tube
	this.form.addText(Locale.tube);
	this.tube = new NumberBox(this.form);
	this.tube.size.set(0, 18);
	this.tube.setStep(0.1);
	this.tube.setOnChange(updateGeometry);
	this.form.add(this.tube);
	this.form.nextRow();

	// Segments
	this.form.addText(Locale.segments);
	this.form.nextRow();
	
	this.form.addText(Locale.radial);
	this.radialSegments = new NumberBox(this.form);
	this.radialSegments.size.set(0, 18);
	this.radialSegments.setStep(1);
	this.radialSegments.setOnChange(updateGeometry);
	this.form.add(this.radialSegments);
	this.form.nextRow();
	
	this.form.addText(Locale.tubular);
	this.tubularSegments = new NumberBox(this.form);
	this.tubularSegments.size.set(0, 18);
	this.tubularSegments.setStep(1);
	this.tubularSegments.setOnChange(updateGeometry);
	this.form.add(this.tubularSegments);
	this.form.nextRow();

	// Axis winds
	this.form.addText(Locale.axisWinds);
	this.p = new NumberBox(this.form);
	this.p.size.set(0, 18);
	this.p.setStep(0.1);
	this.p.setOnChange(updateGeometry);
	this.form.add(this.p);
	this.form.nextRow();

	// Circle winds
	this.form.addText(Locale.circleWinds);
	this.q = new NumberBox(this.form);
	this.q.size.set(0, 18);
	this.q.setStep(0.1);
	this.q.setOnChange(updateGeometry);
	this.form.add(this.q);
	this.form.nextRow();
	
	// Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText(Locale.buffered);
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

TorusKnotGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();
	var GeometryConstructor = this.buffer.getValue() ? THREE.TorusKnotBufferGeometry : THREE.TorusKnotGeometry;
	Editor.addAction(new ChangeAction(this.object, "geometry", new GeometryConstructor(this.radius.getValue(), this.tube.getValue(), this.tubularSegments.getValue(), this.radialSegments.getValue(), this.p.getValue(), this.q.getValue())));
};

TorusKnotGeometryForm.prototype.updateValues = function()
{
	this.radius.setValue(this.object.geometry.parameters.radius || 1);
	this.tube.setValue(this.object.geometry.parameters.tube || 0.4);
	this.radialSegments.setValue(this.object.geometry.parameters.radialSegments || 8);
	this.tubularSegments.setValue(this.object.geometry.parameters.tubularSegments || 64);
	this.p.setValue(this.object.geometry.parameters.p || 2);
	this.q.setValue(this.object.geometry.parameters.q || 3);
	this.buffer.setValue(this.object.geometry instanceof THREE.BufferGeometry);
};