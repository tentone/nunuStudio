import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {PassNode} from "./PassNode.js";
import {Editor} from "../../../../Editor.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";

function SSAOPassNode(parent)
{
	PassNode.call(this, parent, "SSAO");

	var self = this;

	this.addText("Only AO");
	this.onlyAO = new CheckBox(this);
	this.onlyAO.size.set(18, 18);
	this.onlyAO.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "onlyAO", self.onlyAO.getValue()));
	});
	this.add(this.onlyAO);
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

	this.addText("Clamp");
	this.aoClamp = new NumberBox(this);
	this.aoClamp.size.set(60, 18);
	this.aoClamp.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "aoClamp", self.aoClamp.getValue()));
	});
	this.add(this.aoClamp);
	this.nextRow();

	this.addText("Lum. Influence");
	this.lumInfluence = new NumberBox(this);
	this.lumInfluence.size.set(60, 18);
	this.lumInfluence.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "lumInfluence", self.lumInfluence.getValue()));
	});
	this.add(this.lumInfluence);
	this.nextRow();
}

SSAOPassNode.prototype = Object.create(PassNode.prototype);

PassNode.registerPass("SSAO", SSAOPassNode);

SSAOPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.radius.setValue(pass.radius);
	this.onlyAO.setValue(pass.onlyAO);
	this.aoClamp.setValue(pass.aoClamp);
	this.lumInfluence.setValue(pass.lumInfluence);
};
export {SSAOPassNode};