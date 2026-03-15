import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {Slider} from "../../../../components/input/Slider.js";
import {PassNode} from "./PassNode.js";

class HueSaturationPassNode extends PassNode {
	constructor(parent) {
	super(parent, "HueSaturation");

	var self = this;

	this.addText("Hue");
	this.hue = new Slider(this);
	this.hue.size.set(80, 18);
	this.hue.setStep(0.05);
	this.hue.setRange(-1, 1);
	this.hue.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "hue", self.hue.getValue()));
	});
	this.add(this.hue);
	this.nextRow();

	this.addText("Saturation");
	this.saturation = new Slider(this);
	this.saturation.size.set(80, 18);
	this.saturation.setStep(0.05);
	this.saturation.setRange(-1, 1);
	this.saturation.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "saturation", self.saturation.getValue()));
	});
	this.add(this.saturation);
	this.nextRow();
	}

PassNode.registerPass("HueSaturation", HueSaturationPassNode);

	setPass(pass) {
	super.setPass(pass);

	this.hue.setValue(this.pass.hue);
	this.saturation.setValue(this.pass.saturation);
	}

}
export {HueSaturationPassNode};
