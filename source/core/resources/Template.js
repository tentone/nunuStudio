"use strict";

/**
 * Template resource stores object template that can be used to create multiple objects of the same type.
 *
 * @class Template
 * @extends {Resource}
 * @constructor
 * @module Resources
 */
function Template(obj)
{
	Resource.call(this, "template", "Template");

	this.data = obj;
	this.format = "json";
	this.encoding = "json";
}

Template.prototype = Object.create(Resource.prototype);