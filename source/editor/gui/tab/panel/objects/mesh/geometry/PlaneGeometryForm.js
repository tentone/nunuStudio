"use strict";

function PlaneGeometryForm(form, obj)
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

	this.form.addText("Plane Geometry");
	this.form.nextRow();
	
	//Size
	this.form.addText("Size");
	this.form.addText("W", true);
	this.width = new NumberBox(this.form.element);
	this.width.size.set(40, 18);
	this.width.setStep(0.1);
	this.width.setOnChange(updateGeometry);
	this.form.add(this.width);

	this.form.addText("H", true);
	this.height = new NumberBox(this.form.element);
	this.height.size.set(40, 18);
	this.height.setStep(0.1);
	this.height.setOnChange(updateGeometry);
	this.form.add(this.height);
	this.form.nextRow();
	
	//Segments
	this.form.addText("Segments");
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
	this.buffer.size.set(15, 15);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

PlaneGeometryForm.prototype.updateGeometry = function()
{
	this.obj.geometry.dispose();

	var GeometryConstructor = this.buffer.getValue() ? THREE.PlaneBufferGeometry : THREE.PlaneGeometry;

	Editor.history.add(new ChangeAction(this.obj, "geometry", new GeometryConstructor(this.width.getValue(), this.height.getValue(), this.widthSegments.getValue(), this.heightSegments.getValue())));
};

PlaneGeometryForm.prototype.updateValues = function()
{
	this.width.setValue(this.obj.geometry.parameters.width || 1);
	this.height.setValue(this.obj.geometry.parameters.height || 1);
	this.widthSegments.setValue(this.obj.geometry.parameters.widthSegments || 1);
	this.heightSegments.setValue(this.obj.geometry.parameters.heightSegments || 1);
	this.buffer.setValue(this.obj.geometry instanceof THREE.BufferGeometry);
};