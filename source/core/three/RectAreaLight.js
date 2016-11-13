"use strict";

THREE.RectAreaLight.prototype.toJSON = function(meta)
{
	var data = Light.prototype.toJSON.call(this, meta);

	data.object.width = this.width;
	data.object.height = this.height;

	return data;
}
