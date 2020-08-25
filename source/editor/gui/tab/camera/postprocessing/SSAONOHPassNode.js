import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {PassNode} from "./PassNode.js";

function SSAONOHPassNode(parent)
{
	PassNode.call(this, parent, "SSAO NOH");

	var self = this;

	this.addText(Locale.kernelRadius);
	this.kernelRadius = new NumberBox(this);
	this.kernelRadius.size.set(0, 18);
	this.kernelRadius.setStep(1.0);
	this.kernelRadius.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "kernelRadius", self.kernelRadius.getValue()));
	});
	this.add(this.kernelRadius);
	this.nextRow();

	this.addText(Locale.kernelSize);
	this.kernelSize = new NumberBox(this);
	this.kernelSize.size.set(0, 18);
	this.kernelSize.setStep(1.0);
	this.kernelSize.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "kernelSize", self.kernelSize.getValue()));
	});
	this.add(this.kernelSize);
	this.nextRow();

	this.addText(Locale.minDistance);
	this.minDistance = new NumberBox(this);
	this.minDistance.size.set(0, 18);
	this.minDistance.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "minDistance", self.minDistance.getValue()));
	});
	this.add(this.minDistance);
	this.nextRow();

	this.addText(Locale.maxDistance);
	this.maxDistance = new NumberBox(this);
	this.maxDistance.size.set(0, 18);
	this.maxDistance.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "maxDistance", self.maxDistance.getValue()));
	});
	this.add(this.maxDistance);
	this.nextRow();
}

SSAONOHPassNode.prototype = Object.create(PassNode.prototype);

PassNode.registerPass("SSAONOH", SSAONOHPassNode);

SSAONOHPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.kernelRadius.setValue(pass.kernelRadius);
	this.minDistance.setValue(pass.minDistance);
	this.maxDistance.setValue(pass.maxDistance);
	this.kernelSize.setValue(pass.kernelSize);
};
export {SSAONOHPassNode};
