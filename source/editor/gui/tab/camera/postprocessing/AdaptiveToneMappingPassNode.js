import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {PassNode} from "./PassNode.js";

class AdaptiveToneMappingPassNode extends PassNode {
	constructor(parent) {
	super(parent, "Adaptive Tone Mapping");

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

PassNode.registerPass("AdaptiveToneMapping", AdaptiveToneMappingPassNode);

	setPass(pass) {
	super.setPass(pass);

	this.minLuminance.setValue(pass.minLuminance);
	this.tau.setValue(pass.tau);
	}

}
export {AdaptiveToneMappingPassNode};
