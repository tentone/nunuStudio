import {Color, PointLight, AmbientLight, Mesh} from "three";
import {Locale} from "../../../../locale/LocaleManager.js";
import {Sky} from "../../../../../core/objects/misc/Sky.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {MaterialEditor} from "../MaterialEditor.js";
import {Editor} from "../../../../Editor.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../components/input/DropdownList.js";
import {ColorChooser} from "../../../../components/input/ColorChooser.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";

function MeshMaterialEditor(parent, closeable, container, index)
{
	MaterialEditor.call(this, parent, closeable, container, index);
	
	var self = this;


	// Skinning
	this.form.addText(Locale.skinning);
	this.skinning = new CheckBox(this.form);
	this.skinning.size.set(18, 18);
	this.skinning.updateInterface();
	this.skinning.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "skinning", self.skinning.getValue()));
	});
	this.form.add(this.skinning);
	this.form.nextRow();

	// Morph targets
	this.form.addText(Locale.morphTargets);
	this.morphTargets = new CheckBox(this.form);
	this.morphTargets.size.set(18, 18);
	this.morphTargets.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "morphTargets", self.morphTargets.getValue()));
	});
	this.form.add(this.morphTargets);
	this.form.nextRow();

	// Wireframe
	this.form.addText(Locale.wireframe);
	this.wireframe = new CheckBox(this.form);
	this.wireframe.size.set(18, 18);
	this.wireframe.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "wireframe", self.wireframe.getValue()));
	});
	this.form.add(this.wireframe);
	this.form.nextRow();

	// Wireframe line cap
	this.form.addText(Locale.wireframeLinecap);
	this.wireframeLinecap = new DropdownList(this.form);
	this.wireframeLinecap.size.set(100, 18);
	this.wireframeLinecap.addValue("Butt", "butt");
	this.wireframeLinecap.addValue("Round", "round");
	this.wireframeLinecap.addValue("Square", "square");
	this.wireframeLinecap.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "wireframeLinecap", self.wireframeLinecap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.wireframeLinecap);
	this.form.nextRow();

	// Wireframe line cap
	this.form.addText(Locale.wireframeLinejoin);
	this.wireframeLinejoin = new DropdownList(this.form);
	this.wireframeLinejoin.size.set(100, 18);
	this.wireframeLinejoin.addValue("Bevel", "bevel");
	this.wireframeLinejoin.addValue("Round", "round");
	this.wireframeLinejoin.addValue("Miter", "miter");
	this.wireframeLinejoin.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "wireframeLinejoin", self.wireframeLinejoin.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.wireframeLinejoin);
	this.form.nextRow();

	// Wireframe line width
	this.form.addText(Locale.scale);
	this.wireframeLinewidth = new NumberBox(this.form);
	this.wireframeLinewidth.size.set(60, 18);
	this.wireframeLinewidth.setStep(0.1);
	this.wireframeLinewidth.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "wireframeLinewidth", self.wireframeLinewidth.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.wireframeLinewidth);
	this.form.nextRow();

	// Shading mode
	this.form.addText(Locale.shading);
	this.flatShading = new DropdownList(this.form);
	this.flatShading.position.set(100, 85);
	this.flatShading.size.set(100, 18);
	this.flatShading.addValue(Locale.smooth, false);
	this.flatShading.addValue(Locale.flat, true);
	this.flatShading.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "flatShading", self.flatShading.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.flatShading);
	this.form.nextRow();

	// Color
	this.form.addText(Locale.color);
	this.color = new ColorChooser(this.form);
	this.color.size.set(100, 18);
	this.color.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "color", new Color(self.color.getValueHex())));
		self.material.needsUpdate = true;
	});
	this.form.add(this.color);
	this.form.nextRow();


	// Preview scene
	this.sky = new Sky();
	this.scene.add(this.sky);

	this.pointLight = new PointLight(0x666666);
	this.pointLight.position.set(-1, 0, 3);
	this.scene.add(this.pointLight);
	
	this.ambientLight = new AmbientLight(0x555555);
	this.ambientLight.visible = false;
	this.scene.add(this.ambientLight);

	// Mesh
	this.mesh = new Mesh(MaterialEditor.geometries[0][1], null);
	this.interactive.add(this.mesh);
	
	// Test model
	this.previewForm.addText(Locale.geometry);
	this.testModel = new DropdownList(this.previewForm);
	this.testModel.size.set(100, 18);
	for (var i = 0; i < MaterialEditor.geometries.length; i++)
	{
		this.testModel.addValue(MaterialEditor.geometries[i][0], i);
	}
	this.testModel.setOnChange(function()
	{
		var value = self.testModel.getSelectedIndex();
		self.mesh.geometry = MaterialEditor.geometries[value][1];
	});
	this.previewForm.add(this.testModel);
	this.previewForm.nextRow();

	// Sky
	this.previewForm.addText(Locale.sky);
	this.skyEnabled = new CheckBox(this.previewForm);
	this.skyEnabled.size.set(18, 18);
	this.skyEnabled.setValue(this.sky.visible);
	this.skyEnabled.setOnChange(function()
	{
		self.sky.visible = self.skyEnabled.getValue();
	});
	this.previewForm.add(this.skyEnabled);
	this.previewForm.nextRow();

	// Point Light
	this.previewForm.addText(Locale.pointLight);
	this.previewForm.nextRow();

	this.previewForm.addText(Locale.enabled);
	this.lightEnabled = new CheckBox(this.previewForm);
	this.lightEnabled.size.set(18, 18);
	this.lightEnabled.setValue(this.pointLight.visible);
	this.lightEnabled.setOnChange(function()
	{
		self.pointLight.visible = self.lightEnabled.getValue();
	});
	this.previewForm.add(this.lightEnabled);
	this.previewForm.nextRow();

	this.previewForm.addText(Locale.color);
	this.pointLightColor = new ColorChooser(this.previewForm);
	this.pointLightColor.size.set(80, 18);
	this.pointLightColor.setOnChange(function()
	{
		self.pointLight.color.setHex(self.pointLightColor.getValueHex());
	});
	this.previewForm.add(this.pointLightColor);
	this.previewForm.nextRow();

	// Ambient Light
	this.previewForm.addText(Locale.ambientLight);
	this.previewForm.nextRow();

	this.previewForm.addText(Locale.enabled);
	this.ambientLightEnabled = new CheckBox(this.previewForm);
	this.ambientLightEnabled.size.set(18, 18);
	this.ambientLightEnabled.setValue(this.ambientLight.visible);
	this.ambientLightEnabled.setOnChange(function()
	{
		self.ambientLight.visible = self.ambientLightEnabled.getValue();
	});
	this.previewForm.add(this.ambientLightEnabled);
	this.previewForm.nextRow();

	this.previewForm.addText(Locale.color);
	this.ambientLightColor = new ColorChooser(this.previewForm);
	this.ambientLightColor.size.set(80, 18);
	this.ambientLightColor.setOnChange(function()
	{
		self.ambientLight.color.setHex(self.ambientLightColor.getValueHex());
	});
	this.previewForm.add(this.ambientLightColor);
	this.previewForm.nextRow();
}

MeshMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

MeshMaterialEditor.prototype.attach = function(material, asset)
{
	MaterialEditor.prototype.attach.call(this, material, asset);

	this.sky.visible = material.envMap === null;
	this.mesh.material = material;
	
	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.skinning.setValue(material.skinning);
	this.morphTargets.setValue(material.morphTargets);
	this.wireframe.setValue(material.wireframe);
	this.wireframeLinecap.setValue(material.wireframeLinecap);
	this.wireframeLinejoin.setValue(material.wireframeLinejoin);
	this.wireframeLinewidth.setValue(material.wireframeLinewidth);
	this.flatShading.setValue(material.flatShading);
};

export {MeshMaterialEditor};
