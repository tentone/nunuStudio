import {MultiplyOperation, MixOperation, AddOperation} from "three";
import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {TextureForm} from "../../../../components/input/TextureForm.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../components/input/DropdownList.js";
import {CubeTextureBox} from "../../../../components/input/CubeTextureBox.js";
import {ColorChooser} from "../../../../components/input/ColorChooser.js";
import {MeshMaterialEditor} from "./MeshMaterialEditor.js";


function MeshLambertMaterialEditor(parent, closeable, container, index)
{
	MeshMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	// Texture map
	this.form.addText(Locale.textureMap);
	this.map = new TextureForm(this.form);
	this.map.size.set(0, 100);
	this.map.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "map", self.map.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();

	// Specular map
	this.form.addText(Locale.specularMap);
	this.specularMap = new TextureForm(this.form);
	this.specularMap.size.set(0, 100);
	this.specularMap.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "specularMap", self.specularMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.specularMap);
	this.form.nextRow();

	// Alpha map
	this.form.addText(Locale.alphaMap);
	this.alphaMap = new TextureForm(this.form);
	this.alphaMap.size.set(0, 100);
	this.alphaMap.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "alphaMap", self.alphaMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.alphaMap);
	this.form.nextRow();

	// Emissive map
	this.form.addText(Locale.emissiveMap);
	this.emissiveMap = new TextureForm(this.form);
	this.emissiveMap.size.set(0, 100);
	this.emissiveMap.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "emissiveMap", self.emissiveMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.emissiveMap);
	this.form.nextRow();

	// Emissive color
	this.form.addText(Locale.color);
	this.emissive = new ColorChooser(this.form);
	this.emissive.size.set(100, 18);
	this.emissive.setOnChange(function()
	{
		self.material.emissive.setHex(self.emissive.getValueHex());
		self.material.needsUpdate = true;
	});
	this.form.add(this.emissive);
	this.form.nextRow();

	// Emissive intensity
	this.form.addText(Locale.intensity);
	this.emissiveIntensity = new NumberBox(this.form);
	this.emissiveIntensity.size.set(60, 18);
	this.emissiveIntensity.setStep(0.1);
	this.emissiveIntensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "emissiveIntensity", self.emissiveIntensity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.emissiveIntensity);
	this.form.nextRow();

	// Ligh map
	this.form.addText(Locale.lightMap);
	this.lightMap = new TextureForm(this.form);
	this.lightMap.size.set(0, 100);
	this.lightMap.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "lightMap", self.lightMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.lightMap);
	this.form.nextRow();

	// Ligh map intensity
	this.form.addText(Locale.intensity);
	this.lightMapIntensity = new NumberBox(this.form);
	this.lightMapIntensity.size.set(60, 18);
	this.lightMapIntensity.setStep(0.1);
	this.lightMapIntensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "lightMapIntensity", self.lightMapIntensity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.lightMapIntensity);
	this.form.nextRow();

	// Environment map
	this.form.addText(Locale.environmentMap);
	this.envMap = new CubeTextureBox(this.form);
	this.envMap.size.set(0, 100);
	this.envMap.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "envMap", self.envMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.envMap);
	this.form.nextRow();

	// Combine environment map
	this.form.addText(Locale.mode);
	this.combine = new DropdownList(this.form);
	this.combine.position.set(100, 85);
	this.combine.size.set(0, 18);
	this.combine.addValue(Locale.multiply, MultiplyOperation);
	this.combine.addValue(Locale.mix, MixOperation);
	this.combine.addValue(Locale.add, AddOperation);
	this.combine.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "combine", self.combine.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.combine);
	this.form.nextRow();

	// Reflectivity
	this.form.addText(Locale.reflectivity);
	this.reflectivity = new NumberBox(this.form);
	this.reflectivity.size.set(0, 18);
	this.reflectivity.setStep(0.05);
	this.reflectivity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "reflectivity", self.reflectivity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.reflectivity);
	this.form.nextRow();

	// Refraction
	this.form.addText(Locale.refractionRatio);
	this.refractionRatio = new NumberBox(this.form);
	this.refractionRatio.size.set(0, 18);
	this.refractionRatio.setStep(0.05);
	this.refractionRatio.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "refractionRatio", self.refractionRatio.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.refractionRatio);

	// Ambient Occlusion map
	this.form.addText(Locale.ambientOcclusion);
	this.aoMap = new TextureForm(this.form);
	this.aoMap.size.set(0, 100);
	this.aoMap.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "aoMap", self.aoMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.aoMap);
	this.form.nextRow();

	// Ambient Occlusion
	this.form.addText(Locale.intensity);
	this.aoMapIntensity = new NumberBox(this.form);
	this.aoMapIntensity.size.set(60, 18);
	this.aoMapIntensity.setStep(0.05);
	this.aoMapIntensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "aoMapIntensity", self.aoMapIntensity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.aoMapIntensity);
	this.form.nextRow();
}

MeshLambertMaterialEditor.prototype = Object.create(MeshMaterialEditor.prototype);

MeshLambertMaterialEditor.prototype.attach = function(material, asset)
{
	MeshMaterialEditor.prototype.attach.call(this, material, asset);

	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.map.setValue(material.map);
	this.specularMap.setValue(material.specularMap);
	this.alphaMap.setValue(material.alphaMap);
	this.emissive.setValue(material.emissive.r, material.emissive.g, material.emissive.b);
	this.emissiveIntensity.setValue(material.emissiveIntensity);
	this.emissiveMap.setValue(material.emissiveMap);
	this.lightMap.setValue(material.lightMap);
	this.lightMapIntensity.setValue(material.lightMapIntensity);
	this.envMap.setValue(material.envMap);
	this.combine.setValue(material.combine);
	this.reflectivity.setValue(material.reflectivity || 0);
	this.refractionRatio.setValue(material.refractionRatio || 0);
	this.aoMap.setValue(material.aoMap);
	this.aoMapIntensity.setValue(material.aoMapIntensity);
};
export {MeshLambertMaterialEditor};
