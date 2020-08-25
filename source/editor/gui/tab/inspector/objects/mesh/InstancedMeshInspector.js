import {Locale} from "../../../../../locale/LocaleManager.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {Editor} from "../../../../../Editor.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";
import {MeshInspector} from "./MeshInspector.js";

function InstancedMeshInspector(parent, object)
{
	MeshInspector.call(this, parent, object);

	var self = this;
	
	this.form.addText(Locale.count);
	this.count = new NumberBox(this.form);
	this.count.size.set(0, 18);
	this.count.setRange(0, 1000);
	this.count.setStep(1);
	this.count.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "count", self.count.getValue()));
	});
	this.form.add(this.count);
	this.form.nextRow();

}

InstancedMeshInspector.prototype = Object.create(MeshInspector.prototype);

InstancedMeshInspector.prototype.updateInspector = function()
{
	MeshInspector.prototype.updateInspector.call(this);

	this.count.setValue(this.object.count);
};

export {InstancedMeshInspector};
