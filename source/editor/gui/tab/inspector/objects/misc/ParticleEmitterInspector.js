import {Locale} from "../../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {Editor} from "../../../../../Editor.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";

function ParticleEmitterInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Dynamic emitter
	this.form.addText(Locale.dynamicEmitter);
	this.dynamicEmitter = new CheckBox(this.form);
	this.dynamicEmitter.size.set(18, 18);
	this.dynamicEmitter.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "dynamicEmitter", self.dynamicEmitter.getValue()));
	});
	this.form.add(this.dynamicEmitter);
	this.form.nextRow();
}

ParticleEmitterInspector.prototype = Object.create(ObjectInspector.prototype);

ParticleEmitterInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);

	this.dynamicEmitter.setValue(this.object.dynamicEmitter);
};


export {ParticleEmitterInspector};
