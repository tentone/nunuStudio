import {Locale} from "../../../../../locale/LocaleManager.js";
import {TextSprite} from "../../../../../../core/objects/text/TextSprite.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {DrawableInspector} from "../DrawableInspector.js";
import {Editor} from "../../../../../Editor.js";
import {TextArea} from "../../../../../components/input/TextArea.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../../components/input/DropdownList.js";
import {ColorChooser} from "../../../../../components/input/ColorChooser.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";

function TextSpriteInspector(parent, object)
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
	this.color.size.set(0, 18);
	this.color.setValue(0, 0, 0);
	this.color.setOnChange(function()
	{	
		Editor.addAction(new ChangeAction(self.object, "color", self.color.getValueString()));
	});
	this.form.add(this.color);
	this.form.nextRow();

	// Align
	this.form.addText(Locale.align);
	this.align = new DropdownList(this.form);
	this.align.size.set(0, 18);
	this.align.addValue(Locale.left, TextSprite.LEFT);
	this.align.addValue(Locale.right, TextSprite.RIGHT);
	this.align.addValue(Locale.center, TextSprite.CENTER);
	this.align.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "align", self.align.getValue()));
	});
	this.form.add(this.align);
	this.form.nextRow();

	// Resolution
	this.form.addText(Locale.resolution);
	this.resolution = new NumberBox(this.form);
	this.resolution.size.set(0, 18);
	this.resolution.setRange(0, Number.MAX_SAFE_INTEGER);
	this.resolution.setStep(0.1);
	this.resolution.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "resolution", self.resolution.getValue()));
	});
	this.form.add(this.resolution);
	this.form.nextRow();

	var safeFonts = ["Andale Mono", "Arial", "Arial Bold", "Arial Italic", "Arial Bold Italic", "Arial Black", "Comic Sans MS", "Comic Sans MS Bold", "Courier New",
		"Courier New Bold", "Courier New Italic", "Courier New Bold Italic", "Georgia", "Georgia Bold", "Georgia Italic", "Georgia Bold Italic", "Impact", "Lucida Console",
		"Lucida Sans Unicode", "Marlett", "Minion Web", "Symbol", "Times New Roman", "Times New Roman Bold", "Times New Roman Italic", "Times New Roman Bold Italic", "Tahoma",
		"Trebuchet MS", "Trebuchet MS Bold", "Trebuchet MS Italic", "Trebuchet MS Bold Italic", "Verdana", "Verdana Bold", "Verdana Italic", "Verdana Bold Italic", "Webdings"];

	// Fonts
	this.form.addText(Locale.font);
	this.font = new DropdownList(this.form);
	this.font.size.set(0, 18);
	for (var i = 0; i < safeFonts.length; i++)
	{
		this.font.addValue(safeFonts[i], safeFonts[i]);
	}
	this.font.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "font", self.font.getValue()));
	});
	this.form.add(this.font);
	this.form.nextRow();

	// Outline
	this.form.addText(Locale.outline);
	this.outline = new CheckBox(this.form);
	this.outline.size.set(18, 18);
	this.outline.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "outline", self.outline.getValue()));
	});
	this.form.add(this.outline);
	this.form.nextRow();

	// Outline Width
	this.form.addText(Locale.outlineWidth);
	this.outlineWidth = new NumberBox(this.form);
	this.outlineWidth.size.set(0, 18);
	this.outlineWidth.setRange(0, Number.MAX_SAFE_INTEGER);
	this.outlineWidth.setStep(0.1);
	this.outlineWidth.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "outlineWidth", self.outlineWidth.getValue()));
	});
	this.form.add(this.outlineWidth);
	this.form.nextRow();

	// Outline Color
	this.form.addText(Locale.outlineColor);
	this.outlineColor = new ColorChooser(this.form);
	this.outlineColor.size.set(0, 18);
	this.outlineColor.setValue(0, 0, 0);
	this.outlineColor.setOnChange(function()
	{	
		Editor.addAction(new ChangeAction(self.object, "outlineColor", self.outlineColor.getValueString()));
	});
	this.form.add(this.outlineColor);
	this.form.nextRow();
}

TextSpriteInspector.prototype = Object.create(DrawableInspector.prototype);

TextSpriteInspector.prototype.updateInspector = function()
{
	DrawableInspector.prototype.updateInspector.call(this);

	this.text.setText(this.object.text);
	this.color.setValueString(this.object.color);
	this.align.setValue(this.object.align);
	this.resolution.setValue(this.object.resolution);
	this.font.setValue(this.object.font);
	this.outline.setValue(this.object.outline);
	this.outlineWidth.setValue(this.object.outlineWidth);
	this.outlineColor.setValueString(this.object.outlineColor);
};

export {TextSpriteInspector};
