"use strict";

/**
 * Text file resource can be used to store data or code.
 *
 * Text file data can be used to store information to be consumend by the application or runtime code that can be imported by scripts.
 *
 * @class TextFile
 * @constructor
 * @extends {Resource}
 * @module Resources
 */
function TextFile()
{
	Resource.call(this, "text", "TextFile");

	this.format = "string";
	this.encoding = "txt";
	this.data = "";
}

TextFile.prototype = Object.create(Resource.prototype);

/**
 * Serialize File resource data to json.
 *
 * @method toJSON
 * @param {meta} meta
 * @return {Object} data
 */
TextFile.prototype.toJSON = function(meta)
{
	var data = Resource.prototype.toJSON.call(this, meta);

	data.encoding = this.encoding;
	data.data = this.data;
	data.format = this.format;

	return data;
};
