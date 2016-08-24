"use strict";

//Sprite constructor
function Sprite(material)
{
	THREE.Sprite.call(this, material);

	this.name = "sprite";
	this.type = "Sprite";
}

Sprite.prototype = Object.create(THREE.Sprite.prototype);

//Dipose sprite
Sprite.prototype.dispose = function()
{
	//Dipose material
	if(this.material.dispose !== undefined)
	{
		this.material.dispose();
	}

	//Dipose children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}
