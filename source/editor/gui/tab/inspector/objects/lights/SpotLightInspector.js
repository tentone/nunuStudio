import {Locale} from "../../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {LightShadowFormSnippet} from "../../../../form-snippet/LightShadowFormSnippet.js";
import {Editor} from "../../../../../Editor.js";
import {Slider} from "../../../../../components/input/Slider.js";
import {ColorChooser} from "../../../../../components/input/ColorChooser.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";
import {Color} from "three";

function SpotLightInspector(parent, object)
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

	// Penumbra
	this.form.addText(Locale.penumbra);
	this.penumbra = new Slider(this.form);
	this.penumbra.size.set(160, 18);
	this.penumbra.position.set(65, 110);
	this.penumbra.setRange(0, 1);
	this.penumbra.setStep(0.01);
	this.penumbra.updateInterface();
	this.penumbra.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "penumbra", self.penumbra.getValue()));
	});
	this.form.add(this.penumbra);
	this.form.nextRow();

	// Angle
	this.form.addText(Locale.angle);
	this.angle = new Slider(this.form);
	this.angle.size.set(160, 18);
	this.angle.setRange(0, 1.57);
	this.angle.setStep(0.01);
	this.angle.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "angle", self.angle.getValue()));
	});
	this.form.add(this.angle);
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

SpotLightInspector.prototype = Object.create(ObjectInspector.prototype);

SpotLightInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);

	this.color.setValue(this.object.color.r, this.object.color.g, this.object.color.b);
	this.angle.setValue(this.object.angle);
	this.penumbra.setValue(this.object.penumbra);
	this.castShadow.setValue(this.object.castShadow);

	this.shadow.attach(this.object);
};

export {SpotLightInspector};