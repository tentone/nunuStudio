"use strict";

function DirectionalLight(hex, intensity)
{
	THREE.DirectionalLight.call(this, hex, intensity);

	this.name = "directional_light";
	
	this.castShadow = true;
	
	this.shadow.camera.near = 0;
	this.shadow.camera.far = 5000;
	this.shadow.camera.left = -10;
	this.shadow.camera.right = 10;
	this.shadow.camera.top = 10;
	this.shadow.camera.bottom = -10;

	this.shadow.mapSize.width = 1024;
	this.shadow.mapSize.height = 1024;
}

//Function Prototype
DirectionalLight.prototype = Object.create(THREE.DirectionalLight.prototype);
DirectionalLight.prototype.update = update;
DirectionalLight.prototype.initialize = initialize;
DirectionalLight.prototype.toJSON = toJSON;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update
function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Create JSON for object
function toJSON(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.shadow_left = this.shadow.camera.left;
	data.shadow_right = this.shadow.camera.right;
	data.shadow_top = this.shadow.camera.top;
	data.shadow_bottom = this.shadow.camera.bottom;
	
	return data;
}