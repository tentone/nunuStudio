"use strict";

function TextSprite(text, font)
{
	THREE.TextSprite.call(this);

	this.name = "sprite";
	this.type = "TextSprite";

	this.text = "text";
	this.font = null;

}

TextSprite.prototype = Object.create(THREE.TextSprite.prototype);

TextSprite.prototype.dispose = function()
{
	if(this.material.dispose !== undefined)
	{
		this.material.dispose();
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}

TextSprite.prototype.toJSON = function()
{

}