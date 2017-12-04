"use strict";

/**
 * Text file resource can be used to store data or code.
 *
 * Text file data can be used to store information to be consumend by the application or runtime code that can be imported by scripts.
 *
 * @class DataFile
 * @constructor
 * @extends {Resource}
 * @module Resources
 */
function DataFile(data, encoding)
{
	Resource.call(this, "text", "DataFile");

	this.format = "string";
	this.encoding = (encoding !== undefined) ? encoding : "txt";
	this.data = (data !== undefined) ? data : "";
}

DataFile.prototype = Object.create(Resource.prototype);

/**
 * Serialize File resource data to json.
 *
 * @method toJSON
 * @param {meta} meta
 * @return {Object} data
 */
DataFile.prototype.toJSON = function(meta)
{
	if(meta.resources[this.uuid] !== undefined)
	{
		return meta.resources[this.uuid];
	}

	var data = Resource.prototype.toJSON.call(this, meta);
	
	data.encoding = this.encoding;
	data.data = this.data;
	data.format = this.format;

	meta.resources[this.uuid] = data;

	return data;
};
