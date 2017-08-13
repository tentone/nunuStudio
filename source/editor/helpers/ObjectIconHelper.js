"use strict";

function ObjectIconHelper(object, icon)
{
	THREE.Sprite.call(this, new THREE.SpriteMaterial(
	{
		map: new Texture(new Image(icon)),
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
	if(this.object !== null)
	{
		this.object.getWorldPosition(this.position);
	}
};