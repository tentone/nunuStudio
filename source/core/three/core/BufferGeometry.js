"use strict";

THREE.BufferGeometry.prototype.toJSON = function()
{
	var data =
	{
		metadata:
		{
			version:  Nunu.VERSION,
			type: "BufferGeometry"
		}
	};
	
	data.uuid = this.uuid;
	data.type = this.type;
	data.name = this.name;

	if(this.userData !== undefined)
	{
		data.userData = this.userData;
	}

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
		data.data.index =
		{
			type: index.array.constructor.name,
			array: Array.prototype.slice.call(index.array)
		};
	}

	var attributes = this.attributes;
	for(var key in attributes)
	{
		var attribute = attributes[key];
		var attributeData = null;

		if(attribute.toJSON !== undefined)
		{
			attributeData = attribute.toJSON();
			if(attribute.name !== "")
			{
				attributeData.name = attribute.name;
			}
		}
		else
		{
			attributeData =
			{
				name: attribute.name,
				itemSize: attribute.itemSize,
				type: attribute.array.constructor.name,
				array: Array.prototype.slice.call(attribute.array),
				normalized: attribute.normalized
			};
		}
		

		data.data.attributes[key] = attributeData;
		
	}

	var morphAttributes = {};
	var hasMorphAttributes = false;

	for(var key in morphAttributes)
	{
		var attributeArray = this.morphAttributes[key];
		var array = [];

		for(var i = 0; i < attributeArray.length; i ++)
		{
			var attribute = attributeArray[i];
			var attributeData = null;

			if(attribute.toJSON !== undefined)
			{
				attributeData = attribute.toJSON();
				if(attribute.name !== "")
				{
					attributeData.name = attribute.name;
				}
			}
			else
			{
				attributeData =
				{
					name: attribute.name,
					itemSize: attribute.itemSize,
					type: attribute.array.constructor.name,
					array: Array.prototype.slice.call(attribute.array),
					normalized: attribute.normalized
				};
			}

			array.push(attributeData);
		}

		if(array.length > 0)
		{
			morphAttributes[key] = array;
			hasMorphAttributes = true;
		}
	}

	if(hasMorphAttributes)
	{
		data.data.morphAttributes = morphAttributes;
		data.data.morphTargetsRelative = this.morphTargetsRelative;
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
