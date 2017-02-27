"use strict";

function FontRenderer()
{
	//Renderer
	this.renderer = new THREE.WebGLRenderer({alpha: true});
	this.renderer.setSize(128, 128);
	
	//Camera
	this.camera = new OrthographicCamera(3, 1);

	//Scene
	this.scene = new THREE.Scene();

	//Sphere
	this.text = new Text3D("Abc", new THREE.MeshBasicMaterial({color: 0xFFFFFF}), null);
	this.text.curveSegments = 10;
	this.text.position.z = -3;

	this.scene.add(this.text);
}

//Set render size
FontRenderer.prototype.setSize = function(x, y)
{
	this.renderer.setSize(x, y);
}

//Render material to internal canvas and copy image to html image element
FontRenderer.prototype.renderFont = function(font, img)
{
	this.text.setFont(font);

	this.text.geometry.computeBoundingBox();
	
	var box = this.text.geometry.boundingBox;
	this.text.position.x = -(box.max.x - box.min.x) / 2;
	this.text.position.y = -(box.max.y - box.min.y) / 2;

	this.camera.size = box.max.x - box.min.x;
	this.camera.updateProjectionMatrix();
	
	this.renderer.render(this.scene, this.camera);

	//Create image blob and set as image source
	if(img !== undefined)
	{
		var canvas = this.renderer.domElement;
		canvas.toBlob = canvas.toBlob || canvas.msToBlob;
		canvas.toBlob(function(blob)
		{
			var url = URL.createObjectURL(blob);
			img.src = url;
		});
	}
}