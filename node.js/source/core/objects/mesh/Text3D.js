"use strict";

function Text3D(text, material, font, height, bevel, bevelThickness, bevelSize, size, curveSegments)
{
	THREE.Mesh.call(this, undefined, material);
	
	this.name = "text";
	this.type = "Text3D";

	this.font = font;
	this.text = (text !== undefined) ? text : "text";
	
	this.size = (size !== undefined) ? size : 1;
	this.height = (height !== undefined) ? height : 0.5;
	this.curveSegments = (curveSegments !== undefined) ? curveSegments : 15;

	this.bevel = (bevel !== undefined) ? bevel : false;
	this.bevelThickness = (bevelThickness !== undefined) ? bevelThickness : 0.1;
	this.bevelSize = (bevelSize !== undefined) ? bevelSize : 0.05;

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
	
	this.updateText();
}

//Update attributes
Text3D.prototype.updateText = function()
{
	if(this.font !== null)
	{
		this.geometry = new THREE.TextGeometry(this.text,
		{
			size: this.size,
			curveSegments: this.curveSegments,
			font: this.font,
			height: this.height,
			bevelEnabled: this.bevel,
			bevelSize: this.bevelSize,
			bevelThickness: this.bevelThickness
		});
	}
}

//Clone text 3D
Text3D.prototype.clone = function()
{
	return new Text3D(this.text, this.material, this.font, this.height, this.bevel, this.bevelThickness, this.bevelSize, this.size, this.curveSegments);
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

	data.object.size = this.size;
	data.object.curveSegments = this.curveSegments;

	data.object.height = this.height;
	data.object.bevel = this.bevel;
	data.object.bevelThickness = this.bevelThickness;
	data.object.bevelSize = this.bevelSize;

	this.geometry = geometry;

	return data;
}