import {LensFlare} from "../../../../../../../core/objects/misc/LensFlare.js";
import {ObjectInspector} from "../../ObjectInspector.js";
import {Inspector} from "../../../Inspector.js";

function LensFlareInspector(parent, object)
{
	ObjectInspector.call(this, parent, object);

	var self = this;
}

LensFlareInspector.prototype = Object.create(ObjectInspector.prototype);

export {LensFlareInspector};