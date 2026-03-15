import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {ColorChooser} from "../../../../components/input/ColorChooser.js";
import {PassNode} from "./PassNode.js";

class ColorifyPassNode extends PassNode {
	constructor(parent) {
	super(parent, "Colorify");

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

PassNode.registerPass("Colorify", ColorifyPassNode);

	setPass(pass) {
	super.setPass(pass);

	this.color.setValue(this.pass.color.r, this.pass.color.g, this.pass.color.b);
	}

}
export {ColorifyPassNode};
