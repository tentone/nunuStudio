import {Locale} from "../../../../../locale/LocaleManager.js";
import {TextBitmap} from "../../../../../../core/objects/text/TextBitmap.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {Action} from "../../../../../history/action/Action.js";
import {DrawableInspector} from "../DrawableInspector.js";
import {Inspector} from "../../Inspector.js";
import {Editor} from "../../../../../Editor.js";
import {Text} from "../../../../../components/Text.js";
import {TextArea} from "../../../../../components/input/TextArea.js";
import {Slider} from "../../../../../components/input/Slider.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../../components/input/DropdownList.js";
import {ColorChooser} from "../../../../../components/input/ColorChooser.js";
import {Color} from "three";

function TextBitmapInspector(parent, object)
{
	DrawableInspector.call(this, parent, object);

	var self = this;

	// Text
	this.form.addText(Locale.text);
	this.text = new TextArea(this.form);
	this.text.size.set(0, 55);
	this.text.setOnInput(function()
	{
		Editor.addAction(new ChangeAction(self.object, "text", self.text.getText()));
	}, 500);
	this.form.add(this.text);
	this.form.nextRow();

	// Color
	this.form.addText(Locale.color);
	this.color = new ColorChooser(this.form);
	this.color.size.set(100, 18);
	this.color.setValue(0, 0, 0);
	this.color.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "color", new Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();

	// Shader
	this.form.addText(Locale.shader);
	this.shader = new DropdownList(this.form);
	this.shader.size.set(0, 18);
	this.shader.addValue("SDF", TextBitmap.SDF);
	this.shader.addValue("MSDF", TextBitmap.MSDF);
	this.shader.addValue("Bitmap", TextBitmap.BITMAP);
	this.shader.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "shader", self.shader.getValue()));
	});
	this.form.add(this.shader);
	this.form.nextRow();

	// Align
	this.form.addText(Locale.align);
	this.align = new DropdownList(this.form);
	this.align.size.set(0, 18);
	this.align.addValue(Locale.left, TextBitmap.LEFT);
	this.align.addValue(Locale.right, TextBitmap.RIGHT);
	this.align.addValue(Locale.center, TextBitmap.CENTER);
	this.align.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "align", self.align.getValue()));
	});
	this.form.add(this.align);
	this.form.nextRow();

	// Line Height
	this.form.addText(Locale.lineHeight);
	this.lineHeight = new NumberBox(this.form);
	this.lineHeight.size.set(0, 18);
	this.lineHeight.setRange(0, Number.MAX_SAFE_INTEGER);
	this.lineHeight.setStep(0.1);
	this.lineHeight.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "lineHeight", self.lineHeight.getValue()));
	});
	this.form.add(this.lineHeight);
	this.form.nextRow();

	// Line Height
	this.form.addText(Locale.letterSpacing);
	this.letterSpacing = new NumberBox(this.form);
	this.letterSpacing.size.set(0, 18);
	this.letterSpacing.setRange(0, Number.MAX_SAFE_INTEGER);
	this.letterSpacing.setStep(0.1);
	this.letterSpacing.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "letterSpacing", self.letterSpacing.getValue()));
	});
	this.form.add(this.letterSpacing);
	this.form.nextRow();

	// Width
	this.form.addText(Locale.width);
	this.width = new NumberBox(this.form);
	this.width.size.set(0, 18);
	this.width.setRange(0, Number.MAX_SAFE_INTEGER);
	this.width.setStep(0.1);
	this.width.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "width", self.width.getValue()));
	});
	this.form.add(this.width);
	this.form.nextRow();

	// Threshold
	this.form.addText(Locale.threshold);
	this.threshold = new Slider(this.form);
	this.threshold.size.set(0, 18);
	this.threshold.setRange(0, 1.0);
	this.threshold.setStep(0.01);
	this.threshold.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "threshold", self.threshold.getValue()));
	});
	this.form.add(this.threshold);
	this.form.nextRow();

	// Smoothing
	this.form.addText(Locale.smoothing);
	this.smoothing = new Slider(this.form);
	this.smoothing.size.set(0, 18);
	this.smoothing.setRange(0, 5.0);
	this.smoothing.setStep(0.01);
	this.smoothing.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "smoothing", self.smoothing.getValue()));
	});
	this.form.add(this.smoothing);
	this.form.nextRow();
}

TextBitmapInspector.prototype = Object.create(DrawableInspector.prototype);

TextBitmapInspector.prototype.updateInspector = function()
{
	DrawableInspector.prototype.updateInspector.call(this);

	this.text.setText(this.object.text);
	this.lineHeight.setValue(this.object.lineHeight);
	this.letterSpacing.setValue(this.object.letterSpacing);
	this.align.setValue(this.object.align);
	this.width.setValue(this.object.width);
	this.color.setValue(this.object.color);
	this.threshold.setValue(this.object.threshold);
	this.smoothing.setValue(this.object.smoothing);
};

export {TextBitmapInspector};