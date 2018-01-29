"use strict";

function TextureRenderer()
{
	//Renderer
	this.renderer = new THREE.WebGLRenderer({alpha: true});
	this.renderer.shadowMap.enabled = false;
	this.renderer.setSize(64, 64);
	
	//Canvas
	this.canvas = this.renderer.domElement;
	
	//Camera
	this.camera = new OrthographicCamera(1, 1, OrthographicCamera.RESIZE_VERTICAL);

	//Scene
	this.scene = new THREE.Scene();

	//Material
	this.material = new THREE.MeshBasicMaterial({transparent: true});

	//Plane
	this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), this.material);
	this.plane.position.set(0, 0, -1);
	this.scene.add(this.plane);
}

TextureRenderer.render = function(texture, onRender)
{
	if(TextureRenderer.instance === undefined)
	{
		TextureRenderer.instance = new TextureRenderer();
	}

	TextureRenderer.instance.render(texture, onRender);
};

//Set render size
TextureRenderer.prototype.setSize = function(x, y)
{
	this.renderer.setSize(x, y);
};

//Render texture to internal canvas and create dataURL that is passed to onRender callback
TextureRenderer.prototype.render = function(texture, onRender)
{
	if(texture.isCubeTexture)
	{
		var cube = new CubemapFlatPreview(texture, 64/4, 0, 64/8);
		cube.setSize(64, 64);
		cube.render(this.renderer);
		onRender(this.canvas.toDataURL());
	}
	else
	{
		this.material.map = texture;
		this.material.needsUpdate = true;
		this.renderer.render(this.scene, this.camera);
		onRender(this.canvas.toDataURL());
	}
};
