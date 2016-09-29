"use strict";

//Text3D constructor
function Text3D(text, material, font)
{
	THREE.Mesh.call(this, new THREE.TextGeometry(text, {font: font}), material);
	
	this.name = "text";
	this.type = "Text3D";

	this.scale.set(0.02, 0.02, 0.02);

	this.font = font;
	this.text = text;
		
	this.receiveShadow = true;
	this.castShadow = true;
}

//Super prototype
Text3D.prototype = Object.create(THREE.Mesh.prototype);

//Dispose text object
Text3D.prototype.dispose = function()
{
	if(this.material.dispose !== undefined)
	{
		this.material.dispose();
	}
	this.geometry.dispose();

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}

//Set Text
Text3D.prototype.setText = function(text)
{
	this.text = text;
	this.geometry.dispose();
	this.geometry = new THREE.TextGeometry(this.text, {font: this.font});
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

	this.geometry = geometry;

	return data;
}