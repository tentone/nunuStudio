"use strict";

function PhysicalMaterialEditor(parent, closeable, container, index)
{
	StandardMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	//Clear coat
	this.form.addText("Clear coat");
	this.clearCoat = new Slider(this.form.element);
	this.clearCoat.size.set(160, 18);
	this.clearCoat.setRange(0, 1);
	this.clearCoat.setStep(0.01);
	this.clearCoat.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.clearCoat = self.clearCoat.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.clearCoat);
	this.form.nextRow();

	//Clear coat roughness
	this.form.addText("Coat roughness");
	this.clearCoatRoughness = new Slider(this.form.element);
	this.clearCoatRoughness.size.set(160, 18);
	this.clearCoatRoughness.setRange(0, 1);
	this.clearCoatRoughness.setStep(0.01);
	this.clearCoatRoughness.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.clearCoatRoughness = self.clearCoatRoughness.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.clearCoatRoughness);
	this.form.nextRow();

	//Reflectivity
	this.form.addText("Reflectivity");
	this.reflectivity = new Slider(this.form.element);
	this.reflectivity.size.set(160, 18);
	this.reflectivity.setRange(0, 1);
	this.reflectivity.setStep(0.01);
	this.reflectivity.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.reflectivity = self.reflectivity.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.reflectivity);
	this.form.nextRow();
}

PhysicalMaterialEditor.prototype = Object.create(StandardMaterialEditor.prototype);

PhysicalMaterialEditor.prototype.attach = function(material, materialFile)
{
	StandardMaterialEditor.prototype.attach.call(this, material, materialFile);

	this.clearCoat.setValue(material.clearCoat);
	this.clearCoatRoughness.setValue(material.clearCoatRoughness);
	this.reflectivity.setValue(material.reflectivity);
};
