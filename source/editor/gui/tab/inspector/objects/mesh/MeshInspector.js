import {DrawableInspector} from "../DrawableInspector.js";
import {GeometryForm} from "../../geometries/GeometryForm.js";

class MeshInspector extends DrawableInspector {
	constructor(parent, object) {
	super(parent, object);

	this.geometry = GeometryForm.create(this.form, this.object);
	}

	updateInspector() {
	super.updateInspector();
	
	if (this.geometry !== null)
	{
		try
		{
			this.geometry.updateValues();
		}
		catch (e)
		{
			this.geometry.destroy();
			this.geometry = GeometryForm.create(this.form, this.object);
		}
	}
	}

}

export {MeshInspector};
