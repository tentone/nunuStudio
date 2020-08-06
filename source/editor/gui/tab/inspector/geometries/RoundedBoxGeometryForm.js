import {Locale} from "../../../../locale/LocaleManager.js";
import {RoundedBoxBufferGeometry} from "../../../../../core/geometries/RoundedBoxBufferGeometry.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";

function RoundedBoxGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText(Locale.roundedBox);
	this.form.nextRow();

	// Size
	this.form.addText(Locale.width);
	this.width = new NumberBox(this.form);
	this.width.size.set(0, 18);
	this.width.setStep(0.1);
	this.width.setOnChange(updateGeometry);
	this.form.add(this.width);
	this.form.nextRow();

	this.form.addText(Locale.height);
	this.height = new NumberBox(this.form);
	this.height.size.set(0, 18);
	this.height.setStep(0.1);
	this.height.setOnChange(updateGeometry);
	this.form.add(this.height);
	this.form.nextRow();

	this.form.addText(Locale.depth);
	this.depth = new NumberBox(this.form);
	this.depth.size.set(0, 18);
	this.depth.setStep(0.1);
	this.depth.setOnChange(updateGeometry);
	this.form.add(this.depth);
	this.form.nextRow();

	// Radius
	this.form.addText(Locale.radius);
	this.radius = new NumberBox(this.form);
	this.radius.size.set(0, 18);
	this.radius.setStep(0.01);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();

	// Radius segments
	this.form.addText(Locale.radiusSegments);
	this.radiusSegments = new NumberBox(this.form);
	this.radiusSegments.size.set(0, 18);
	this.radiusSegments.setStep(1.0);
	this.radiusSegments.setOnChange(updateGeometry);
	this.form.add(this.radiusSegments);
	this.form.nextRow();
}

RoundedBoxGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();

	var geometry = new RoundedBoxBufferGeometry(this.width.getValue(), this.height.getValue(), this.depth.getValue(), this.radius.getValue(), this.radiusSegments.getValue());

	Editor.addAction(new ChangeAction(this.object, "geometry", geometry));
};

RoundedBoxGeometryForm.prototype.updateValues = function()
{
	this.width.setValue(this.object.geometry.parameters.width);
	this.height.setValue(this.object.geometry.parameters.height);
	this.depth.setValue(this.object.geometry.parameters.depth);
	this.radius.setValue(this.object.geometry.parameters.radius);
	this.radiusSegments.setValue(this.object.geometry.parameters.radiusSegments);

};
export {RoundedBoxGeometryForm};