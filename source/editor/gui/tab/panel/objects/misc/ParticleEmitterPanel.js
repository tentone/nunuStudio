"use strict";

function ParticleEmitterPanel(parent, obj)
{
	ObjectPanel.call(this, parent, obj);

	var self = this;

	//Dynamic emitter
	this.form.addText("Dynamic emitter");
	this.dynamicEmitter = new CheckBox(this.form);
	this.dynamicEmitter.size.set(15, 15);
	this.dynamicEmitter.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "dynamicEmitter", self.dynamicEmitter.getValue()));
	});
	this.form.add(this.dynamicEmitter);
	this.form.nextRow();
}

ParticleEmitterPanel.prototype = Object.create(ObjectPanel.prototype);

ParticleEmitterPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);

	this.dynamicEmitter.setValue(this.obj.dynamicEmitter);
};

