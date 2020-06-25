import {Texture} from "../../../../../core/texture/Texture.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {Inspector} from "../Inspector.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {VectorBox} from "../../../../components/input/VectorBox.js";
import {TextBox} from "../../../../components/input/TextBox.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../components/input/DropdownList.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {ClampToEdgeWrapping, RepeatWrapping, MirroredRepeatWrapping, NearestFilter, LinearFilter, NearestMipMapNearestFilter, NearestMipMapLinearFilter, LinearMipMapNearestFilter, LinearMipMapLinearFilter} from "three";

function TextureInspector(parent, object)
{
	Inspector.call(this, parent, object);

	var self = this;

	// Name
	this.form.addText(Locale.name);
	this.name = new TextBox(this.form);
	this.name.size.set(190, 18);
	this.name.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "name", self.name.getText()));
		Editor.updateObjectsViewsGUI();
	});
	this.form.add(this.name);
	this.form.nextRow();

	// UUID
	if(Editor.settings.general.showUUID)
	{
		this.form.addText(Locale.uuid);
		this.uuid = this.form.addText("");
		this.form.nextRow();
	}

	// WrapS
	this.form.addText(Locale.wrapHor);
	this.wrapS = new DropdownList(this.form);
	this.wrapS.size.set(120, 18);
	this.wrapS.addValue(Locale.clampEdge, ClampToEdgeWrapping);
	this.wrapS.addValue(Locale.repeat, RepeatWrapping);
	this.wrapS.addValue(Locale.repeatMirror, MirroredRepeatWrapping);
	this.wrapS.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "wrapS", self.wrapS.getValue()));
	});
	this.form.add(this.wrapS);
	this.form.nextRow();

	// WrapT
	this.form.addText(Locale.wrapVert);
	this.wrapT = new DropdownList(this.form);
	this.wrapT.size.set(120, 18);
	this.wrapT.addValue(Locale.clampEdge, ClampToEdgeWrapping);
	this.wrapT.addValue(Locale.repeat, RepeatWrapping);
	this.wrapT.addValue(Locale.repeatMirror, MirroredRepeatWrapping);
	this.wrapT.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "wrapT", self.wrapT.getValue()));
	});
	this.form.add(this.wrapT);
	this.form.nextRow();

	// Repeat
	this.form.addText(Locale.repeat);
	this.repeat = new VectorBox(this.form);
	this.repeat.setType(VectorBox.VECTOR2);
	this.repeat.size.set(120, 18);
	this.repeat.setStep(0.01);
	this.repeat.setOnChange(function()
	{
		var value = self.repeat.getValue();
		self.object.repeat.set(value.x, value.y);
	});
	this.form.add(this.repeat);
	this.form.nextRow();

	// Offset
	this.form.addText(Locale.offset);
	this.offset = new VectorBox(this.form);
	this.offset.setType(VectorBox.VECTOR2);
	this.offset.size.set(120, 18);
	this.offset.setStep(0.01);
	this.offset.setOnChange(function()
	{
		var value = self.offset.getValue();
		self.object.offset.set(value.x, value.y);
	});
	this.form.add(this.offset);
	this.form.nextRow();

	// Center
	this.form.addText(Locale.center);
	this.center = new VectorBox(this.form);
	this.center.setType(VectorBox.VECTOR2);
	this.center.size.set(120, 18);
	this.center.setStep(0.01);
	this.center.setOnChange(function()
	{
		var value = self.center.getValue();
		self.object.center.set(value.x, value.y);
	});
	this.form.add(this.center);
	this.form.nextRow();

	// Rotation
	this.form.addText(Locale.rotation);
	this.rotation = new NumberBox(this.form);
	this.rotation.size.set(60, 18);
	this.rotation.setStep(0.1);
	this.rotation.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "rotation", self.rotation.getValue()));
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	// Minification filter
	this.form.addText(Locale.minFilter);
	this.minFilter = new DropdownList(this.form);
	this.minFilter.size.set(150, 18);
	this.minFilter.addValue(Locale.nearest, NearestFilter);
	this.minFilter.addValue(Locale.linear, LinearFilter);
	this.minFilter.addValue("MIP Nearest Nearest", NearestMipMapNearestFilter);
	this.minFilter.addValue("MIP Nearest Linear", NearestMipMapLinearFilter);
	this.minFilter.addValue("MIP Linear Nearest", LinearMipMapNearestFilter);
	this.minFilter.addValue("MIP Linear Linear", LinearMipMapLinearFilter);
	this.minFilter.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "minFilter", self.minFilter.getValue()));
	});
	this.form.add(this.minFilter);
	this.form.nextRow();

	// Magnification filter
	this.form.addText(Locale.magFilter);
	this.magFilter = new DropdownList(this.form);
	this.magFilter.size.set(150, 18);
	this.magFilter.addValue(Locale.nearest, NearestFilter);
	this.magFilter.addValue(Locale.linear, LinearFilter);
	this.magFilter.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "magFilter", self.magFilter.getValue()));
	});
	this.form.add(this.magFilter);
	this.form.nextRow();

	// Premultiply Alpha
	this.form.addText(Locale.premulAlpha);
	this.premultiplyAlpha = new CheckBox(this.form);
	this.premultiplyAlpha.size.set(18, 18);
	this.premultiplyAlpha.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "premultiplyAlpha", self.premultiplyAlpha.getValue()));
	});
	this.form.add(this.premultiplyAlpha);
	this.form.nextRow();

	// Flip Y
	this.form.addText(Locale.flipY);
	this.flipY = new CheckBox(this.form);
	this.flipY.size.set(18, 18);
	this.flipY.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "flipY", self.flipY.getValue()));
	});
	this.form.add(this.flipY);
	this.form.nextRow();
}

TextureInspector.prototype = Object.create(Inspector.prototype);

TextureInspector.prototype.updateInspector = function()
{
	this.name.setText(this.object.name);
		
	if(this.uuid !== undefined)
	{
		this.uuid.setText(this.object.uuid);
	}

	this.wrapT.setValue(this.object.wrapT);
	this.wrapS.setValue(this.object.wrapS);
	this.repeat.setValue(this.object.repeat);
	this.offset.setValue(this.object.offset);
	this.center.setValue(this.object.center);
	this.rotation.setValue(this.object.rotation);
	this.magFilter.setValue(this.object.magFilter);
	this.minFilter.setValue(this.object.minFilter);
	this.premultiplyAlpha.setValue(this.object.premultiplyAlpha);
	this.flipY.setValue(this.object.flipY);
};

export {TextureInspector};