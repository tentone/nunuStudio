import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {GeometryForm} from "./GeometryForm.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {Form} from "../../../../components/Form.js";
import {SphereBufferGeometry, SphereGeometry, BufferGeometry} from "three";

function SphereGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText(Locale.sphere);
	this.form.nextRow();

	// Radius
	this.form.addText(Locale.radius);
	this.radius = new NumberBox(this.form);
	this.radius.size.set(0, 18);
	this.radius.setStep(0.1);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();

	// Segments
	this.form.addText(Locale.segments);
	this.form.nextRow();
	
	this.form.addText(Locale.width);
	this.widthSegments = new NumberBox(this.form);
	this.widthSegments.size.set(0, 18);
	this.widthSegments.setStep(1);
	this.widthSegments.setOnChange(updateGeometry);
	this.form.add(this.widthSegments);
	this.form.nextRow();

	this.form.addText(Locale.height);
	this.heightSegments = new NumberBox(this.form);
	this.heightSegments.size.set(0, 18);
	this.heightSegments.setStep(1);
	this.heightSegments.setOnChange(updateGeometry);
	this.form.add(this.heightSegments);
	this.form.nextRow();

	this.form.addText(Locale.phiStart);
	this.phiStart = new NumberBox(this.form);
	this.phiStart.size.set(0, 18);
	this.phiStart.setStep(0.01);
	this.phiStart.setOnChange(updateGeometry);
	this.form.add(this.phiStart);
	this.form.nextRow();
	
	this.form.addText(Locale.phiLength);
	this.phiLength = new NumberBox(this.form);
	this.phiLength.size.set(0, 18);
	this.phiLength.setStep(0.01);
	this.phiLength.setOnChange(updateGeometry);
	this.form.add(this.phiLength);
	this.form.nextRow();

	this.form.addText(Locale.thetaStart);
	this.thetaStart = new NumberBox(this.form);
	this.thetaStart.size.set(0, 18);
	this.thetaStart.setStep(0.01);
	this.thetaStart.setOnChange(updateGeometry);
	this.form.add(this.thetaStart);
	this.form.nextRow();

	this.form.addText(Locale.thetaLength);
	this.thetaLength = new NumberBox(this.form);
	this.thetaLength.size.set(0, 18);
	this.thetaLength.setStep(0.01);
	this.thetaLength.setOnChange(updateGeometry);
	this.form.add(this.thetaLength);
	this.form.nextRow();

	// Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText(Locale.buffered);
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

SphereGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();
	var GeometryConstructor = this.buffer.getValue() ? SphereBufferGeometry : SphereGeometry;
	Editor.addAction(new ChangeAction(this.object, "geometry", new GeometryConstructor(this.radius.getValue(), this.widthSegments.getValue(), this.heightSegments.getValue(), this.phiStart.getValue(), this.phiLength.getValue(), this.thetaStart.getValue(), this.thetaLength.getValue())));
};

SphereGeometryForm.prototype.updateValues = function()
{
	this.radius.setValue(this.object.geometry.parameters.radius || 50);
	this.widthSegments.setValue(this.object.geometry.parameters.widthSegments || 8);
	this.heightSegments.setValue(this.object.geometry.parameters.heightSegments || 6);
	this.phiStart.setValue(this.object.geometry.parameters.phiStart || 0);
	this.phiLength.setValue(this.object.geometry.parameters.phiLength || Math.PI * 2);
	this.thetaStart.setValue(this.object.geometry.parameters.thetaStart || 0);
	this.thetaLength.setValue(this.object.geometry.parameters.thetaLength || Math.PI);
	this.buffer.setValue(this.object.geometry instanceof BufferGeometry);
};
export {SphereGeometryForm};