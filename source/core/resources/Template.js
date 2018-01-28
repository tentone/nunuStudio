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

Template.prototype.createObject = function()
{
	var loader = new ObjectLoader();
	var object = loader.parse(this.data);
	object.uuid = THREE.Math.generateUUID();
	return object;
};

Template.prototype.toJSON = function(meta)
{
	var data = Resource.prototype.toJSON.call(this, meta);
	
	data.encoding = this.encoding;
	data.format = this.format;
	data.data = JSON.stringify(this.data);

	return data;
};
