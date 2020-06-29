import {Locale} from "../../../../locale/LocaleManager.js";
import {Texture} from "../../../../../core/texture/Texture.js";
import {CubeTexture} from "../../../../../core/texture/CubeTexture.js";
import {Mesh} from "../../../../../core/objects/mesh/Mesh.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {MeshMaterialEditor} from "./MeshMaterialEditor.js";
import {MaterialEditor} from "../MaterialEditor.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {TextureForm} from "../../../../components/input/TextureForm.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../components/input/DropdownList.js";
import {CubeTextureBox} from "../../../../components/input/CubeTextureBox.js";
import {Form} from "../../../../components/Form.js";
import {MultiplyOperation, MixOperation, AddOperation} from "three";


function MeshBasicMaterialEditor(parent, closeable, container, index)
{
	MeshMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	// Texture map
	this.form.addText(Locale.textureMap);
	this.map = new TextureForm(this.form);
	this.map.size.set(0, 100);
	this.map.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "map", self.map.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();

	// Alpha map
	this.form.addText(Locale.alphaMap);
	this.alphaMap = new TextureForm(this.form);
	this.alphaMap.size.set(0, 100);
	this.alphaMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "alphaMap", self.alphaMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.alphaMap);
	this.form.nextRow();

	// Specular map
	this.form.addText(Locale.specularMap);
	this.specularMap = new TextureForm(this.form);
	this.specularMap.size.set(0, 100);
	this.specularMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "specularMap", self.specularMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.specularMap);
	this.form.nextRow();
	
	// Ambient Occlusion map
	this.form.addText(Locale.ambientOcclusion);
	this.aoMap = new TextureForm(this.form);
	this.aoMap.size.set(0, 100);
	this.aoMap.setOnChange(function(file)
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

	// Ligh map
	this.form.addText(Locale.lightMap);
	this.lightMap = new TextureForm(this.form);
	this.lightMap.size.set(0, 100);
	this.lightMap.setOnChange(function(file)
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
	this.envMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "envMap", self.envMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.envMap);
	this.form.nextRow();

	// Combine environment map
	this.form.addText(Locale.mode);
	this.combine = new DropdownList(this.form);
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
	this.aoMap.setOnChange(function(file)
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

MeshBasicMaterialEditor.prototype = Object.create(MeshMaterialEditor.prototype);

MeshBasicMaterialEditor.prototype.attach = function(material, asset)
{
	MeshMaterialEditor.prototype.attach.call(this, material, asset);

	this.map.setValue(material.map);
	this.alphaMap.setValue(material.alphaMap);
	this.specularMap.setValue(material.specularMap);
	this.aoMap.setValue(material.aoMap);
	this.aoMapIntensity.setValue(material.aoMapIntensity);
	this.lightMap.setValue(material.lightMap);
	this.lightMapIntensity.setValue(material.lightMapIntensity);
	this.envMap.setValue(material.envMap);
	this.combine.setValue(material.combine);
	this.reflectivity.setValue(material.reflectivity || 0);
	this.refractionRatio.setValue(material.refractionRatio || 0);
	this.aoMap.setValue(material.aoMap);
	this.aoMapIntensity.setValue(material.aoMapIntensity);
};
export {MeshBasicMaterialEditor};