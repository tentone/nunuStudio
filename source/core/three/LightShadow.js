"use strict";

THREE.LightShadow.prototype.toJSON = function()
{
	var data = {};

	data.bias = this.bias;
	data.radius = this.radius;

	data.mapSize = {};
	data.mapSize.x = this.mapSize.x;
	data.mapSize.y = this.mapSize.y;
	
	data.camera = {};
	data.camera.top = this.camera.top;
	data.camera.bottom = this.camera.bottom;
	data.camera.far = this.camera.far;
	data.camera.near = this.camera.near;
	data.camera.left = this.camera.left;
	data.camera.right = this.camera.right;

	return data;
}

THREE.LightShadow.prototype.fromJSON = function(data)
{
	if(data.bias !== undefined)
	{
		this.bias = data.bias;
	}
	if(data.radius !== undefined)
	{	
		this.radius = data.radius;
	}
	if(data.mapSize !== undefined)
	{
		var mapSize = data.mapSize;
		this.mapSize.set(mapSize.x, mapSize.y);
	}
	if(data.camera !== undefined)
	{
		var camera = data.camera;
		this.camera.top = camera.top;
		this.camera.bottom = camera.bottom;
		this.camera.left = camera.left;
		this.camera.right = camera.right;
		this.camera.near = camera.near;
		this.camera.far = camera.far;
	}
}