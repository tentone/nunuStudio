"use strict";

function MaterialRenderer()
{
	//Renderer
	this.renderer = new THREE.WebGLRenderer({alpha: true});
	this.renderer.setSize(64, 64);
	
	//Canvas
	this.canvas = this.renderer.domElement;
	
	//Camera
	this.camera = new OrthographicCamera(2.15, 1);

	//Scene
	this.scene = new THREE.Scene();

	//Sphere
	this.sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16));
	this.scene.add(this.sphere);

	//Sprite
	this.sprite = new THREE.Sprite();
	this.sprite.scale.set(2, 2, 1);
	this.scene.add(this.sprite);

	//Ambient light
	var ambient = new THREE.AmbientLight(0x999999);
	this.scene.add(ambient);

	//Pontual light
	var point = new THREE.PointLight(0x999999);
	point.position.set(-0.5, 1, 1.5);
	this.scene.add(point);
}

MaterialRenderer.generateElement = function(material)
{
	var preview = document.createElement("img");
	MaterialRenderer.render(material, function(url)
	{
		preview.src = url;
	});

	return preview;
};

MaterialRenderer.render = function(material, onRender)
{
	if(MaterialRenderer.instance === undefined)
	{
		MaterialRenderer.instance = new MaterialRenderer();
	}

	MaterialRenderer.instance.render(material, onRender);
};

//Set render size
MaterialRenderer.prototype.setSize = function(x, y)
{
	this.renderer.setSize(x, y);
};

//Render material to internal canvas and create dataURL that is passed to onRender callback
MaterialRenderer.prototype.render = function(material, onRender)
{
	//Set material
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

	//Render
	this.renderer.render(this.scene, this.camera);

	//Callback
	onRender(this.canvas.toDataURL());
};