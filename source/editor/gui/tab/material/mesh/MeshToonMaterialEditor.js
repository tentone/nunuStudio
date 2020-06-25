import {Texture} from "../../../../../core/texture/Texture.js";
import {Mesh} from "../../../../../core/objects/mesh/Mesh.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {MeshMaterialEditor} from "./MeshMaterialEditor.js";
import {MaterialEditor} from "../MaterialEditor.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {VectorBox} from "../../../../components/input/VectorBox.js";
import {TextureForm} from "../../../../components/input/TextureForm.js";
import {Slider} from "../../../../components/input/Slider.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../components/input/DropdownList.js";
import {ColorChooser} from "../../../../components/input/ColorChooser.js";
import {Form} from "../../../../components/Form.js";
import {TangentSpaceNormalMap, ObjectSpaceNormalMap} from "three";

function MeshToonMaterialEditor(parent, closeable, container, index)
{
	MeshMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	// Specular color
	this.form.addText(Locale.specular);
	this.specular = new ColorChooser(this.form);
	this.specular.size.set(100, 18);
	this.specular.setOnChange(function()
	{
		self.material.specular.setHex(self.specular.getValueHex());
		self.material.needsUpdate = true;
	});
	this.form.add(this.specular);
	this.form.nextRow();

	// Shininess
	this.form.addText(Locale.shininess);
	this.shininess = new Slider(this.form);
	this.shininess.size.set(160, 18);
	this.shininess.setRange(0, 250);
	this.shininess.setStep(0.1);
	this.shininess.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "shininess", self.shininess.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.shininess);
	this.form.nextRow();

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

	// Gradient map
	this.form.addText(Locale.gradientMap);
	this.gradientMap = new TextureForm(this.form);
	this.gradientMap.size.set(0, 100);
	this.gradientMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "gradientMap", self.gradientMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.gradientMap);
	this.form.nextRow();

	// Bump map
	this.form.addText(Locale.bumpMap);
	this.bumpMap = new TextureForm(this.form);
	this.bumpMap.size.set(0, 100);
	this.bumpMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "bumpMap", self.bumpMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.bumpMap);
	this.form.nextRow();

	// Bump scale
	this.form.addText(Locale.scale);
	this.bumpScale = new Slider(this.form);
	this.bumpScale.size.set(160, 18);
	this.bumpScale.setRange(0, 1);
	this.bumpScale.setStep(0.01);
	this.bumpScale.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "bumpScale", self.bumpScale.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.bumpScale);
	this.form.nextRow();

	// Normal map
	this.form.addText(Locale.normalMap);
	this.normalMap = new TextureForm(this.form);
	this.normalMap.size.set(0, 100);
	this.normalMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "normalMap", self.normalMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.normalMap);
	this.form.nextRow();

	// Normal map scale
	this.form.addText(Locale.normalScale);
	this.normalScale = new VectorBox(this.form);
	this.normalScale.size.set(0, 18);
	this.normalScale.setType(VectorBox.VECTOR2);
	this.normalScale.setValue(1, 1, 0);
	this.normalScale.setOnChange(function()
	{
		self.material.normalScale.copy(self.normalScale.getValue());
		self.material.needsUpdate = true;
	});
	this.form.add(this.normalScale);
	this.form.nextRow();

	// Normal type
	this.form.addText(Locale.normalType);
	this.normalMapType = new DropdownList(this.form);
	this.normalMapType.size.set(100, 18);
	this.normalMapType.addValue(Locale.tangentSpace, TangentSpaceNormalMap);
	this.normalMapType.addValue(Locale.objectSpace, ObjectSpaceNormalMap);
	this.normalMapType.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "normalMapType", self.normalMapType.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.normalMapType);
	this.form.nextRow();

	// Displacement map
	this.form.addText(Locale.displacementMap);
	this.displacementMap = new TextureForm(this.form);
	this.displacementMap.size.set(0, 100);
	this.displacementMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "displacementMap", self.displacementMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.displacementMap);
	this.form.nextRow();

	// Displacement map scale
	this.form.addText(Locale.scale);
	this.displacementScale = new NumberBox(this.form);
	this.displacementScale.size.set(60, 18);
	this.displacementScale.setStep(0.05);
	this.displacementScale.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "displacementScale", self.displacementScale.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.displacementScale);
	this.form.nextRow();

	// Displacement map bias
	this.form.addText(Locale.bias);
	this.displacementBias = new NumberBox(this.form);
	this.displacementBias.size.set(60, 18);
	this.displacementBias.setStep(0.1);
	this.displacementBias.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "displacementBias", self.displacementBias.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.displacementBias);
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

	// Emissive map
	this.form.addText(Locale.emissiveMap);
	this.emissiveMap = new TextureForm(this.form);
	this.emissiveMap.size.set(0, 100);
	this.emissiveMap.setOnChange(function(file)
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

MeshToonMaterialEditor.prototype = Object.create(MeshMaterialEditor.prototype);

MeshToonMaterialEditor.prototype.attach = function(material, asset)
{
	MeshMaterialEditor.prototype.attach.call(this, material, asset);

	this.specular.setValue(material.specular.r, material.specular.g, material.specular.b);
	this.shininess.setValue(material.shininess);
	this.map.setValue(material.map);
	this.gradientMap.setValue(material.gradientMap);
	this.bumpMap.setValue(material.bumpMap);
	this.bumpScale.setValue(material.bumpScale);
	this.normalMap.setValue(material.normalMap);
	this.normalScale.setValue(material.normalScale.x, material.normalScale.y);
	this.normalMapType.setValue(material.normalMapType);
	this.displacementMap.setValue(material.displacementMap);
	this.displacementScale.setValue(material.displacementScale);
	this.displacementBias.setValue(material.displacementBias);
	this.specularMap.setValue(material.specularMap);
	this.emissive.setValue(material.emissive.r, material.emissive.g, material.emissive.b);
	this.emissiveIntensity.setValue(material.emissiveIntensity);
	this.emissiveMap.setValue(material.emissiveMap);
	this.lightMap.setValue(material.lightMap);
	this.lightMapIntensity.setValue(material.lightMapIntensity);
	this.alphaMap.setValue(material.alphaMap);
	this.aoMap.setValue(material.aoMap);
	this.aoMapIntensity.setValue(material.aoMapIntensity);
};

export {MeshToonMaterialEditor};