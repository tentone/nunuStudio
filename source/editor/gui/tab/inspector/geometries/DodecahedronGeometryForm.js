import {Locale} from "../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {Slider} from "../../../../components/input/Slider.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {DodecahedronBufferGeometry, DodecahedronGeometry, BufferGeometry} from "three";

function DodecahedronGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText(Locale.dodecahedron);
	this.form.nextRow();

	// Radius
	this.form.addText(Locale.radius);
	this.radius = new NumberBox(this.form);
	this.radius.size.set(0, 18);
	this.radius.setStep(0.1);
	this.radius.setRange(0, Number.MAX_SAFE_INTEGER);
	this.radius.setOnChange(updateGeometry);
	this.form.add(this.radius);
	this.form.nextRow();

	// Detail
	this.form.addText(Locale.detail);
	this.detail = new Slider(this.form);
	this.detail.size.set(90, 18);
	this.detail.setRange(0, 8);
	this.detail.setStep(1);
	this.detail.setOnChange(updateGeometry);
	this.form.add(this.detail);
	this.form.nextRow();

	// Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText(Locale.buffered);
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

DodecahedronGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();
	var GeometryConstructor = this.buffer.getValue() ? DodecahedronBufferGeometry : DodecahedronGeometry;
	Editor.addAction(new ChangeAction(this.object, "geometry", new GeometryConstructor(this.radius.getValue(), this.detail.getValue())));
};

DodecahedronGeometryForm.prototype.updateValues = function()
{
	this.radius.setValue(this.object.geometry.parameters.radius || 2);
	this.detail.setValue(this.object.geometry.parameters.detail || 0);
	this.buffer.setValue(this.object.geometry instanceof BufferGeometry);
};
export {DodecahedronGeometryForm};