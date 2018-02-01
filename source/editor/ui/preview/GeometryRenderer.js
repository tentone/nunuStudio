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

	//Text
	this.mesh = new THREE.Mesh(null, new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
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
	this.mesh.geometry = geometry;
	this.mesh.geometry.computeBoundingBox();
	
	var box = this.mesh.geometry.boundingBox;
	this.mesh.position.x = -(box.max.x - box.min.x) / 2;
	this.mesh.position.y = -(box.max.y - box.min.y) / 2;

	this.camera.size = box.max.x - box.min.x;
	this.camera.updateProjectionMatrix();
	this.renderer.render(this.scene, this.camera);

	onRender(this.canvas.toDataURL());
};