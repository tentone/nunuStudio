"use strict";

/**
 * Text resource can be used to store text data or code.
 *
 * Text data can be used to store information to be consumend by the application or runtime code that can be imported by scripts.
 */
function Text()
{
	Resource.call(this, "text", "Text");

	this.encoding = "text";
	this.format = "string";
	this.data = "";
}

Text.prototype = Object.create(Resource.prototype);

/**
 * Serialize text resource data to json.
 *
 * @method toJSON
 * @param {meta} meta
 * @return {Object} data
 */
Text.prototype.toJSON = function(meta)
{
	var data = Resource.prototype.toJSON.call(this, meta);

	data.encoding = this.encoding;
	data.data = this.data;
	data.format = this.format;

	return data;
};
