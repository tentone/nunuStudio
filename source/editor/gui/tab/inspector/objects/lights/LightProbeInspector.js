import {Locale} from "../../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {Editor} from "../../../../../Editor.js";
import {Slider} from "../../../../../components/input/Slider.js";


function LightProbeInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

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
}

LightProbeInspector.prototype = Object.create(ObjectInspector.prototype);

LightProbeInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);

	this.intensity.setValue(this.object.intensity);
};

export {LightProbeInspector};
