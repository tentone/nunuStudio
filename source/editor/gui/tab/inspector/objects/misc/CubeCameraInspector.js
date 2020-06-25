import {CubeCamera} from "../../../../../../core/objects/cameras/CubeCamera.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {Action} from "../../../../../history/action/Action.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {Inspector} from "../../Inspector.js";
import {Interface} from "../../../../Interface.js";
import {Editor} from "../../../../../Editor.js";
import {Text} from "../../../../../components/Text.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../../components/input/DropdownList.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";

function CubeCameraInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Auto update
	this.form.addText(Locale.autoUpdate);
	this.autoUpdate = new CheckBox(this.form);
	this.autoUpdate.size.set(18, 18);
	this.autoUpdate.position.set(5, 85);
	this.autoUpdate.updateInterface();
	this.autoUpdate.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "autoUpdate", self.autoUpdate.getValue()));
	});
	this.form.add(this.autoUpdate);
	this.form.nextRow();

	// Resolution
	this.form.addText(Locale.resolution);
	this.resolution = new DropdownList(this.form);
	this.resolution.size.set(60, 18);
	this.resolution.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "resolution", self.resolution.getValue()));
	});
	this.form.add(this.resolution);
	this.form.nextRow();
	
	for(var i = 4; i < 13; i++)
	{
		var size = Math.pow(2, i);
		this.resolution.addValue(size.toString(), size);
	}

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
}

CubeCameraInspector.prototype = Object.create(ObjectInspector.prototype);

CubeCameraInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
	
	this.autoUpdate.setValue(this.object.autoUpdate);
	this.resolution.setValue(this.object.resolution);
	this.near.setValue(this.object.near);
	this.far.setValue(this.object.far);
};

export {CubeCameraInspector};