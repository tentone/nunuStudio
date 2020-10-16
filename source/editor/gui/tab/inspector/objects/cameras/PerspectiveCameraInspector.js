import {Locale} from "../../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {ViewportFormSnippet} from "../../../../form-snippet/ViewportFormSnippet.js";
import {Editor} from "../../../../../Editor.js";
import {Slider} from "../../../../../components/input/Slider.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";

function PerspectiveCameraInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Fov
	this.form.addText(Locale.fov);
	this.fov = new Slider(this.form);
	this.fov.size.set(160, 18);
	this.fov.setRange(30, 160);
	this.fov.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "fov", self.fov.getValue()));
		self.object.updateProjectionMatrix();
	});
	this.form.add(this.fov);
	this.form.nextRow();

	
	// Fov
	this.form.addText(Locale.fov);
	this.fov = new Slider(this.form);
	this.fov.size.set(160, 18);
	this.fov.setRange(30, 160);
	this.fov.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "fov", self.fov.getValue()));
		self.object.updateProjectionMatrix();
	});
	this.form.add(this.fov);
	this.form.nextRow();
	
	// Film Gauge
	this.form.addText(Locale.filmGauge);
	this.filmGauge = new Slider(this.form);
	this.filmGauge.size.set(160, 18);
	this.filmGauge.setRange(30, 160);
	this.filmGauge.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "filmGauge", self.filmGauge.getValue()));
		self.object.updateProjectionMatrix();
	});
	this.form.add(this.filmGauge);
	this.form.nextRow();

	// Film Offset
	this.form.addText(Locale.filmOffset);
	this.filmOffset = new Slider(this.form);
	this.filmOffset.size.set(160, 18);
	this.filmOffset.setRange(30, 160);
	this.filmOffset.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "filmOffset", self.filmOffset.getValue()));
		self.object.updateProjectionMatrix();
	});
	this.form.add(this.filmOffset);
	this.form.nextRow();

	// Zoom
	this.form.addText(Locale.zoom);
	this.zoom = new Slider(this.form);
	this.zoom.size.set(160, 18);
	this.zoom.setRange(30, 160);
	this.zoom.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "zoom", self.zoom.getValue()));
		self.object.updateProjectionMatrix();
	});
	this.form.add(this.zoom);
	this.form.nextRow();

	// Focus
	this.form.addText(Locale.focus);
	this.focus = new Slider(this.form);
	this.focus.size.set(160, 18);
	this.focus.setRange(30, 160);
	this.focus.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "focus", self.focus.getValue()));
		self.object.updateProjectionMatrix();
	});
	this.form.add(this.focus);
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
	this.clearColor = new CheckBox(this.form);
	this.form.addText(Locale.clearColor);
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

PerspectiveCameraInspector.prototype = Object.create(ObjectInspector.prototype);

PerspectiveCameraInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);

	this.fov.setValue(this.object.fov);
	this.use.setValue(this.object.getScene().isCameraActive(this.object));
	this.near.setValue(this.object.near);
	this.far.setValue(this.object.far);
	this.order.setValue(this.object.order);
	this.clearColor.setValue(this.object.clearColor);
	this.clearDepth.setValue(this.object.clearDepth);
	this.clearStencil.setValue(this.object.clearStencil);
	this.viewport.attach(this.object.viewport);
};

export {PerspectiveCameraInspector};
