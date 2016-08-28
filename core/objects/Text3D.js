"use strict";

//Text3D constructor
function Text3D(text, material, font)
{
	if(font === undefined)
	{
		this.font = new FontLoader().parse(JSON.parse(App.readFile("data/fonts/montserrat.json")));
	}
	else
	{
		this.font = font;
	}

	THREE.Mesh.call(this, new THREE.TextGeometry(text, {font: this.font}), material);
	
	this.name = "text";
	this.type = "Text3D";

	this.scale.set(0.02, 0.02, 0.02);

	this.text = text;
		
	this.receiveShadow = true;
	this.castShadow = true;
}

//Super prototype
Text3D.prototype = Object.create(THREE.Mesh.prototype);

//Dispose text
Text3D.prototype.dispose = function()
{
	//Dispose material and geometry
	if(this.material.dispose !== undefined)
	{
		this.material.dispose();
	}
	this.geometry.dispose();

	//Dispose children
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

//Create JSON for object
Text3D.prototype.toJSON = function(meta)
{
	//Backup geometry and set to undefined to avoid being stored
	var geometry = this.geometry;
	this.geometry = undefined;

	//Call super toJSON
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);
	
	data.object.text = this.text;
	data.object.font = this.font.data;
	
	//Restore geometry
	this.geometry = geometry;

	return data;
}