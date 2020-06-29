import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Action} from "../../../../history/action/Action.js";
import {GeometryForm} from "./GeometryForm.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {Form} from "../../../../components/Form.js";
import {CylinderBufferGeometry, CylinderGeometry, BufferGeometry} from "three";

function CylinderGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText(Locale.cylinder);
	this.form.nextRow();

	// Radius
	this.form.addText(Locale.radius);
	this.form.nextRow();

	this.form.addText(Locale.top);
	this.radiusTop = new NumberBox(this.form);
	this.radiusTop.size.set(0, 18);
	this.radiusTop.setRange(0, Number.MAX_SAFE_INTEGER);
	this.radiusTop.setOnChange(updateGeometry);
	this.form.add(this.radiusTop);
	this.form.nextRow();

	this.form.addText(Locale.bottom);
	this.radiusBottom = new NumberBox(this.form);
	this.radiusBottom.size.set(0, 18);
	this.radiusBottom.setRange(0, Number.MAX_SAFE_INTEGER);
	this.radiusBottom.setOnChange(updateGeometry);
	this.form.add(this.radiusBottom);
	this.form.nextRow();

	// Height
	this.form.addText(Locale.height);
	this.height = new NumberBox(this.form);
	this.height.size.set(0, 18);
	this.height.setStep(0.1);
	this.height.setOnChange(updateGeometry);
	this.form.add(this.height);
	this.form.nextRow();

	// Segments
	this.form.addText(Locale.segments);
	this.form.nextRow();

	this.form.addText(Locale.radial);
	this.radialSegments = new NumberBox(this.form);
	this.radialSegments.size.set(0, 18);
	this.radialSegments.setRange(3, Number.MAX_SAFE_INTEGER);
	this.radialSegments.setStep(1);
	this.radialSegments.setOnChange(updateGeometry);
	this.form.add(this.radialSegments);
	this.form.nextRow();

	this.form.addText(Locale.height);
	this.heightSegments = new NumberBox(this.form);
	this.heightSegments.size.set(0, 18);
	this.heightSegments.setRange(1, Number.MAX_SAFE_INTEGER);
	this.heightSegments.setStep(1);
	this.heightSegments.setOnChange(updateGeometry);
	this.form.add(this.heightSegments);
	this.form.nextRow();

	// Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText(Locale.buffered);
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

CylinderGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();
	var GeometryConstructor = this.buffer.getValue() ? CylinderBufferGeometry : CylinderGeometry;
	Editor.addAction(new ChangeAction(this.object, "geometry", new GeometryConstructor(this.radiusTop.getValue(), this.radiusBottom.getValue(), this.height.getValue(), this.radialSegments.getValue(), this.heightSegments.getValue())));
};

CylinderGeometryForm.prototype.updateValues = function()
{
	this.radiusTop.setValue(this.object.geometry.parameters.radiusTop || 20);
	this.radiusBottom.setValue(this.object.geometry.parameters.radiusBottom || 20);
	this.height.setValue(this.object.geometry.parameters.height || 100);
	this.radialSegments.setValue(this.object.geometry.parameters.radialSegments || 8);
	this.heightSegments.setValue(this.object.geometry.parameters.heightSegments || 1);
	this.buffer.setValue(this.object.geometry instanceof BufferGeometry);
};
export {CylinderGeometryForm};