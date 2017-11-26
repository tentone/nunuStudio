"use strict";

/**
 * File resource can be used to store data or code.
 *
 * File data can be used to store information to be consumend by the application or runtime code that can be imported by scripts.
 *
 * @class File
 * @constructor
 * @extends {Resource}
 * @module Resources
 */
function File()
{
	Resource.call(this, "File", "File");

	this.format = "string";
	this.encoding = "txt";
	this.data = "";
}

File.prototype = Object.create(Resource.prototype);

/**
 * Serialize File resource data to json.
 *
 * @method toJSON
 * @param {meta} meta
 * @return {Object} data
 */
File.prototype.toJSON = function(meta)
{
	var data = Resource.prototype.toJSON.call(this, meta);

	data.encoding = this.encoding;
	data.data = this.data;
	data.format = this.format;

	return data;
};
