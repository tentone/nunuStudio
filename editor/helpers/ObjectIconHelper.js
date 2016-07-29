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

//Functions prototypes
ObjectIconHelper.prototype = Object.create(THREE.Sprite.prototype);
ObjectIconHelper.prototype.update = update;

//Update attached particle
function update()
{
	if(this.obj !== null)
	{
		this.obj.getWorldPosition(this.position);
	}
}