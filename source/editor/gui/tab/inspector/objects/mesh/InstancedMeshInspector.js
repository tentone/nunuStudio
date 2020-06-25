import {Mesh} from "../../../../../../core/objects/mesh/Mesh.js";
import {InstancedMesh} from "../../../../../../core/objects/mesh/InstancedMesh.js";
import {ChangeAction} from "../../../../../history/action/ChangeAction.js";
import {Action} from "../../../../../history/action/Action.js";
import {MeshInspector} from "./MeshInspector.js";
import {Inspector} from "../../Inspector.js";
import {Editor} from "../../../../../Editor.js";
import {Text} from "../../../../../components/Text.js";
import {NumberBox} from "../../../../../components/input/NumberBox.js";

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