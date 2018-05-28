"use strict";

function ObjectIconHelper(object, icon)
{
	var element = document.createElement("img");
	var texture = new THREE.Texture(element);
	element.onload = function()
	{
		texture.needsUpdate = true;
	};
	element.src = icon;

	THREE.Sprite.call(this, new THREE.SpriteMaterial(
	{
		map: texture,
		transparent: true,
		opacity: 0.8,
		depthTest: false,
		depthWrite: false,
		color: 0xffffff
	}));

	this.object = object;

	this.tempA = new THREE.Vector3();
	this.tempB = new THREE.Vector3();
}

ObjectIconHelper.prototype = Object.create(THREE.Sprite.prototype);

ObjectIconHelper.prototype.onBeforeRender = function(renderer, scene, camera, geometry, material, group)
{
	this.getWorldPosition(this.tempA);
	camera.getWorldPosition(this.tempB);

	var scale = this.tempA.distanceTo(this.tempB) / 10;

	this.scale.set(scale, scale, scale);
};

ObjectIconHelper.prototype.update = function()
{
	this.object.getWorldPosition(this.position);
};