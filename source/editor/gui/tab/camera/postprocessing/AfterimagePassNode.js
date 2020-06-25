"use strict";

function AfterimagePassNode(parent)
{
	PassNode.call(this, parent, "Afterimage");

	var self = this;

	this.addText("Dapening");
	this.damp = new Slider(this);
	this.damp.size.set(80, 18);
	this.damp.setStep(0.01);
	this.damp.setRange(0, 1);
	this.damp.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "damp", self.damp.getValue()));
	});
	this.add(this.damp);
	this.nextRow();
}

AfterimagePassNode.prototype = Object.create(PassNode.prototype);

PassNode.registerPass("Afterimage", AfterimagePassNode);

AfterimagePassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.damp.setValue(this.pass.damp);
};