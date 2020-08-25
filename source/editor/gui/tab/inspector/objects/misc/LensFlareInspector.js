import {ObjectInspector} from "../ObjectInspector.js";

function LensFlareInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

}

LensFlareInspector.prototype = Object.create(ObjectInspector.prototype);

export {LensFlareInspector};
