"use strict";

function CompressedGeometry()
{
	THREE.BufferGeometry.call(this);

	this.type = "CompressedGeometry";
}

CompressedGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);

CompressedGeometry.prototype.toJSON = function()
{
	var data = {};

	data.uuid = this.uuid;
	data.type = this.type;
	data.name = this.name;

	if(this.parameters !== undefined)
	{
		var parameters = this.parameters;

		for(var key in parameters)
		{
			if(parameters[key] !== undefined)
			{
				data[key] = parameters[key];
			}
		}

		return data;
	}

	data.data = {attributes: {}};

	var index = this.index;
	if(index !== null)
	{
		var array = Array.prototype.slice.call(index.array);
		data.data.index =
		{
			type: index.array.constructor.name,
			array: array
		};
	}

	var attributes = this.attributes;
	for(var key in attributes)
	{
		var attribute = attributes[key];
		var array = Array.prototype.slice.call(attribute.array);

		data.data.attributes[key] = {
			itemSize: attribute.itemSize,
			type: attribute.array.constructor.name,
			array: array,
			normalized: attribute.normalized
		};
	}

	var groups = this.groups;
	if(groups.length > 0)
	{
		data.data.groups = JSON.parse(JSON.stringify(groups));
	}

	var boundingSphere = this.boundingSphere;
	if(boundingSphere !== null)
	{
		data.data.boundingSphere =
		{
			center: boundingSphere.center.toArray(),
			radius: boundingSphere.radius
		};
	}

	return data;
};
