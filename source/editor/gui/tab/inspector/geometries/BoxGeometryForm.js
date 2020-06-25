import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {Action} from "../../../../../history/action/Action.js";
import {GeometryForm} from "../GeometryForm.js";
import {Editor} from "../../../../../Editor.js";
import {Text} from "../../../../../components/Text.js";
import {NumberRow} from "../../../../../components/input/NumberRow.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";
import {Form} from "../../../../../components/Form.js";
import {BoxBufferGeometry, BoxGeometry, BufferGeometry} from "three";

function BoxGeometryForm(form, object)
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
	
	// Size
	this.form.addText(Locale.size);
	this.sizeRow = new NumberRow(this.form);
	this.sizeRow.size.set(0, 18);

	this.width = this.sizeRow.addValue("X");
	this.width.setStep(0.1);
	this.width.setOnChange(updateGeometry);

	this.height = this.sizeRow.addValue("Y");
	this.height.setStep(0.1);
	this.height.setOnChange(updateGeometry);

	this.depth = this.sizeRow.addValue("Z");
	this.depth.setStep(0.1);
	this.depth.setOnChange(updateGeometry);

	this.form.add(this.sizeRow);
	this.form.nextRow();

	// Segments
	this.form.addText(Locale.segments);
	this.segmentsRow = new NumberRow(this.form);
	this.segmentsRow.size.set(0, 18);

	this.widthSegments = this.segmentsRow.addValue("X");
	this.widthSegments.setStep(1);
	this.widthSegments.setOnChange(updateGeometry);

	this.heightSegments = this.segmentsRow.addValue("Y");
	this.heightSegments.setStep(1);
	this.heightSegments.setOnChange(updateGeometry);

	this.depthSegments = this.segmentsRow.addValue("Z");
	this.depthSegments.setStep(1);
	this.depthSegments.setOnChange(updateGeometry);

	this.form.add(this.segmentsRow);
	this.form.nextRow();

	// Buffer
	this.buffer = new CheckBox(this.form);
	this.form.addText(Locale.buffered);
	this.buffer.size.set(18, 18);
	this.buffer.setOnChange(updateGeometry);
	this.form.add(this.buffer);
	this.form.nextRow();
}

BoxGeometryForm.prototype.updateGeometry = function()
{
	var GeometryConstructor = this.buffer.getValue() ? BoxBufferGeometry : BoxGeometry;
	var geometry = new GeometryConstructor(this.width.getValue(), this.height.getValue(), this.depth.getValue(), this.widthSegments.getValue(), this.heightSegments.getValue(), this.depthSegments.getValue());

	this.object.geometry.dispose();
	Editor.addAction(new ChangeAction(this.object, "geometry", geometry));
};


BoxGeometryForm.prototype.updateValues = function()
{
	this.width.setValue(this.object.geometry.parameters.width || 1);
	this.height.setValue(this.object.geometry.parameters.height || 1);
	this.depth.setValue(this.object.geometry.parameters.depth || 1);
	this.widthSegments.setValue(this.object.geometry.parameters.widthSegments || 1);
	this.heightSegments.setValue(this.object.geometry.parameters.heightSegments || 1);
	this.depthSegments.setValue(this.object.geometry.parameters.depthSegments || 1);
	this.buffer.setValue(this.object.geometry instanceof BufferGeometry);
};
export {BoxGeometryForm};