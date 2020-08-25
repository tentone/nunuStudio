import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {PassNode} from "./PassNode.js";

function UnrealBloomPassNode(parent)
{
	PassNode.call(this, parent, "Unreal Bloom");

	var self = this;

	this.addText("Strength");
	this.strength = new NumberBox(this);
	this.strength.size.set(60, 18);
	this.strength.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "strength", self.strength.getValue()));
	});
	this.add(this.strength);
	this.nextRow();

	this.addText(Locale.radius);
	this.radius = new NumberBox(this);
	this.radius.size.set(60, 18);
	this.radius.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "radius", self.radius.getValue()));
	});
	this.add(this.radius);
	this.nextRow();

	this.addText("Threshold");
	this.threshold = new NumberBox(this);
	this.threshold.size.set(60, 18);
	this.threshold.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "threshold", self.threshold.getValue()));
	});
	this.add(this.threshold);
	this.nextRow();

	this.addText(Locale.smooth);
	this.smooth = new NumberBox(this);
	this.smooth.size.set(60, 18);
	this.smooth.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "smooth", self.smooth.getValue()));
	});
	this.add(this.smooth);
	this.nextRow();
}

UnrealBloomPassNode.prototype = Object.create(PassNode.prototype);

PassNode.registerPass("UnrealBloom", UnrealBloomPassNode);

UnrealBloomPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.strength.setValue(pass.strength);
	this.radius.setValue(pass.radius);
	this.threshold.setValue(pass.threshold);
	this.smooth.setValue(pass.smooth);
};
export {UnrealBloomPassNode};
