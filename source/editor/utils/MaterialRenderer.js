"use strict";

function MaterialRenderer()
{
	//Renderer
	this.renderer = new THREE.WebGLRenderer({alpha: true});
	this.renderer.setSize(128, 128);
	
	//Camera
	this.camera = new THREE.PerspectiveCamera(90, 1);

	//Scene
	this.scene = new THREE.Scene();

	//Sphere
	this.sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), null);
	this.scene.add(this.sphere);

	//Sprite
	this.sprite = new THREE.Sprite(null);
	this.scene.add(this.sprite);

	//Ambient light
	//var ambient = new THREE.AmbientLight(0x777777);
	//this.scene.add(ambient);

	//Pontual light
	//var point = new THREE.PointLight(0xBBBBBB);
	//point.position.set(0, 1, 1.5);
	//this.scene.add(point);
}

//Set render size
MaterialRenderer.prototype.setSize = function(x, y)
{
	this.renderer.setSize(x, y);
}

//Render material to internal canvas and copy image to html image element
MaterialRenderer.prototype.renderMaterial = function(material, img)
{
	//Render material
	if(material instanceof THREE.SpriteMaterial)
	{
		this.sphere.visible = false;
		this.sprite.visible = true;

		this.sprite.material = material;
		this.camera.position.set(0, 0, 0.5);
	}
	else
	{
		this.sprite.visible = false;
		this.sphere.visible = true;

		this.sphere.material = material;
		this.camera.position.set(0, 0, 1.5);
	}

	this.renderer.render(this.scene, this.camera);

	//Create image blob and set as image source
	if(img !== undefined)
	{
		var canvas = this.renderer.domElement;
		canvas.toBlob(function(blob)
		{
			var url = URL.createObjectURL(blob);
			img.src = url;
		});
	}
}