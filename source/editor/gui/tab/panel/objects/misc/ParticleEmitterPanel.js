"use strict";

function ParticleEmitterPanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

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

ParticleEmitterPanel.prototype = Object.create(ObjectPanel.prototype);

ParticleEmitterPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);

	this.dynamicEmitter.setValue(this.object.dynamicEmitter);
};

