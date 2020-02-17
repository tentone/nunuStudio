"use strict";

function CapsuleGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText("Capsule Geometry");
	this.form.nextRow();

	//Radius
	this.form.addText(Locale.radius);
	this.radiusRow = new NumberRow(this.form);
	this.radiusRow.size.set(0, 18);

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

	this.capsTopSegments = this.segmentsRow.addValue(Locale.top);
	this.capsTopSegments.setRange(1, Number.MAX_SAFE_INTEGER);
	this.capsTopSegments.setStep(1);
	this.capsTopSegments.setOnChange(updateGeometry);

	this.capsBottomSegments = this.segmentsRow.addValue(Locale.bottom);
	this.capsBottomSegments.setRange(1, Number.MAX_SAFE_INTEGER);
	this.capsBottomSegments.setStep(1);
	this.capsBottomSegments.setOnChange(updateGeometry);

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

	this.form.add(this.segmentsRow);
	this.form.nextRow();
}

CapsuleGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();

	var geometry = new THREE.CapsuleBufferGeometry(this.radiusTop.getValue(), this.radiusBottom.getValue(), this.height.getValue(),
									this.radialSegments.getValue(), this.heightSegments.getValue(), this.capsTopSegments.getValue(),
									this.capsBottomSegments.getValue(), this.thetaStart.getValue(), this.thetaLength.getValue());

	Editor.addAction(new ChangeAction(this.object, "geometry", geometry));
};

CapsuleGeometryForm.prototype.updateValues = function()
{
	this.radiusTop.setValue(this.object.geometry.parameters.radiusTop || 0.5);
	this.radiusBottom.setValue(this.object.geometry.parameters.radiusBottom || 0.5);
	this.height.setValue(this.object.geometry.parameters.height || 1.0);
	this.radialSegments.setValue(this.object.geometry.parameters.radialSegments || 32);
	this.heightSegments.setValue(this.object.geometry.parameters.heightSegments || 1);
	this.radialSegments.setValue(this.object.geometry.parameters.radialSegments || 32);
	this.heightSegments.setValue(this.object.geometry.parameters.heightSegments || 1);
	this.capsTopSegments.setValue(this.object.geometry.parameters.capsTopSegments || 8);
	this.capsBottomSegments.setValue(this.object.geometry.parameters.capsBottomSegments || 8);
	this.thetaStart.setValue(this.object.geometry.parameters.thetaStart || 0);
	this.thetaLength.setValue(this.object.geometry.parameters.thetaLength || Math.PI * 2);
};