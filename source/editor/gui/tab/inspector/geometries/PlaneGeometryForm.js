"use strict";

function PlaneGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText(Locale.plane);
	this.form.nextRow();
	
	//Size
	this.form.addText(Locale.size);
	this.sizeRow = new NumberRow(this.form);
	this.sizeRow.size.set(0, 18);

	this.width = this.sizeRow.addValue(Locale.width);
	this.width.setStep(0.1);
	this.width.setOnChange(updateGeometry);

	this.height = this.sizeRow.addValue(Locale.height);
	this.height.setStep(0.1);
	this.height.setOnChange(updateGeometry);

	this.form.add(this.sizeRow);
	this.form.nextRow();
	
	//Segments
	this.form.addText(Locale.segments);
	this.segmentsRow = new NumberRow(this.form);
	this.segmentsRow.size.set(0, 18);

	this.widthSegments = this.segmentsRow.addValue(Locale.width);
	this.widthSegments.setStep(1);
	this.widthSegments.setOnChange(updateGeometry);

	this.heightSegments = this.segmentsRow.addValue(Locale.height);
	this.heightSegments.setStep(1);
	this.heightSegments.setOnChange(updateGeometry);

	this.form.add(this.segmentsRow);
	this.form.nextRow();

	//Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText(Locale.buffered);
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

PlaneGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();
	var GeometryConstructor = this.buffer.getValue() ? THREE.PlaneBufferGeometry : THREE.PlaneGeometry;
	Editor.addAction(new ChangeAction(this.object, "geometry", new GeometryConstructor(this.width.getValue(), this.height.getValue(), this.widthSegments.getValue(), this.heightSegments.getValue())));
};

PlaneGeometryForm.prototype.updateValues = function()
{
	this.width.setValue(this.object.geometry.parameters.width || 1);
	this.height.setValue(this.object.geometry.parameters.height || 1);
	this.widthSegments.setValue(this.object.geometry.parameters.widthSegments || 1);
	this.heightSegments.setValue(this.object.geometry.parameters.heightSegments || 1);
	this.buffer.setValue(this.object.geometry instanceof THREE.BufferGeometry);
};