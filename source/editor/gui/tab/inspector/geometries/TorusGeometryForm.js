import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {Action} from "../../../../../history/action/Action.js";
import {GeometryForm} from "../GeometryForm.js";
import {Editor} from "../../../../../Editor.js";
import {Text} from "../../../../../components/Text.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";
import {Form} from "../../../../../components/Form.js";
import {TorusBufferGeometry, TorusGeometry, BufferGeometry} from "three";

function TorusGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText(Locale.torus);
	this.form.nextRow();

	// Radius
	this.form.addText(Locale.radius);
	this.radius = new NumberBox(this.form);
	this.radius.size.set(0, 18);
	this.radius.setStep(0.1);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();
	
	// Tube
	this.form.addText(Locale.tube);
	this.tube = new NumberBox(this.form);
	this.tube.size.set(0, 18);
	this.tube.setStep(0.1);
	this.tube.setOnChange(updateGeometry);
	this.form.add(this.tube);
	this.form.nextRow();

	// Segments
	this.form.addText(Locale.segments);
	this.form.nextRow();
	
	this.form.addText(Locale.radial);
	this.radialSegments = new NumberBox(this.form);
	this.radialSegments.size.set(0, 18);
	this.radialSegments.setStep(1);
	this.radialSegments.setOnChange(updateGeometry);
	this.form.add(this.radialSegments);
	this.form.nextRow();
	
	this.form.addText(Locale.tubular);
	this.tubularSegments = new NumberBox(this.form);
	this.tubularSegments.size.set(0, 18);
	this.tubularSegments.setStep(1);
	this.tubularSegments.setOnChange(updateGeometry);
	this.form.add(this.tubularSegments);
	this.form.nextRow();
	
	// Arc
	this.form.addText(Locale.arc);
	this.arc = new NumberBox(this.form);
	this.arc.size.set(0, 18);
	this.arc.setStep(0.1);
	this.arc.setRange(0, Math.PI * 2);
	this.arc.setOnChange(updateGeometry);
	this.form.add(this.arc);
	this.form.nextRow();

	// Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText(Locale.buffered);
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

TorusGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();
	var GeometryConstructor = this.buffer.getValue() ? TorusBufferGeometry : TorusGeometry;
	Editor.addAction(new ChangeAction(this.object, "geometry", new GeometryConstructor(this.radius.getValue(), this.tube.getValue(), this.radialSegments.getValue(), this.tubularSegments.getValue(), this.arc.getValue())));
};

TorusGeometryForm.prototype.updateValues = function()
{
	this.radius.setValue(this.object.geometry.parameters.radius || 100);
	this.tube.setValue(this.object.geometry.parameters.tube || 40);
	this.radialSegments.setValue(this.object.geometry.parameters.radialSegments || 8);
	this.tubularSegments.setValue(this.object.geometry.parameters.tubularSegments || 6);
	this.arc.setValue(this.object.geometry.parameters.arc || Math.PI * 2);
	this.buffer.setValue(this.object.geometry instanceof BufferGeometry);
};
export {TorusGeometryForm};