"use strict";

function ParticleEmitterInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	//Dynamic emitter
	this.form.addText("Dynamic emitter");
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

