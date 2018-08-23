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
	this.form.addText("Radius");
	this.radius = new NumberBox(this.form);
	this.radius.size.set(40, 18);
	this.radius.setStep(0.1);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();

	//Segments
	this.form.addText("Segments");
	this.form.addText("W", true);
	this.widthSegments = new NumberBox(this.form);
	this.widthSegments.size.set(40, 18);
	this.widthSegments.setStep(1);
	this.widthSegments.setOnChange(updateGeometry);
	this.form.add(this.widthSegments);

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
	this.buffer.size.set(15, 15);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

SphereGeometryForm.prototype.updateGeometry = function()
{
	this.obj.geometry.dispose();

	var GeometryConstructor = this.buffer.getValue() ? THREE.SphereBufferGeometry : THREE.SphereGeometry;

	Editor.history.add(new ChangeAction(this.obj, "geometry", new GeometryConstructor(this.radius.getValue(), this.widthSegments.getValue(), this.heightSegments.getValue())));
};

SphereGeometryForm.prototype.updateValues = function()
{
	this.radius.setValue(this.obj.geometry.parameters.radius || 50);
	this.widthSegments.setValue(this.obj.geometry.parameters.widthSegments || 8);
	this.heightSegments.setValue(this.obj.geometry.parameters.heightSegments || 6);
	this.buffer.setValue(this.obj.geometry instanceof THREE.BufferGeometry);
};