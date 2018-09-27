"use strict";

function TetrahedronGeometryForm(form, obj)
{
	this.form = form;
	this.obj = obj;
	
	var self = this;

	//Update geometry function
	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText("Tetrahedron Geometry");
	this.form.nextRow();

	//Radius
	this.form.addText("Radius");
	this.radius = new NumberBox(this.form);
	this.radius.size.set(40, 18);
	this.radius.setStep(0.1);
	this.radius.setRange(0, Number.MAX_SAFE_INTEGER);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();

	//Detail
	this.form.addText("Detail");
	this.detail = new Slider(this.form);
	this.detail.size.set(90, 18);
	this.detail.setRange(0, 8);
	this.detail.setStep(1);
	this.detail.setOnChange(updateGeometry);
	this.form.add(this.detail);
	this.form.nextRow();

	//Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText("Buffered");
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

TetrahedronGeometryForm.prototype.updateGeometry = function()
{
	this.obj.geometry.dispose();

	var GeometryConstructor = this.buffer.getValue() ? THREE.TetrahedronBufferGeometry : THREE.TetrahedronGeometry;

	Editor.history.add(new ChangeAction(this.obj, "geometry", new GeometryConstructor(this.radius.getValue(), this.detail.getValue())));
};

TetrahedronGeometryForm.prototype.updateValues = function()
{
	this.radius.setValue(this.obj.geometry.parameters.radius || 2);
	this.detail.setValue(this.obj.geometry.parameters.detail || 0);
	this.buffer.setValue(this.obj.geometry instanceof THREE.BufferGeometry);
};