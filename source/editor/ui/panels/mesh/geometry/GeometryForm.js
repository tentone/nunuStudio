"use strict";

function GeometryForm(parent)
{
	Form.call(this, parent);

	//Attached geometry
	this.geometry = null;

	//Self pointer
	var self = this;

	//Update form
	this.updateInterface();
}

//Super prototypes
GeometryForm.prototype = Object.create(Form.prototype);

//Geometry geometry properties
GeometryForm.prototype.updateValues = function(){}

//Attach geometry
GeometryForm.prototype.attach = function(geometry)
{
	this.geometry = geometry;
}
