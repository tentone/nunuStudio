"use strict";

function GeometryInspector(parent, object)
{
	ResourceInspector.call(this, parent, object);

	var self = this;

	this.form.addText(Locale.geometry);

}

GeometryInspector.prototype = Object.create(ResourceInspector.prototype);

GeometryInspector.prototype.updateInspector = function()
{
	ResourceInspector.prototype.updateInspector.call(this);

	console.log(this.object);
};