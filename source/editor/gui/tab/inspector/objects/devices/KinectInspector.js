import {Model} from "../../../../../../core/resources/Model.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {Action} from "../../../../../history/action/Action.js";
import {ObjectInspector} from "../ObjectInspector.js";
import {Inspector} from "../../Inspector.js";
import {Editor} from "../../../../../Editor.js";
import {Text} from "../../../../../components/Text.js";
import {CheckBox} from "../../../../../components/input/CheckBox.js";

function KinectInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;

	// Debug model
	this.debugModel = new CheckBox(this.form);
	this.form.addText("Debug model");
	this.debugModel.size.set(18, 18);
	this.debugModel.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "debugModel", self.debugModel.getValue()));
	});
	this.form.add(this.debugModel);
}

KinectInspector.prototype = Object.create(ObjectInspector.prototype);

KinectInspector.prototype.updateInspector = function()
{
	ObjectInspector.prototype.updateInspector.call(this);
	
	this.debugModel.setValue(this.object.debugModel);
};

export {KinectInspector};