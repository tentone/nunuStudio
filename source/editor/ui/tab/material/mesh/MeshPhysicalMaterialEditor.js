"use strict";

function MeshPhysicalMaterialEditor(parent, closeable, container, index)
{
	MeshStandardMaterialEditor.call(this, parent, closeable, container, index);

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
			Editor.history.add(new ChangeAction(self.material, "clearCoat", self.clearCoat.getValue()));
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
			Editor.history.add(new ChangeAction(self.material, "clearCoatRoughness", self.clearCoatRoughness.getValue()));
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
			Editor.history.add(new ChangeAction(self.material, "reflectivity", self.reflectivity.getValue()));
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.reflectivity);
	this.form.nextRow();
}

MeshPhysicalMaterialEditor.prototype = Object.create(MeshStandardMaterialEditor.prototype);

MeshPhysicalMaterialEditor.prototype.attach = function(material, asset)
{
	MeshStandardMaterialEditor.prototype.attach.call(this, material, asset);

	this.clearCoat.setValue(material.clearCoat);
	this.clearCoatRoughness.setValue(material.clearCoatRoughness);
	this.reflectivity.setValue(material.reflectivity);
};
