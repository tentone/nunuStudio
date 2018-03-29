"use strict";

function FontRenderer()
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
	this.text = new Text3D("Abc", new THREE.MeshBasicMaterial({color: 0xFFFFFF}), null);
	this.text.position.z = -3;
	this.scene.add(this.text);
}

FontRenderer.render = function(material, onRender)
{
	if(FontRenderer.instance === undefined)
	{
		FontRenderer.instance = new FontRenderer();
	}

	FontRenderer.instance.render(material, onRender);
};

//Set render size
FontRenderer.prototype.setSize = function(x, y)
{
	this.renderer.setSize(x, y);
};

//Render material to internal canvas and copy image to html image element
FontRenderer.prototype.render = function(font, onRender)
{
	this.text.setFont(font);

	this.text.geometry.computeBoundingBox();
	
	var box = this.text.geometry.boundingBox;
	this.text.position.x = -(box.max.x - box.min.x) / 2;
	this.text.position.y = -(box.max.y - box.min.y) / 2;

	this.camera.size = box.max.x - box.min.x;
	this.camera.updateProjectionMatrix();
	
	this.renderer.render(this.scene, this.camera);

	//Callback
	onRender(this.canvas.toDataURL());
};