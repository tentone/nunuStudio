"use strict";

function BoxGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText("Box Geometry");
	this.form.nextRow();
	
	//Size
	this.form.addText(Locale.size);
	this.sizeRow = new NumberRow(this.form);
	this.sizeRow.size.set(0, 18);

	this.width = this.sizeRow.addValue("X");
	this.width.setStep(0.1);
	this.width.setOnChange(updateGeometry);

	this.height = this.sizeRow.addValue("Y");
	this.height.setStep(0.1);
	this.height.setOnChange(updateGeometry);

	this.depth = this.sizeRow.addValue("Z");
	this.depth.setStep(0.1);
	this.depth.setOnChange(updateGeometry);

	this.form.add(this.sizeRow);
	this.form.nextRow();

	//Segments
	this.form.addText("Segments");
	this.segmentsRow = new NumberRow(this.form);
	this.segmentsRow.size.set(0, 18);

	this.widthSegments = this.segmentsRow.addValue("X");
	this.widthSegments.setStep(1);
	this.widthSegments.setOnChange(updateGeometry);

	this.heightSegments = this.segmentsRow.addValue("Y");
	this.heightSegments.setStep(1);
	this.heightSegments.setOnChange(updateGeometry);

	this.depthSegments = this.segmentsRow.addValue("Z");
	this.depthSegments.setStep(1);
	this.depthSegments.setOnChange(updateGeometry);

	this.form.add(this.segmentsRow);
	this.form.nextRow();

	//Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText("Buffered");
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

BoxGeometryForm.prototype.updateGeometry = function()
{
	var GeometryConstructor = this.buffer.getValue() ? THREE.BoxBufferGeometry : THREE.BoxGeometry;
	var geometry = new GeometryConstructor(this.width.getValue(), this.height.getValue(), this.depth.getValue(), this.widthSegments.getValue(), this.heightSegments.getValue(), this.depthSegments.getValue());

	// TODO <NEED MORE TESTING>
	//Editor.addAction(new SwapResourceAction(this.object.geometry, geometry, Editor.program, "geometries"));

	this.object.geometry.dispose();
	Editor.addAction(new ChangeAction(this.object, "geometry", geometry));
};


BoxGeometryForm.prototype.updateValues = function()
{
	this.width.setValue(this.object.geometry.parameters.width || 1);
	this.height.setValue(this.object.geometry.parameters.height || 1);
	this.depth.setValue(this.object.geometry.parameters.depth || 1);
	this.widthSegments.setValue(this.object.geometry.parameters.widthSegments || 1);
	this.heightSegments.setValue(this.object.geometry.parameters.heightSegments || 1);
	this.depthSegments.setValue(this.object.geometry.parameters.depthSegments || 1);
	this.buffer.setValue(this.object.geometry instanceof THREE.BufferGeometry);
};