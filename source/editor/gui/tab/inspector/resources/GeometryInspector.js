"use strict";

function GeometryInspector(parent, object)
{
	ResourceInspector.call(this, parent, object);

	var self = this;

	// Geometry preview
	this.form.addText(Locale.geometry);
	this.preview = new RendererCanvas(this.form);
	this.preview.size.set(120, 180);
	this.preview.setOnResize(function(x, y)
	{
		self.camera.aspect = x / y;
		self.camera.updateProjectionMatrix();
	});
	this.form.add(this.preview);
	this.form.nextRow();

	// Mouse
	this.mouse = new Mouse(window, false);
	this.mouse.setCanvas(this.preview.canvas);

	// Scene
	this.scene = new THREE.Scene();

	// Grid
	this.grid = null;

	var directional = new THREE.DirectionalLight(0x777777, 1.0);
	directional.position.set(3e3, 1e4, 4e2);
	this.scene.add(directional);
	this.scene.add(new THREE.AmbientLight(0x888888));

	// Camera
	this.camera = new PerspectiveCamera(90, this.preview.size.x / this.preview.size.y);

	// Controls
	this.controls = new EditorOrbitControls();
	this.controls.attach(this.camera);
	this.scene.add(this.controls);

	// Mesh
	this.mesh = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshPhongMaterial());
	this.scene.add(this.mesh);

	// Render loop timer
	this.timer = new AnimationTimer(function()
	{
		if(self.object === null)
		{
			return;
		}
		
		self.mouse.update();
		self.controls.update(self.mouse);
		self.preview.renderer.render(self.scene, self.camera);
	});
	this.timer.start();
}

GeometryInspector.prototype = Object.create(ResourceInspector.prototype);

GeometryInspector.prototype.destroy = function()
{
	ResourceInspector.prototype.destroy.call(this);

	this.timer.stop();
}

GeometryInspector.prototype.updateInspector = function()
{
	ResourceInspector.prototype.updateInspector.call(this);

	var geometry = this.object;
	geometry.computeBoundingBox();
	
	var box = geometry.boundingBox;
	var center = new THREE.Vector3();
	center.addVectors(box.min, box.max);
	center.multiplyScalar(-0.5);

	var size = new THREE.Vector3();
	box.getSize(size);

	var max = size.toArray().reduce(function(a, b)
	{
		return a > b ? a : b;
	});

	if(this.grid !== null)
	{
		this.scene.remove(this.grid);
	}

	this.grid = new THREE.GridHelper(max * 2, 50, 0x888888);
	this.scene.add(this.grid);

	this.mesh.geometry = geometry;
	this.mesh.position.copy(center);

	this.controls.focusObject(this.mesh);
};
