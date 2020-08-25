import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {VectorBox} from "../../../../components/input/VectorBox.js";
import {TextureForm} from "../../../../components/input/TextureForm.js";
import {Slider} from "../../../../components/input/Slider.js";
import {MeshStandardMaterialEditor} from "./MeshStandardMaterialEditor.js";


function MeshPhysicalMaterialEditor(parent, closeable, container, index)
{
	MeshStandardMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	// Clear coat
	this.form.addText(Locale.clearcoat);
	this.clearcoat = new Slider(this.form);
	this.clearcoat.size.set(160, 18);
	this.clearcoat.setRange(0, 1);
	this.clearcoat.setStep(0.01);
	this.clearcoat.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "clearcoat", self.clearcoat.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.clearcoat);
	this.form.nextRow();

	// Clear coat map
	this.form.addText(Locale.clearcoatMap);
	this.clearcoatMap = new TextureForm(this.form);
	this.clearcoatMap.size.set(0, 100);
	this.clearcoatMap.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "clearcoatMap", self.clearcoatMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.clearcoatMap);
	this.form.nextRow();

	// Clear coat roughness
	this.form.addText(Locale.clearcoatRoughness);
	this.clearcoatRoughness = new Slider(this.form);
	this.clearcoatRoughness.size.set(160, 18);
	this.clearcoatRoughness.setRange(0, 1);
	this.clearcoatRoughness.setStep(0.01);
	this.clearcoatRoughness.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "clearcoatRoughness", self.clearcoatRoughness.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.clearcoatRoughness);
	this.form.nextRow();

	// Clear coat roughness map
	this.form.addText(Locale.clearcoatRoughnessMap);
	this.clearcoatRoughnessMap = new TextureForm(this.form);
	this.clearcoatRoughnessMap.size.set(0, 100);
	this.clearcoatRoughnessMap.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "clearcoatRoughnessMap", self.clearcoatRoughnessMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.clearcoatRoughnessMap);
	this.form.nextRow();

	// Reflectivity
	this.form.addText(Locale.reflectivity);
	this.reflectivity = new Slider(this.form);
	this.reflectivity.size.set(160, 18);
	this.reflectivity.setRange(0, 1);
	this.reflectivity.setStep(0.01);
	this.reflectivity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "reflectivity", self.reflectivity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.reflectivity);
	this.form.nextRow();

	// Transparency
	this.form.addText(Locale.transparency);
	this.transparency = new Slider(this.form);
	this.transparency.size.set(160, 18);
	this.transparency.setRange(0, 1);
	this.transparency.setStep(0.01);
	this.transparency.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "transparency", self.transparency.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.transparency);
	this.form.nextRow();

	// Clear coat normal map
	this.form.addText(Locale.clearcoatNormalMap);
	this.clearcoatNormalMap = new TextureForm(this.form);
	this.clearcoatNormalMap.size.set(0, 100);
	this.clearcoatNormalMap.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "clearcoatNormalMap", self.clearcoatNormalMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.clearcoatNormalMap);
	this.form.nextRow();

	// Clear coat normal map scale
	this.form.addText(Locale.clearcoatNormalScale);
	this.clearcoatNormalScale = new VectorBox(this.form);
	this.clearcoatNormalScale.size.set(0, 18);
	this.clearcoatNormalScale.setType(VectorBox.VECTOR2);
	this.clearcoatNormalScale.setValue(1, 1, 0);
	this.clearcoatNormalScale.setOnChange(function()
	{
		self.material.clearcoatNormalScale.copy(self.clearcoatNormalScale.getValue());
		self.material.needsUpdate = true;
	});
	this.form.add(this.clearcoatNormalScale);
	this.form.nextRow();
}

MeshPhysicalMaterialEditor.prototype = Object.create(MeshStandardMaterialEditor.prototype);

MeshPhysicalMaterialEditor.prototype.attach = function(material, asset)
{
	MeshStandardMaterialEditor.prototype.attach.call(this, material, asset);

	this.clearcoat.setValue(material.clearcoat);
	this.clearcoatRoughness.setValue(material.clearcoatRoughness);
	this.reflectivity.setValue(material.reflectivity);
	this.transparency.setValue(material.transparency);
	this.clearcoatNormalMap.setValue(material.clearcoatNormalMap);
	this.clearcoatNormalScale.setValue(material.clearcoatNormalScale);
	this.clearcoatMap.setValue(material.clearcoatMap);
	this.clearcoatRoughnessMap.setValue(material.clearcoatRoughnessMap);
};
export {MeshPhysicalMaterialEditor};
