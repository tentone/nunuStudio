"use strict";

function ObjectIconHelper(obj, icon)
{
	THREE.Sprite.call(this, new THREE.SpriteMaterial({map: new Texture(icon), color: 0xffffff}));

	this.obj = null;
	if(obj instanceof THREE.Object3D)
	{
		this.obj = obj;
	}
}

//Super prototypes
ObjectIconHelper.prototype = Object.create(THREE.Sprite.prototype);

//Update attached particle
ObjectIconHelper.prototype.update = function()
{
	if(this.obj !== null)
	{
		this.obj.getWorldPosition(this.position);
	}
}