"use strict"

/**
 * Folder resource stores another resources inside.
 *
 * @class Folder
 * @extends {Resource}
 * @constructor
 * @module Resources
 */
function Folder(obj)
{
	Resource.call(this, "folder", "Folder");

	this.data = [];
}

Folder.prototype = Object.create(Resource.prototype);

Folder.prototype.toJSON = function(meta)
{
	var data = Resource.prototype.toJSON.call(this, meta);
	
	var data = [];
	for(var i = 0; i < this.data.length; i++)
	{
		data.push(this.data.toJSON(meta));
	}
	data.data = data;

	return data;
};
