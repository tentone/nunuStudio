"use strict";

function CircleGeometryForm(form, obj)
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

	this.form.addText("Circle Geometry");
	this.form.nextRow();
	
	//Radius
	this.form.addText("Radius");
	this.radius = new NumberBox(this.form);
	this.radius.size.set(60, 18);
	this.radius.setStep(0.1);
	this.radius.setRange(0, Number.MAX_SAFE_INTEGER);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();

	//Segments
	this.form.addText("Segments");
	this.segments = new NumberBox(this.form);
	this.segments.size.set(60, 18);
	this.segments.setStep(1.0);
	this.segments.setRange(3, Number.MAX_SAFE_INTEGER);
	this.segments.setOnChange(updateGeometry);
	this.form.add(this.segments);
	this.form.nextRow();

	//Theta start
	this.form.addText("Theta start");
	this.thetaStart = new NumberBox(this.form);
	this.thetaStart.size.set(60, 18);
	this.thetaStart.setStep(0.1);
	this.thetaStart.setOnChange(updateGeometry);
	this.form.add(this.thetaStart);
	this.form.nextRow();

	//Theta length
	this.form.addText("Theta length");
	this.thetaLength = new NumberBox(this.form);
	this.thetaLength.size.set(60, 18);
	this.thetaLength.setStep(0.1);
	this.thetaLength.setOnChange(updateGeometry);
	this.form.add(this.thetaLength);
	this.form.nextRow();

	//Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText("Buffered");
	this.buffer.size.set(15, 15);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

CircleGeometryForm.prototype.updateGeometry = function()
{
	this.obj.geometry.dispose();
	
	var GeometryConstructor = this.buffer.getValue() ? THREE.CircleBufferGeometry : THREE.CircleGeometry;

	Editor.history.add(new ChangeAction(this.obj, "geometry", new GeometryConstructor(this.radius.getValue(), this.segments.getValue(), this.thetaStart.getValue(), this.thetaLength.getValue())));
};

CircleGeometryForm.prototype.updateValues = function()
{
	this.radius.setValue(this.obj.geometry.parameters.radius || 1);
	this.segments.setValue(this.obj.geometry.parameters.segments || 32);
	this.thetaStart.setValue(this.obj.geometry.parameters.thetaStart || 0);
	this.thetaLength.setValue(this.obj.geometry.parameters.thetaLength || Math.PI * 2);
	this.buffer.setValue(this.obj.geometry instanceof THREE.BufferGeometry);
};