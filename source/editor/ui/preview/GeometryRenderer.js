"use strict";

function GeometryRenderer()
{
	//Renderer
	this.renderer = new THREE.WebGLRenderer({alpha: true});
	this.renderer.setSize(96, 96);
	
	//Canvas
	this.canvas = this.renderer.domElement;
	
	//Camera
	this.camera = new OrthographicCamera(3, 1);

	//Scene
	this.scene = new THREE.Scene();
	var directional = new THREE.DirectionalLight(0x777777, 1.0);
	directional.position.set(3000, 10000, 400);
	this.scene.add(directional);
	this.scene.add(new THREE.AmbientLight(0x888888));

	this.mesh = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshPhongMaterial({color: 0xFFFFFF}));
	this.scene.add(this.mesh);
}

GeometryRenderer.render = function(material, onRender)
{
	if(GeometryRenderer.instance === undefined)
	{
		GeometryRenderer.instance = new GeometryRenderer();
	}

	GeometryRenderer.instance.render(material, onRender);
};

//Set render size
GeometryRenderer.prototype.setSize = function(x, y)
{
	this.renderer.setSize(x, y);
};

//Render material to internal canvas and copy image to html image element
GeometryRenderer.prototype.render = function(geometry, onRender)
{
	geometry.computeBoundingBox();
	
	var box = geometry.boundingBox;
	var center = new THREE.Vector3();
	center.addVectors(box.min, box.max);
	center.multiplyScalar(-0.5);

	this.mesh.geometry = geometry;
	this.mesh.position.copy(center);

	var x = box.max.x - box.min.x;
	var y = box.max.y - box.min.y;

	this.camera.size = x > y ? x : y;
	this.camera.position.z = 50;
	this.camera.updateProjectionMatrix();
	this.renderer.render(this.scene, this.camera);

	onRender(this.canvas.toDataURL());
};