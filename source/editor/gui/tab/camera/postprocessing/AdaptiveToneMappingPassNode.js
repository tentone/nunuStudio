import {Pass} from "../../../../../core/postprocessing/Pass.js";
import {AdaptiveToneMappingPass} from "../../../../../core/postprocessing/pass/AdaptiveToneMappingPass.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {PassNode} from "./PassNode.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";

function AdaptiveToneMappingPassNode(parent)
{
	PassNode.call(this, parent, "Adaptive Tone Mapping");

	var self = this;

	this.addText("Min Luminance");
	this.minLuminance = new NumberBox(this);
	this.minLuminance.size.set(60, 18);
	this.minLuminance.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "minLuminance", self.minLuminance.getValue()));
	});
	this.add(this.minLuminance);
	this.nextRow();

	this.addText("Tau");
	this.tau = new NumberBox(this);
	this.tau.size.set(60, 18);
	this.tau.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "tau", self.tau.getValue()));
	});
	this.add(this.tau);
	this.nextRow();

	this.addText("Adaptive");
	this.adaptive = new CheckBox(this);
	this.adaptive.size.set(18, 18);
	this.adaptive.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "adaptive", self.adaptive.getValue()));
	});
	this.add(this.adaptive);
	this.nextRow();
}

AdaptiveToneMappingPassNode.prototype = Object.create(PassNode.prototype);

PassNode.registerPass("AdaptiveToneMapping", AdaptiveToneMappingPassNode);

AdaptiveToneMappingPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.minLuminance.setValue(pass.minLuminance);
	this.tau.setValue(pass.tau);
};
export {AdaptiveToneMappingPassNode};