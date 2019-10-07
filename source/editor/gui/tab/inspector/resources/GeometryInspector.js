"use strict";

function GeometryInspector(parent, object)
{
	ResourceInspector.call(this, parent, object);

	var self = this;

	// Geometry preview
	this.form.addText(Locale.geometry);
	this.preview = new RendererCanvas(this.form);
	this.preview.size.set(120, 120);
	this.preview.setOnResize(function(x, y)
	{
		self.camera.aspect = x / y;
		self.camera.updateProjectionMatrix();
	});
	this.form.add(this.preview);
	this.form.nextRow();

	//Mouse
	this.mouse = new Mouse(window, true);
	this.mouse.setCanvas(this.preview.element);

	// Scene
	this.scene = new THREE.Scene();
	this.scene.matrixAutoUpdate = false;
	this.scene.add(new THREE.GridHelper(50, 50, 0x888888));
	this.scene.add(new THREE.AxesHelper(50));

	//Controls
	this.controls = new EditorOrbitControls();
	this.scene.add(this.controls);

	//Camera
	this.camera = new PerspectiveCamera(90, this.preview.size.x / this.preview.size.y);
	this.controls.add(this.camera);

	//Mesh
	this.mesh = new THREE.Mesh(null, new THREE.MeshPhongMaterial());
	this.scene.add(this.mesh);

	// Render loop timer
	this.timer = new AnimationTimer();
	this.timer.start(function()
	{
		if(self.object === null)
		{
			return;
		}

		self.controls.update(self.mouse);
		self.preview.renderer.render(self.scene, self.camera);
	});
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

	this.mesh.geometry = this.object;
};