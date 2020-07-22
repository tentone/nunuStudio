import {Mesh} from "../../../../../../core/objects/mesh/Mesh.js";
import {DrawableInspector} from "../DrawableInspector.js";
import {Inspector} from "../../Inspector.js";
import {GeometryForm} from "../../geometries/GeometryForm.js";
import {Form} from "../../../../../components/Form.js";

function MeshInspector(parent, object)
{
	DrawableInspector.call(this, parent, object);

	this.geometry = GeometryForm.create(this.form, this.object);
}

MeshInspector.prototype = Object.create(DrawableInspector.prototype);

MeshInspector.prototype.updateInspector = function()
{
	DrawableInspector.prototype.updateInspector.call(this);
	
	if(this.geometry !== null)
	{
		try
		{
			this.geometry.updateValues();
		}
		catch(e)
		{
			this.geometry.destroy();
			this.geometry = GeometryForm.create(this.form, this.object);
		}
	}
};

export {MeshInspector};