"use strict";

/**
 * Resource class is used to represent resources.
 * 
 * Resources store data that is used by objects.
 * 
 * @class Resource
 * @module Resources
 * @constructor
 */

/**
 * Resource name.
 * 
 * Not required to be unique.
 * 
 * @property name
 * @type {String}
 */
/**
 * UUID unique identifier.
 * 
 * @property uuid
 * @type {String}
 */
/**
 * Resource type. Used to identify the type of the resource, usefull for serialization.
 * 
 * @property type
 * @type {String}
 */
/**
 * Data format (base64, arraybuffer, blob, url, ...).
 * 
 * Indicates the format used to store the data.
 * 
 * @property format
 * @type {Object}
 */
/**
 * Data encoding (mp3, jpg, mp4, ...).
 * 
 * Indicates how the data is encoded.
 * 
 * @property encoding
 * @type {String, ArrayBuffer, ...}
 */
/**
 * Resource data.
 * 
 * @property data
 * @type {Object}
 */
function Resource(name, type)
{
	this.name = name;
	this.uuid = THREE.Math.generateUUID();
	this.type = type;

	this.format = "";
	this.encoding = ""
	this.data = null;
}

/**
 * Export resource data to file.
 *
 * @method export
 * @param {String} fname File name or file path.
 */
Resource.prototype.export = function(fname)
{
	if(this.format === "base64")
	{
		FileSystem.writeFileBase64(fname, this.data);
	}
	else if(this.format === "arraybuffer")
	{
		FileSystem.writeFileArrayBuffer(fname, this.arraybuffer !== undefined ? this.arraybuffer : this.data);
	}
	else if(this.format === "string")
	{
		FileSystem.writeFile(fname, this.data);
	}
	else if(this.format === "url")
	{
		FileSystem.writeFileArrayBuffer(fname, FileSystem.readFileArrayBuffer(this.data));
	}
};

/**
 * Serialize resource to json.
 *
 * Only serializes name, uuid and type.
 *
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
Resource.prototype.toJSON = function(meta)
{
	var data = {};
	
	data.name = this.name;
	data.uuid = this.uuid;
	data.type = this.type;

	return data;
};
