"use strict";

/** 
 * The material renderer is used to generate preview thumbnails.
 *
 * @class MaterialRenderer
 * @extends {PreviewRenderer}
 */
function MaterialRenderer()
{
	PreviewRenderer.call(this);

	//Camera
	this.camera = new OrthographicCamera(2.15, 1);

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

	//Point light
	var point = new THREE.PointLight(0x999999);
	point.position.set(-0.5, 1, 1.5);
	this.scene.add(point);
}

MaterialRenderer.prototype = Object.create(PreviewRenderer.prototype);

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