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