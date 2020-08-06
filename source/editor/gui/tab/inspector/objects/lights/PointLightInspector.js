import {Locale} from "../../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {LightShadowFormSnippet} from "../../../../form-snippet/LightShadowFormSnippet.js";
import {Editor} from "../../../../../Editor.js";
import {Slider} from "../../../../../components/input/Slider.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";
import {ColorChooser} from "../../../../../components/input/ColorChooser.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";
import {Color} from "three";

function PointLightInspector(parent, object)
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

	// Distance
	this.form.addText(Locale.distance);
	this.distance = new NumberBox(this.form);
	this.distance.size.set(60, 18);
	this.distance.setStep(0.1);
	this.distance.setRange(0, Number.MAX_SAFE_INTEGER);
	this.distance.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "distance", self.distance.getValue()));
	});
	this.form.add(this.distance);
	this.form.nextRow();

	// Intensity
	this.form.addText(Locale.intensity);
	this.intensity = new Slider(this.form);
	this.intensity.size.set(160, 18);
	this.intensity.setStep(0.1);
	this.intensity.setRange(0, 10);
	this.intensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "intensity", self.intensity.getValue()));
	});
	this.form.add(this.intensity);
	this.form.nextRow();

	// Shadow map
	this.form.addText(Locale.shadows);
	this.form.nextRow();

	// Cast shadow
	this.castShadow = new CheckBox(this.form);
	this.form.addText(Locale.castShadows);
	this.castShadow.size.set(18, 18);
	this.castShadow.position.set(5, 85);
	this.castShadow.updateInterface();
	this.castShadow.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	// Shadow
	this.shadow = new LightShadowFormSnippet(this.form, object);

}

PointLightInspector.prototype = Object.create(ObjectInspector.prototype);

PointLightInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
	
	this.color.setValue(this.object.color.r, this.object.color.g, this.object.color.b);
	this.distance.setValue(this.object.distance);
	this.intensity.setValue(this.object.intensity);
	this.castShadow.setValue(this.object.castShadow);

	this.shadow.attach(this.object);
};

export {PointLightInspector};