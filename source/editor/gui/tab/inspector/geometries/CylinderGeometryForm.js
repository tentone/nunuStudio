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

	this.form.addText(Locale.cylinder);
	this.form.nextRow();

	//Radius
	this.form.addText(Locale.radius);
	this.radiusRow = new NumberRow(this.form);
	this.radiusRow.size.set(0, 18);
	this.form.nextRow();
	
	this.radiusTop = this.radiusRow.addValue(Locale.top);
	this.radiusTop.setStep(0.1);
	this.radiusTop.setOnChange(updateGeometry);

	this.radiusBottom = this.radiusRow.addValue(Locale.bottom);
	this.radiusBottom.setStep(0.1);
	this.radiusBottom.setOnChange(updateGeometry);

	this.form.add(this.radiusRow);
	this.form.nextRow();

	//Height
	this.form.addText(Locale.height);
	this.height = new NumberBox(this.form);
	this.height.size.set(40, 18);
	this.height.setStep(0.1);
	this.height.setOnChange(updateGeometry);
	this.form.add(this.height);
	this.form.nextRow();

	//Segments
	this.form.addText(Locale.segments);
	this.segmentsRow = new NumberRow(this.form);
	this.segmentsRow.size.set(0, 18);

	this.radialSegments = this.segmentsRow.addValue(Locale.radial);
	this.radialSegments.setRange(3, Number.MAX_SAFE_INTEGER);
	this.radialSegments.setStep(1);
	this.radialSegments.setOnChange(updateGeometry);

	this.heightSegments = this.segmentsRow.addValue(Locale.height);
	this.heightSegments.setRange(1, Number.MAX_SAFE_INTEGER);
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