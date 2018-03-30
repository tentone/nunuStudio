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
}

ObjectIconHelper.prototype = Object.create(THREE.Sprite.prototype);

ObjectIconHelper.prototype.update = function()
{
	this.object.getWorldPosition(this.position);
};