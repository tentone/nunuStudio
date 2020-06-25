import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {GeometryForm} from "./GeometryForm.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {Form} from "../../../../components/Form.js";
import {RingBufferGeometry, RingGeometry, BufferGeometry} from "three";

function RingGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText(Locale.ring);
	this.form.nextRow();
	
	// Inner radius
	this.form.addText(Locale.innerRadius);
	this.innerRadius = new NumberBox(this.form);
	this.innerRadius.size.set(60, 18);
	this.innerRadius.setStep(0.1);
	this.innerRadius.setRange(0, Number.MAX_SAFE_INTEGER);
	this.innerRadius.setOnChange(updateGeometry);
	this.form.add(this.innerRadius);
	this.form.nextRow();

	// Outer radius
	this.form.addText(Locale.outerRadius);
	this.outerRadius = new NumberBox(this.form);
	this.outerRadius.size.set(60, 18);
	this.outerRadius.setStep(0.1);
	this.outerRadius.setRange(0, Number.MAX_SAFE_INTEGER);
	this.outerRadius.setOnChange(updateGeometry);
	this.form.add(this.outerRadius);
	this.form.nextRow();

	// Theta segments
	this.form.addText(Locale.thetaSegments);
	this.thetaSegments = new NumberBox(this.form);
	this.thetaSegments.size.set(60, 18);
	this.thetaSegments.setStep(1.0);
	this.thetaSegments.setRange(3, Number.MAX_SAFE_INTEGER);
	this.thetaSegments.setOnChange(updateGeometry);
	this.form.add(this.thetaSegments);
	this.form.nextRow();

	// Phi segments
	this.form.addText(Locale.phiSegments);
	this.phiSegments = new NumberBox(this.form);
	this.phiSegments.size.set(60, 18);
	this.phiSegments.setStep(1.0);
	this.phiSegments.setRange(3, Number.MAX_SAFE_INTEGER);
	this.phiSegments.setOnChange(updateGeometry);
	this.form.add(this.phiSegments);
	this.form.nextRow();

	// Theta start
	this.form.addText(Locale.thetaStart);
	this.thetaStart = new NumberBox(this.form);
	this.thetaStart.size.set(60, 18);
	this.thetaStart.setStep(0.1);
	this.thetaStart.setOnChange(updateGeometry);
	this.form.add(this.thetaStart);
	this.form.nextRow();

	// Theta length
	this.form.addText(Locale.thetaLength);
	this.thetaLength = new NumberBox(this.form);
	this.thetaLength.size.set(60, 18);
	this.thetaLength.setStep(0.1);
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

RingGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();
	var GeometryConstructor = this.buffer.getValue() ? RingBufferGeometry : RingGeometry;
	Editor.addAction(new ChangeAction(this.object, "geometry", new GeometryConstructor(this.innerRadius.getValue(), this.outerRadius.getValue(), this.thetaSegments.getValue(), this.phiSegments.getValue(), this.thetaStart.getValue(), this.thetaLength.getValue())));
};

RingGeometryForm.prototype.updateValues = function()
{
	this.innerRadius.setValue(this.object.geometry.parameters.innerRadius || 0.5);
	this.outerRadius.setValue(this.object.geometry.parameters.outerRadius || 1);
	this.thetaSegments.setValue(this.object.geometry.parameters.thetaSegments || 8);
	this.phiSegments.setValue(this.object.geometry.parameters.phiSegments || 8);
	this.thetaStart.setValue(this.object.geometry.parameters.thetaStart || 0);
	this.thetaLength.setValue(this.object.geometry.parameters.thetaLength || Math.PI * 2);
	this.buffer.setValue(this.object.geometry instanceof BufferGeometry);
};
export {RingGeometryForm};