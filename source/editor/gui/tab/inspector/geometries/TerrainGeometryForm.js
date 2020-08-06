import {Locale} from "../../../../locale/LocaleManager.js";
import {TerrainBufferGeometry} from "../../../../../core/geometries/TerrainBufferGeometry.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../Editor.js";
import {NumberRow} from "../../../../components/input/NumberRow.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {ImageChooser} from "../../../../components/input/ImageChooser.js";

function TerrainGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText(Locale.plane);
	this.form.nextRow();
	
	// Scale
	this.form.addText(Locale.scale);
	this.scale = new NumberBox(this.form);
	this.scale.size.set(60, 18);
	this.scale.setStep(0.1);
	this.scale.setRange(0, Number.MAX_SAFE_INTEGER);
	this.scale.setOnChange(updateGeometry);
	this.form.add(this.scale);
	this.form.nextRow();

	// Image
	this.form.addText(Locale.image);
	this.image = new ImageChooser(this.form);
	this.image.size.set(0, 100);
	this.image.setOnChange(updateGeometry);
	this.form.add(this.image);
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

	this.form.add(this.segmentsRow);
	this.form.nextRow();
}

TerrainGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();
	var geometry = new TerrainBufferGeometry(this.width.getValue(), this.height.getValue(), this.widthSegments.getValue(), this.heightSegments.getValue(), this.scale.getValue(), this.image.getValue());
	Editor.addAction(new ChangeAction(this.object, "geometry", geometry));
};

TerrainGeometryForm.prototype.updateValues = function()
{
	this.width.setValue(this.object.geometry.parameters.width || 1);
	this.height.setValue(this.object.geometry.parameters.height || 1);
	this.widthSegments.setValue(this.object.geometry.parameters.widthSegments || 1);
	this.heightSegments.setValue(this.object.geometry.parameters.heightSegments || 1);
	this.scale.setValue(this.object.geometry.parameters.scale);
	this.image.setValue(this.object.geometry.image);
};
export {TerrainGeometryForm};