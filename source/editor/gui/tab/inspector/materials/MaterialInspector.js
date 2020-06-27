import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Inspector} from "../Inspector.js";
import {Editor} from "../../../../Editor.js";
import {TextBox} from "../../../../components/input/TextBox.js";
import {Slider} from "../../../../components/input/Slider.js";
import {DropdownList} from "../../../../components/input/DropdownList.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {FrontSide, BackSide, DoubleSide, NeverDepth, AlwaysDepth, LessDepth, LessEqualDepth, GreaterEqualDepth, GreaterDepth, NotEqualDepth, NoBlending, NormalBlending, AdditiveBlending, SubtractiveBlending, MultiplyBlending} from "three";

function MaterialInspector(parent, object)
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
	
	// Type
	if(Editor.settings.general.showType)
	{
		this.form.addText(Locale.type);
		this.type = this.form.addText("");
		this.form.nextRow();
	}

	// Side
	this.form.addText(Locale.side);
	this.side = new DropdownList(this.form);
	this.side.position.set(100, 85);
	this.side.size.set(100, 18);
	this.side.addValue(Locale.front, FrontSide);
	this.side.addValue(Locale.back, BackSide);
	this.side.addValue(Locale.double, DoubleSide);
	this.side.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "side", self.side.getValue()));
		self.object.needsUpdate = true;
	});
	this.form.add(this.side);
	this.form.nextRow();

	// Test depth
	this.form.addText(Locale.depthTest);
	this.depthTest = new CheckBox(this.form);
	this.depthTest.size.set(18, 18);
	this.depthTest.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "depthTest", self.depthTest.getValue()));
		self.object.needsUpdate = true;
	});
	this.form.add(this.depthTest);
	this.form.nextRow();
	
	// Write depth
	this.form.addText(Locale.depthWrite);
	this.depthWrite = new CheckBox(this.form);
	this.depthWrite.size.set(18, 18);
	this.depthWrite.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "depthWrite", self.depthWrite.getValue()));
		self.object.needsUpdate = true;
	});
	this.form.add(this.depthWrite);
	this.form.nextRow();

	// Depth mode
	this.form.addText(Locale.depthMode);
	this.depthFunc = new DropdownList(this.form);
	this.depthFunc.position.set(100, 85);
	this.depthFunc.size.set(100, 18);
	this.depthFunc.addValue(Locale.never, NeverDepth);
	this.depthFunc.addValue(Locale.always, AlwaysDepth);
	this.depthFunc.addValue(Locale.less, LessDepth);
	this.depthFunc.addValue(Locale.lessOrEqual, LessEqualDepth);
	this.depthFunc.addValue(Locale.greaterOrEqual, GreaterEqualDepth);
	this.depthFunc.addValue(Locale.greater, GreaterDepth);
	this.depthFunc.addValue(Locale.notEqual, NotEqualDepth);
	this.depthFunc.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "depthFunc", self.depthFunc.getValue()));
		self.object.needsUpdate = true;
	});
	this.form.add(this.depthFunc);
	this.form.nextRow();

	// Transparent
	this.form.addText(Locale.transparent);
	this.transparent = new CheckBox(this.form);
	this.transparent.size.set(18, 18);
	this.transparent.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "transparent", self.transparent.getValue()));
		self.object.needsUpdate = true;
	});
	this.form.add(this.transparent);
	this.form.nextRow();

	// Opacity level
	this.form.addText(Locale.opacity);
	this.opacity = new Slider(this.form);
	this.opacity.size.set(160, 18);
	this.opacity.setRange(0, 1);
	this.opacity.setStep(0.01);
	this.opacity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "opacity", self.opacity.getValue()));
		self.object.needsUpdate = true;
	});
	this.form.add(this.opacity);
	this.form.nextRow();
	
	// Alpha test
	this.form.addText(Locale.alphaTest);
	this.alphaTest = new Slider(this.form);
	this.alphaTest.size.set(160, 18);
	this.alphaTest.setRange(0, 1);
	this.alphaTest.setStep(0.01);
	this.alphaTest.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "alphaTest", self.alphaTest.getValue()));
		self.object.needsUpdate = true;
	});
	this.form.add(this.alphaTest);
	this.form.nextRow();
	
	// Blending mode
	this.form.addText(Locale.blendingMode);
	this.blending = new DropdownList(this.form);
	this.blending.position.set(100, 85);
	this.blending.size.set(100, 18);
	this.blending.addValue(Locale.none, NoBlending);
	this.blending.addValue(Locale.normal, NormalBlending);
	this.blending.addValue(Locale.additive, AdditiveBlending);
	this.blending.addValue(Locale.subtractive, SubtractiveBlending);
	this.blending.addValue(Locale.multiply, MultiplyBlending);
	this.blending.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "blending", self.blending.getValue()));
		self.object.needsUpdate = true;
	});
	this.form.add(this.blending);
	this.form.nextRow();
}

MaterialInspector.prototype = Object.create(Inspector.prototype);

MaterialInspector.prototype.updateInspector = function()
{
	this.name.setText(this.object.name);
		
	if(this.uuid !== undefined)
	{
		this.uuid.setText(this.object.uuid);
	}
	
	if(this.type !== undefined)
	{
		this.type.setText(this.object.type);
	}

	this.name.setText(this.object.name);
	this.side.setValue(this.object.side);
	this.depthTest.setValue(this.object.depthTest);
	this.depthWrite.setValue(this.object.depthWrite);
	this.depthFunc.setValue(this.object.depthFunc);
	this.transparent.setValue(this.object.transparent);
	this.opacity.setValue(this.object.opacity);
	this.alphaTest.setValue(this.object.alphaTest);
	this.blending.setValue(this.object.blending);
};
export {MaterialInspector};