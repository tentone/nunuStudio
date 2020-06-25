import {GeometryLoader} from "../../../loaders/GeometryLoader.js";
import {InstancedBufferAttribute, BufferAttribute, InterleavedBuffer, InterleavedBufferAttribute, BufferGeometryLoader, Vector3, Sphere} from "three";
var TYPED_ARRAYS = {
	Int8Array: Int8Array,
	Uint8Array: Uint8Array,
	Uint8ClampedArray: Uint8ClampedArray,
	Int16Array: Int16Array,
	Uint16Array: Uint16Array,
	Int32Array: Int32Array,
	Uint32Array: Uint32Array,
	Float32Array: Float32Array,
	Float64Array: Float64Array
};
var parseBufferAttribute = function(json)
{
	// Legacy format
	if (json.array !== undefined)
	{
		var typedArray = new TYPED_ARRAYS[json.type](json.array);
		var contructor = json.isInstancedBufferAttribute ? InstancedBufferAttribute : BufferAttribute;
		var bufferAttribute = new contructor(typedArray, json.itemSize, json.normalized);

		if (json.name !== undefined) bufferAttribute.name = json.name;

		return bufferAttribute;
	}

	var bufferAttribute;

	if(json.type === "BufferAttribute")
	{
		var typedArray = new TYPED_ARRAYS[json.typedArray.type](json.typedArray.array);
		bufferAttribute = new BufferAttribute(typedArray, json.itemSize, json.normalized);
	}
	else if(json.type === "InstancedBufferAttribute")
	{
		var typedArray = new TYPED_ARRAYS[json.typedArray.type](json.typedArray.array);
		bufferAttribute = new InstancedBufferAttribute(typedArray, json.itemSize, json.normalized, json.meshPerAttribute);
	}
	else if(json.type === "InterleavedBufferAttribute")
	{
		// Interleaved buffer
		var typedArray = new TYPED_ARRAYS[json.data.typedArray.type](json.data.typedArray.array);
		var interleavedBuffer = new InterleavedBuffer(typedArray, json.data.stride);
		interleavedBuffer.setUsage(json.data.usage);
		interleavedBuffer.count = json.data.count;
		
		bufferAttribute = new InterleavedBufferAttribute(interleavedBuffer, json.itemSize, json.offset, json.normalized);
	}

	if (json.name !== undefined) bufferAttribute.name = json.name;

	return bufferAttribute;
};

BufferGeometryLoader.prototype.parse = function(json)
{
	var geometry = json.isInstancedBufferGeometry ? new InstancedBufferGeometry() : new BufferGeometry();
	var index = json.data.index;

	if (index !== undefined)
	{
		var typedArray = new TYPED_ARRAYS[index.type](index.array);
		geometry.setIndex(new BufferAttribute(typedArray, 1));
	}

	var attributes = json.data.attributes;

	for (var key in attributes)
	{
		geometry.setAttribute(key, parseBufferAttribute(attributes[key]));
	}

	var morphAttributes = json.data.morphAttributes;
	if(morphAttributes)
	{
		for(var key in morphAttributes)
		{
			var attributeArray = morphAttributes[key];
			var array = [];

			for (var i = 0, il = attributeArray.length; i < il; i ++) {

				array.push(parseBufferAttribute(attributeArray[i]));
			}

			geometry.morphAttributes[key] = array;

		}

	}

	var morphTargetsRelative = json.data.morphTargetsRelative;
	if(morphTargetsRelative)
	{
		geometry.morphTargetsRelative = true;
	}

	var groups = json.data.groups || json.data.drawcalls || json.data.offsets;
	if (groups !== undefined)
	{
		for (var i = 0, n = groups.length; i !== n; ++ i)
		{
			var group = groups[i];
			geometry.addGroup(group.start, group.count, group.materialIndex);
		}
	}

	var boundingSphere = json.data.boundingSphere;
	if(boundingSphere !== undefined)
	{
		var center = new Vector3();
		if (boundingSphere.center !== undefined)
		{
			center.fromArray(boundingSphere.center);
		}

		geometry.boundingSphere = new Sphere(center, boundingSphere.radius);
	}

	if (json.name) geometry.name = json.name;
	if (json.userData) geometry.userData = json.userData;

	return geometry;

};