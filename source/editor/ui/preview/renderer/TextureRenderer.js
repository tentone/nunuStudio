"use strict";

function TextureRenderer()
{
	//Renderer
	this.renderer = new THREE.WebGLRenderer({alpha: true});
	this.renderer.shadowMap.enabled = false;
	this.renderer.setSize(128, 128);
	
	//Canvas
	this.canvas = this.renderer.domElement;
	
	//Camera
	this.camera = new OrthographicCamera(1.2, 1, OrthographicCamera.RESIZE_VERTICAL);

	//Scene
	this.scene = new THREE.Scene();

	//Plane
	this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), new THREE.MeshBasicMaterial({transparent: true}));
	this.plane.position.set(0, 0, -1);
	this.scene.add(this.plane);
}

TextureRenderer.render = function(texture, onRender)
{
	if(TextureRenderer.instance === undefined)
	{
		TextureRenderer.instance = new TextureRenderer();
	}

	TextureRenderer.instance.render(material, onRender);
};

//Set render size
TextureRenderer.prototype.setSize = function(x, y)
{
	this.renderer.setSize(x, y);
};

//Render material to internal canvas and create dataURL that is passed to onRender callback
TextureRenderer.prototype.render = function(material, onRender)
{
	//Render
	this.renderer.render(this.scene, this.camera);

	//Callback
	onRender(this.canvas.toDataURL());
};