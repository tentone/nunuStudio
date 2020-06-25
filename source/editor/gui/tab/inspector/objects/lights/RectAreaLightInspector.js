import {RectAreaLight} from "../../../../../../../core/objects/lights/RectAreaLight.js";
import {ChangeAction} from "../../../../../../history/action/ChangeAction.js";
import {Action} from "../../../../../../history/action/Action.js";
import {ObjectInspector} from "../../ObjectInspector.js";
import {Inspector} from "../../../Inspector.js";
import {Editor} from "../../../../../../Editor.js";
import {Text} from "../../../../../../components/Text.js";
import {Slider} from "../../../../../../components/input/Slider.js";
import {NumberBox} from "../../../../../../components/input/NumberBox.js";
import {ColorChooser} from "../../../../../../components/input/ColorChooser.js";
import {Color} from "three";

function RectAreaLightInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Color
	this.form.addText(Locale.color);
	this.color = new ColorChooser(this.form);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "color", new Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();

	// Intensity
	this.form.addText(Locale.intensity);
	this.intensity = new Slider(this.form);
	this.intensity.size.set(160, 18);
	this.intensity.setStep(0.1);
	this.intensity.setRange(0, 500);
	this.intensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "intensity", self.intensity.getValue()));
	});
	this.form.add(this.intensity);
	this.form.nextRow();

	// Rect width
	this.form.addText(Locale.width);
	this.width = new NumberBox(this.form);
	this.width.size.set(60, 18);
	this.width.setStep(0.1);
	this.width.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "width", self.width.getValue()));
	});
	this.form.add(this.width);
	this.form.nextRow();
	
	// Rect height
	this.form.addText(Locale.height);
	this.height = new NumberBox(this.form);
	this.height.size.set(60, 18);
	this.height.setStep(0.1);
	this.height.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "height", self.height.getValue()));
	});
	this.form.add(this.height);
	this.form.nextRow();
}

RectAreaLightInspector.prototype = Object.create(ObjectInspector.prototype);

RectAreaLightInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
	
	this.color.setValue(this.object.color.r, this.object.color.g, this.object.color.b);
	this.intensity.setValue(this.object.intensity);
	this.width.setValue(this.object.width);
	this.height.setValue(this.object.height);
};

export {RectAreaLightInspector};