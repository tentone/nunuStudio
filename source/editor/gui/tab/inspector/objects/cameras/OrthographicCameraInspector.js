import {Locale} from "../../../../../locale/LocaleManager.js";
import {OrthographicCamera} from "../../../../../../core/objects/cameras/OrthographicCamera.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {ViewportFormSnippet} from "../../../../form-snippet/ViewportFormSnippet.js";
import {Editor} from "../../../../../Editor.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../../components/input/DropdownList.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";

function OrthographicCameraInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Size
	this.form.addText(Locale.size);
	this.sizeBox = new NumberBox(this.form);
	this.sizeBox.size.set(80, 18);
	this.sizeBox.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "size", self.sizeBox.getValue()));
		self.object.updateProjectionMatrix();
	});
	this.form.add(this.sizeBox);
	this.form.nextRow();

	// Camera resize Mode
	this.form.addText("Resize Mode");
	this.mode = new DropdownList(this.form);
	this.mode.size.set(130, 18);
	this.mode.addValue(Locale.horizontal, OrthographicCamera.RESIZE_HORIZONTAL);
	this.mode.addValue(Locale.vertical, OrthographicCamera.RESIZE_VERTICAL);
	this.mode.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "mode", self.mode.getSelectedIndex()));
	});
	this.form.add(this.mode);
	this.form.nextRow();

	// Camera used
	this.use = new CheckBox(this.form);
	this.form.addText(Locale.useCamera);
	this.use.size.set(18, 18);
	this.use.setOnChange(function()
	{
		var scene = self.object.getScene();
		if (self.use.getValue() && scene !== null)
		{
			scene.addCamera(self.object);
		}
		else
		{
			scene.removeCamera(self.object);
		}
	});
	this.form.add(this.use);
	this.form.nextRow();
	
	// Distance
	this.form.addText(Locale.clippingPlanes);
	this.form.nextRow();

	// Near
	this.form.addText(Locale.near);
	this.near = new NumberBox(this.form);
	this.near.size.set(60, 18);
	this.near.setStep(0.1);
	this.near.setRange(0, Number.MAX_SAFE_INTEGER);
	this.near.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "near", self.near.getValue()));
	});
	this.form.add(this.near);
	this.form.nextRow();
	
	// Far
	this.form.addText(Locale.near);
	this.far = new NumberBox(this.form);
	this.far.size.set(80, 18);
	this.far.setRange(0, Number.MAX_SAFE_INTEGER);
	this.far.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "far", self.far.getValue()));
	});
	this.form.add(this.far);
	this.form.nextRow();

	// Viewport
	this.form.addText(Locale.viewport);
	this.form.nextRow();
	this.viewport = new ViewportFormSnippet(this.form, object);

	// Order
	this.form.addText(Locale.renderOrder).setAltText(Locale.hintRenderOrder);
	this.order = new NumberBox(this.form);
	this.order.size.set(80, 18);
	this.order.setRange(0, Number.MAX_SAFE_INTEGER);
	this.order.setStep(1);
	this.order.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "order", self.order.getValue()));

		var scene = self.object.getScene();
		scene.updateCameraOrder();
	});
	this.form.add(this.order);
	this.form.nextRow();

	// Clear color
	this.form.addText(Locale.clearColor);
	this.clearColor = new CheckBox(this.form);
	this.clearColor.size.set(18, 18);
	this.clearColor.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "clearColor", self.clearColor.getValue()));
	});
	this.form.add(this.clearColor);
	this.form.nextRow();

	// Clear depth
	this.clearDepth = new CheckBox(this.form);
	this.form.addText(Locale.clearDepth);
	this.clearDepth.size.set(18, 18);
	this.clearDepth.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "clearDepth", self.clearDepth.getValue()));
	});
	this.form.add(this.clearDepth);
	this.form.nextRow();

	// Clear stencil
	this.clearStencil = new CheckBox(this.form);
	this.form.addText(Locale.clearStencil);
	this.clearStencil.size.set(18, 18);
	this.clearStencil.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "clearStencil", self.clearStencil.getValue()));
	});
	this.form.add(this.clearStencil);
	this.form.nextRow();
}

OrthographicCameraInspector.prototype = Object.create(ObjectInspector.prototype);

OrthographicCameraInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
	
	this.sizeBox.setValue(this.object.size);
	this.mode.setSelectedIndex(this.object.mode);
	this.use.setValue(this.object.getScene().cameras.indexOf(this.object) !== -1);
	this.near.setValue(this.object.near);
	this.far.setValue(this.object.far);
	this.order.setValue(this.object.order);
	this.clearColor.setValue(this.object.clearColor);
	this.clearDepth.setValue(this.object.clearDepth);
	this.clearStencil.setValue(this.object.clearStencil);
	this.viewport.attach(this.object.viewport);
};

export {OrthographicCameraInspector};
