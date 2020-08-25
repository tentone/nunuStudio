import {Math} from "three";
import {FileSystem} from "../FileSystem.js";

/**
 * Resource class is used to represent resources.
 * 
 * Resources store data that is used by objects.
 * 
 * @class Resource
 * @module Resources
 */
function Resource(name, type)
{
	/**
	 * Resource name.
	 * 
	 * Not required to be unique.
	 * 
	 * @property name
	 * @type {string}
	 */
	this.name = name;

	/**
	 * UUID unique identifier.
	 * 
	 * @property uuid
	 * @type {string}
	 */
	this.uuid = Math.generateUUID();

	/**
	 * Resource type. Used to identify the type of the resource, usefull for serialization.
	 * 
	 * @property type
	 * @type {string}
	 */
	this.type = type;

	/**
	 * Data format (base64, arraybuffer, blob, url, ...).
	 * 
	 * Indicates the format used to store the data.
	 * 
	 * @property format
	 * @type {Object}
	 */
	this.format = "";

	/**
	 * Data encoding (mp3, jpg, mp4, ...).
	 * 
	 * Indicates how the data is encoded.
	 * 
	 * @property encoding
	 * @type {String, ArrayBuffer, ...}
	 */
	this.encoding = "";

	/**
	 * Resource data.
	 * 
	 * @property data
	 * @type {Object}
	 */
	this.data = null;
}

/**
 * Export resource data to file.
 *
 * @method export
 * @param {string} fname File name or file path.
 */
Resource.prototype.export = function(fname)
{
	if (this.format === "base64")
	{
		FileSystem.writeFileBase64(fname, this.data);
	}
	else if (this.format === "arraybuffer")
	{
		FileSystem.writeFileArrayBuffer(fname, this.arraybuffer !== undefined ? this.arraybuffer : this.data);
	}
	else if (this.format === "string")
	{
		FileSystem.writeFile(fname, this.data);
	}
	else if (this.format === "json")
	{
		FileSystem.writeFile(fname, JSON.stringify(this.data));
	}
	else if (this.format === "url")
	{
		FileSystem.writeFileArrayBuffer(fname, FileSystem.readFileArrayBuffer(this.data));
	}
};

/**
 * Dispose resource, should be called to free memory after its no longer required.
 *
 * @method dispose
 */
Resource.prototype.dispose = function() {};

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
export {Resource};
