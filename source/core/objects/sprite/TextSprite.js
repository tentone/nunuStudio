"use strict";

function TextSprite(text, font)
{
	THREE.TextSprite.call(this, new THREE.SpriteMaterial({color: 0xffffff}));

	this.name = "sprite";
	this.type = "TextSprite";

	this.font = font;
	this.text = text;

	//TODO <ADD CODE HERE>
}

TextSprite.prototype = Object.create(THREE.Sprite.prototype);

//Set font
TextSprite.prototype.setFont = function(font)
{
	this.font = font;
	this.setText();
}

//Set text
TextSprite.prototype.setText = function(text)
{
	if(text !== undefined)
	{
		this.text = text;
	}

	//TODO <ADD CODE HERE>
}

//Dispose text sprite
TextSprite.prototype.dispose = function()
{
	if(this.material !== null && this.material.dispose !== undefined)
	{
		this.material.dispose();
	}
	
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}

//Create JSON for object
TextSprite.prototype.toJSON = function(meta)
{
	var material = this.material;
	this.material = undefined;

	var font = this.font;
	var data = THREE.Sprite.prototype.toJSON.call(this, meta, function(meta, object)
	{
		font = font.toJSON(meta);
	});

	data.object.text = this.text;
	data.object.font = font.uuid;

	this.material = material;

	return data;
}