import {Locale} from "../../../../locale/LocaleManager.js";
import {Texture} from "../../../../../core/texture/Texture.js";
import {Model} from "../../../../../core/resources/Model.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {MaterialEditor} from "../MaterialEditor.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {TextureForm} from "../../../../components/input/TextureForm.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../components/input/DropdownList.js";
import {ColorChooser} from "../../../../components/input/ColorChooser.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {Form} from "../../../../components/Form.js";
import {Points, Color} from "three";

function PointsMaterialEditor(parent, closeable, container, index)
{
	MaterialEditor.call(this, parent, closeable, container, index);

	// Points
	this.points = new Points(MaterialEditor.geometries[0][1], null);
	this.interactive.add(this.points);
	
	// Test model
	this.previewForm.addText(Locale.geometry);
	this.testModel = new DropdownList(this.previewForm);
	this.testModel.size.set(100, 18);
	for(var i = 0; i < MaterialEditor.geometries.length; i++)
	{
		this.testModel.addValue(MaterialEditor.geometries[i][0], i);
	}
	this.testModel.setOnChange(function()
	{
		var value = self.testModel.getSelectedIndex();
		self.points.geometry = MaterialEditor.geometries[value][1];
	});
	this.previewForm.add(this.testModel);
	this.previewForm.nextRow();

	var self = this;

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

	// Size
	this.form.addText(Locale.size);
	this.pointSize = new NumberBox(this.form);
	this.pointSize.size.set(60, 18);
	this.pointSize.setStep(0.05);
	this.pointSize.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "size", self.pointSize.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.pointSize);
	this.form.nextRow();

	// Size atenuation
	this.form.addText("Size atenuation");
	this.sizeAttenuation = new CheckBox(this.form);
	this.sizeAttenuation.size.set(18, 18);
	this.sizeAttenuation.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "sizeAttenuation", self.sizeAttenuation.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.sizeAttenuation);
	this.form.nextRow();

	// Texture map
	this.form.addText(Locale.textureMap);
	this.map = new TextureForm(this.form);
	this.map.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "map", self.map.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();
}

PointsMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

PointsMaterialEditor.prototype.attach = function(material, asset)
{
	MaterialEditor.prototype.attach.call(this, material, asset);

	this.points.material = material;

	this.pointSize.setValue(material.size);
	this.sizeAttenuation.setValue(material.sizeAttenuation);
	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.map.setValue(material.map);
};

export {PointsMaterialEditor};