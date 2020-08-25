import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {CodeInput} from "../../../../components/input/CodeInput.js";
import {ParametricBufferGeometry} from "../../../../../core/geometries/ParametricBufferGeometry.js";

function ParametricGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText(Locale.box);
	this.form.nextRow();
	
	// Code
	this.form.addText(Locale.code);
	this.code = new CodeInput(this.form);
	this.code.size.set(0, 100);
	// this.code.setOnChange(updateGeometry);
	this.form.add(this.code);
	this.form.nextRow();

	// Slices
	this.form.addText(Locale.slices);
	this.slices = new NumberBox(this.form);
	this.slices.size.set(0, 18);
	this.slices.setRange(0, Number.MAX_SAFE_INTEGER);
	this.slices.setStep(1.0);
	this.slices.setOnChange(updateGeometry);
	this.form.add(this.slices);
	this.form.nextRow();

	// Stacks
	this.form.addText(Locale.stacks);
	this.stacks = new NumberBox(this.form);
	this.stacks.size.set(0, 18);
	this.stacks.setRange(0, Number.MAX_SAFE_INTEGER);
	this.stacks.setStep(1.0);
	this.stacks.setOnChange(updateGeometry);
	this.form.add(this.stacks);
	this.form.nextRow();
}

ParametricGeometryForm.prototype.updateGeometry = function()
{
	var geometry = new ParametricBufferGeometry(this.code.getValue(), this.slices.getValue(), this.stacks.getValue());

	this.object.geometry.dispose();
	Editor.addAction(new ChangeAction(this.object, "geometry", geometry));
};


ParametricGeometryForm.prototype.updateValues = function()
{
	this.code.setValue(this.object.geometry.parameters.code);
	this.slices.setValue(this.object.geometry.parameters.slices);
	this.stacks.setValue(this.object.geometry.parameters.stacks);
};
export {ParametricGeometryForm};
