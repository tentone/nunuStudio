"use strict";

function LineBasicMaterialEditor(parent, closeable, container, index)
{
	MaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	//Color
	this.form.addText("Color");
	this.color = new ColorChooser(this.form.element);
	this.color.size.set(100, 18);
	this.color.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.color.setHex(self.color.getValueHex());
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Line width
	this.form.addText("Width");
	this.linewidth = new NumberBox(this.form.element);
	this.linewidth.size.set(60, 18);
	this.linewidth.setStep(1);
	this.linewidth.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.linewidth = self.linewidth.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.linewidth);
	this.form.nextRow();

	//Lights
	this.form.addText("Lights");
	this.lights = new CheckBox(this.form.element);
	this.lights.size.set(15, 15);
	this.lights.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.lights = self.lights.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.lights);
}

LineBasicMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

LineBasicMaterialEditor.prototype.attach = function(material, asset)
{
	MaterialEditor.prototype.attach.call(this, material, asset);

	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.linewidth.setValue(material.linewidth);
	this.lights.setValue(material.lights);
};
