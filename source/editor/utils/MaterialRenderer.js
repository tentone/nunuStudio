"use strict";

function MaterialRenderer()
{
	//Canvas
	this.canvas = document.createElement("canvas");
	this.canvas.width = 128;
	this.canvas.height = 128;

	//Renderer
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true});
	this.renderer.setSize(this.canvas.width, this.canvas.width);

	//Camera
	this.camera = new THREE.PerspectiveCamera(90, this.canvas.width / this.canvas.height);

	//Mesh sphere scene
	this.scene = new THREE.Scene();

	//Sphere
	this.sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), null);
	this.scene.add(this.sphere);

	this.ambient = new THREE.AmbientLight(0x777777);
	this.scene.add(this.ambient);

	this.point = new THREE.PointLight(0xBBBBBB);
	this.point.position.set(0, 1, 2);
	//this.scene.add(this.point);

	//Sprite
	this.sprite = new THREE.Sprite(null);
}

//Set render size
MaterialRenderer.prototype.setSize = function(x, y)
{
	this.canvas.width = x;
	this.canvas.height = y;
	this.renderer.setSize(x, y);
}

//Render material to internal canvas and copy image to html image element
MaterialRenderer.prototype.renderMaterial = function(material, img)
{
	if(material instanceof THREE.SpriteMaterial)
	{
		this.sprite.material = material;
		this.camera.position.set(0, 0, 0.5);
		this.renderer.render(this.sprite, this.camera);
	}
	else
	{
		this.sphere.material = material;
		this.camera.position.set(0, 0, 1.5);
		this.renderer.render(this.scene, this.camera);
	}

	//Create image blob and set as image source
	if(img !== undefined)
	{
		var canvas = this.canvas;
		canvas.toBlob(function(blob)
		{
			var url = URL.createObjectURL(blob);
			img.src = url;
		});
	}
}