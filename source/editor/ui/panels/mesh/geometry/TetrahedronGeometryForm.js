"use strict";

function TetrahedronGeometryForm(form, obj)
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

	this.form.addText("Tetrahedron Geometry");
	this.form.nextRow();

	//Radius
	this.form.addText("Radius");
	this.radius = new NumberBox(this.form.element);
	this.radius.size.set(40, 18);
	this.radius.setStep(0.1);
	this.radius.setRange(0, Number.MAX_SAFE_INTEGER);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();

	//Detail
	this.form.addText("Detail");
	this.detail = new Slider(this.form.element);
	this.detail.size.set(90, 18);
	this.detail.setRange(1, 7);
	this.detail.setStep(1);
	this.detail.setOnChange(updateGeometry);
	this.form.add(this.detail);
	this.form.nextRow();

	//Buffer
	this.buffer = new CheckBox(this.form.element);
	this.form.addText("Buffered");
	this.buffer.size.set(20, 15);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();

	this.updateValues();
}

TetrahedronGeometryForm.prototype.updateGeometry = function()
{
	this.obj.geometry.dispose();

	if(this.buffer.getValue())
	{
		this.obj.geometry = new TetrahedronBufferGeometry(this.radius.getValue(), this.detail.getValue());
	}
	else
	{
		this.obj.geometry = new TetrahedronGeometry(this.radius.getValue(), this.detail.getValue());
	}
};

TetrahedronGeometryForm.prototype.updateValues = function()
{
	this.radius.setValue(this.obj.geometry.parameters.radius || 2);
	this.detail.setValue(this.obj.geometry.parameters.detail || 1);
	this.buffer.setValue(this.obj.geometry instanceof THREE.BufferGeometry);
};