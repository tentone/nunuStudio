//Object tools contains some object managing helpers
function ObjectUtils(){}

//Check if object is child of another object
ObjectUtils.isChildOf = function(parent, child)
{
	
}

//Return object absolute position (not relative to parent)
ObjectUtils.objectAbsolutePosition = function(obj)
{
	if(obj.parent !== null &&  obj.parent !== undefined)
	{
		var parent = obj.parent;
		var scale = new THREE.Vector3(1, 1, 1);
		
		while(parent !== null)
		{
			scale.multiply(parent.scale);
			parent = parent.parent;
		}

		var position = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
		position.multiply(scale);
		position.add(ObjectUtils.objectAbsolutePosition(obj.parent));

		return position;
	}

	return obj.position;
}

//Return object absolute scale (not relative to parent)
ObjectUtils.objectAbsoluteScale = function(obj)
{
	if(obj.parent !== null &&  obj.parent !== undefined)
	{
		var scale = new THREE.Vector3(obj.scale.x, obj.scale.y, obj.scale.z);
		scale.multiply(ObjectUtils.objectAbsoluteScale(obj.parent));

		return scale;
	}

	return obj.scale;
}
