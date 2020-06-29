import {Locale} from "../../../../locale/LocaleManager.js";
import {Texture} from "../../../../../core/texture/Texture.js";
import {Sky} from "../../../../../core/objects/misc/Sky.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {MaterialEditor} from "../MaterialEditor.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {TextureForm} from "../../../../components/input/TextureForm.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {ColorChooser} from "../../../../components/input/ColorChooser.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {Form} from "../../../../components/Form.js";
import {Sprite, Color} from "three";

function SpriteMaterialEditor(parent, closeable, container, index)
{
	MaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	// Preview scene
	this.sky = new Sky();
	this.sky.visible = false;
	this.scene.add(this.sky);

	this.camera.position.set(0, 0, 1.5);
	
	this.sprite = new Sprite(null);
	this.interactive.add(this.sprite);

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

	// Rotation
	this.form.addText(Locale.rotation);
	this.rotation = new NumberBox(this.form);
	this.rotation.size.set(60, 18);
	this.rotation.setStep(0.01);
	this.rotation.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "rotation", self.rotation.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	// Texture map
	this.form.addText(Locale.textureMap);
	this.map = new TextureForm(this.form);
	this.map.size.set(100, 100);
	this.map.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "map", self.map.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();
}

SpriteMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

SpriteMaterialEditor.prototype.attach = function(material, asset)
{
	MaterialEditor.prototype.attach.call(this, material, asset);

	this.sprite.material = material;

	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.rotation.setValue(material.rotation);
	this.map.setValue(material.map);
};

export {SpriteMaterialEditor};