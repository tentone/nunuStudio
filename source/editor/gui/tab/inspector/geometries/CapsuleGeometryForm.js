import {CapsuleBufferGeometry} from "../../../../../../core/geometries/CapsuleBufferGeometry.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {Action} from "../../../../../history/action/Action.js";
import {GeometryForm} from "../GeometryForm.js";
import {Editor} from "../../../../../Editor.js";
import {Text} from "../../../../../components/Text.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";
import {Form} from "../../../../../components/Form.js";

function CapsuleGeometryForm(form, object)
{
	this.form = form;
	this.object = object;
	
	var self = this;

	var updateGeometry = function()
	{
		self.updateGeometry();
	};

	this.form.addText(Locale.capsule);
	this.form.nextRow();

	// Radius
	this.form.addText(Locale.radius);
	this.form.nextRow();
	
	this.form.addText(Locale.top);
	this.radiusTop = new NumberBox(this.form);
	this.radiusTop.size.set(0, 18);
	this.radiusTop.setStep(0.1);
	this.radiusTop.setOnChange(updateGeometry);
	this.form.add(this.radiusTop);
	this.form.nextRow();

	this.form.addText(Locale.bottom);
	this.radiusBottom = new NumberBox(this.form);
	this.radiusBottom.size.set(0, 18);
	this.radiusBottom.setStep(0.1);
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

	// Theta start
	this.form.addText(Locale.thetaStart);
	this.thetaStart = new NumberBox(this.form);
	this.thetaStart.size.set(0, 18);
	this.thetaStart.setStep(0.01);
	this.thetaStart.setOnChange(updateGeometry);
	this.form.add(this.thetaStart);
	this.form.nextRow();

	// Theta length
	this.form.addText(Locale.thetaLength);
	this.thetaLength = new NumberBox(this.form);
	this.thetaLength.size.set(0, 18);
	this.thetaLength.setStep(0.01);
	this.thetaLength.setOnChange(updateGeometry);
	this.form.add(this.thetaLength);
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

	this.form.addText(Locale.top);
	this.capsTopSegments = new NumberBox(this.form);
	this.capsTopSegments.size.set(0, 18);
	this.capsTopSegments.setRange(1, Number.MAX_SAFE_INTEGER);
	this.capsTopSegments.setStep(1);
	this.capsTopSegments.setOnChange(updateGeometry);
	this.form.add(this.capsTopSegments);
	this.form.nextRow();

	this.form.addText(Locale.bottom);
	this.capsBottomSegments = new NumberBox(this.form);
	this.capsBottomSegments.size.set(0, 18);
	this.capsBottomSegments.setRange(1, Number.MAX_SAFE_INTEGER);
	this.capsBottomSegments.setStep(1);
	this.capsBottomSegments.setOnChange(updateGeometry);
	this.form.add(this.capsBottomSegments);
	this.form.nextRow();
}

CapsuleGeometryForm.prototype.updateGeometry = function()
{
	this.object.geometry.dispose();

	var geometry = new CapsuleBufferGeometry(this.radiusTop.getValue(), this.radiusBottom.getValue(), this.height.getValue(),
									this.radialSegments.getValue(), this.heightSegments.getValue(), this.capsTopSegments.getValue(),
									this.capsBottomSegments.getValue(), this.thetaStart.getValue(), this.thetaLength.getValue());

	Editor.addAction(new ChangeAction(this.object, "geometry", geometry));
};

CapsuleGeometryForm.prototype.updateValues = function()
{
	this.radiusTop.setValue(this.object.geometry.parameters.radiusTop || 0.5);
	this.radiusBottom.setValue(this.object.geometry.parameters.radiusBottom || 0.5);
	this.height.setValue(this.object.geometry.parameters.height || 1.0);
	this.radialSegments.setValue(this.object.geometry.parameters.radialSegments || 32);
	this.heightSegments.setValue(this.object.geometry.parameters.heightSegments || 1);
	this.radialSegments.setValue(this.object.geometry.parameters.radialSegments || 32);
	this.heightSegments.setValue(this.object.geometry.parameters.heightSegments || 1);
	this.capsTopSegments.setValue(this.object.geometry.parameters.capsTopSegments || 8);
	this.capsBottomSegments.setValue(this.object.geometry.parameters.capsBottomSegments || 8);
	this.thetaStart.setValue(this.object.geometry.parameters.thetaStart || 0);
	this.thetaLength.setValue(this.object.geometry.parameters.thetaLength || Math.PI * 2);
};
export {CapsuleGeometryForm};