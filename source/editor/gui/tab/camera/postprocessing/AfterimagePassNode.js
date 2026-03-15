import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {Slider} from "../../../../components/input/Slider.js";
import {PassNode} from "./PassNode.js";

class AfterimagePassNode extends PassNode {
	constructor(parent) {
	super(parent, "Afterimage");

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

PassNode.registerPass("Afterimage", AfterimagePassNode);

	setPass(pass) {
	super.setPass(pass);

	this.damp.setValue(this.pass.damp);
	}

}
export {AfterimagePassNode};
