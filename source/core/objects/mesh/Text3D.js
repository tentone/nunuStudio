"use strict";

function Text3D(text, material, font, height, bevel, bevel_thickness, bevel_size)
{
	THREE.Mesh.call(this, undefined, material);
	
	this.name = "text";
	this.type = "Text3D";

	this.scale.set(0.02, 0.02, 0.02);

	this.font = font;

	this.text = (text !== undefined) ? text : "text";
	this.height = (height !== undefined) ? height : 50;
	this.bevel = (bevel !== undefined) ? bevel : false;
	this.bevel_thickness = (bevel_thickness !== undefined) ? bevel_thickness : 10;
	this.bevel_size = (bevel_size !== undefined) ? bevel_size : 8;

	this.setText(this.text);

	this.receiveShadow = true;
	this.castShadow = true;
}

Text3D.prototype = Object.create(THREE.Mesh.prototype);

//Set font
Text3D.prototype.setFont = function(font)
{
	this.font = font;
	this.setText();
}

//Set Text
Text3D.prototype.setText = function(text)
{
	if(text !== undefined)
	{
		this.text = text;
	}

	if(this.geometry !== undefined)
	{
		this.geometry.dispose();
	}
	
	var options = 
	{
		font: this.font,
		height: this.height,
		bevelEnabled: this.bevel,
		bevelSize: this.bevel_size,
		bevelThickness: this.bevel_thickness
	};

	this.geometry = new THREE.TextGeometry(this.text, options);
}

//Dispose text object
Text3D.prototype.dispose = function()
{
	if(this.material.dispose !== undefined)
	{
		this.material.dispose();
	}
	
	if(this.geometry !== undefined)
	{
		this.geometry.dispose();
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}

//Create JSON for object (need to backup geometry and set to undefined to avoid it being stored)
Text3D.prototype.toJSON = function(meta)
{
	var geometry = this.geometry;
	this.geometry = undefined;

	var font = this.font;
	var data = THREE.Object3D.prototype.toJSON.call(this, meta, function(meta, object)
	{
		font = font.toJSON(meta);
	});

	data.object.text = this.text;
	data.object.font = font.uuid;
	data.object.height = this.height;
	data.object.bevel = this.bevel;
	data.object.bevel_thickness = this.bevel_thickness;
	data.object.bevel_size = this.bevel_size;

	this.geometry = geometry;

	return data;
}