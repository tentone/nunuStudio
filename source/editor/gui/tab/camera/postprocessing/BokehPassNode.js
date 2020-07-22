import {Locale} from "../../../../locale/LocaleManager.js";
import {Pass} from "../../../../../core/postprocessing/Pass.js";
import {BokehPass} from "../../../../../core/postprocessing/pass/BokehPass.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {PassNode} from "./PassNode.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {Slider} from "../../../../components/input/Slider.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";

function BokehPassNode(parent)
{
	PassNode.call(this, parent, "Bokeh");

	var self = this;

	this.addText("Aperture");
	this.aperture = new Slider(this);
	this.aperture.size.set(0, 18);
	this.aperture.setRange(0, 1e-3);
	this.aperture.setStep(1e-5);
	this.aperture.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "aperture", self.aperture.getValue()));
	});
	this.add(this.aperture);
	this.nextRow();

	this.addText(Locale.focus);
	this.focus = new NumberBox(this);
	this.focus.size.set(0, 18);
	this.focus.setStep(1e-4);
	this.focus.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "focus", self.focus.getValue()));
	});
	this.add(this.focus);
	this.nextRow();

	this.addText("Max Blur");
	this.maxblur = new Slider(this);
	this.maxblur.size.set(0, 18);
	this.maxblur.setRange(0, 3e-1);
	this.maxblur.setStep(1e-5);
	this.maxblur.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "maxblur", self.maxblur.getValue()));
	});
	this.add(this.maxblur);
	this.nextRow();
}

BokehPassNode.prototype = Object.create(PassNode.prototype);

PassNode.registerPass("Bokeh", BokehPassNode);

BokehPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.aperture.setValue(pass.aperture);
	this.focus.setValue(pass.focus);
	this.maxblur.setValue(pass.maxblur);
};
export {BokehPassNode};