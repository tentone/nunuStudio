import {Pass} from "../../../../../core/postprocessing/Pass.js";
import {ColorifyPass} from "../../../../../core/postprocessing/pass/ColorifyPass.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {PassNode} from "./PassNode.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {ColorChooser} from "../../../../components/input/ColorChooser.js";

function ColorifyPassNode(parent)
{
	PassNode.call(this, parent, "Colorify");

	var self = this;

	this.addText(Locale.color);
	this.color = new ColorChooser(this);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		var value = self.color.getValue();

		var color = self.pass.color.clone();
		color.setRGB(value.r, value.g, value.b);

		Editor.addAction(new ChangeAction(self.pass, "color", color));
	});
	this.add(this.color);
	this.nextRow();
}

ColorifyPassNode.prototype = Object.create(PassNode.prototype);

PassNode.registerPass("Colorify", ColorifyPassNode);

ColorifyPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.color.setValue(this.pass.color.r, this.pass.color.g, this.pass.color.b);
};
export {ColorifyPassNode};