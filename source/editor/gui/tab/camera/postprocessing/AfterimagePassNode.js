import {Pass} from "../../../../../../core/postprocessing/Pass.js";
import {AfterimagePass} from "../../../../../../core/postprocessing/pass/AfterimagePass.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {Action} from "../../../../../history/action/Action.js";
import {PassNode} from "../PassNode.js";
import {Editor} from "../../../../../Editor.js";
import {Text} from "../../../../../components/Text.js";
import {Slider} from "../../../../../components/input/Slider.js";

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
export {AfterimagePassNode};