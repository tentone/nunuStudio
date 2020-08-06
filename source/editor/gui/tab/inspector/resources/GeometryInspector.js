import {Locale} from "../../../../locale/LocaleManager.js";
import {AnimationTimer} from "../../../../../core/utils/timer/AnimationTimer.js";
import {PerspectiveCamera} from "../../../../../core/objects/cameras/PerspectiveCamera.js";
import {Mouse} from "../../../../../core/input/Mouse.js";
import {EditorOrbitControls} from "../../scene-editor/controls/EditorOrbitControls.js";
import {ResourceInspector} from "./ResourceInspector.js";
import {RendererCanvas} from "../../../../components/RendererCanvas.js";
import {Scene, DirectionalLight, AmbientLight, Mesh, Geometry, MeshPhongMaterial, Vector3, GridHelper} from "three";

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
	this.scene = new Scene();

	// Grid
	this.grid = null;

	var directional = new DirectionalLight(0x777777, 1.0);
	directional.position.set(3e3, 1e4, 4e2);
	this.scene.add(directional);
	this.scene.add(new AmbientLight(0x888888));

	// Camera
	this.camera = new PerspectiveCamera(90, this.preview.size.x / this.preview.size.y);

	// Controls
	this.controls = new EditorOrbitControls();
	this.controls.attach(this.camera);
	this.scene.add(this.controls);

	// Mesh
	this.mesh = new Mesh(new Geometry(), new MeshPhongMaterial());
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
	var center = new Vector3();
	center.addVectors(box.min, box.max);
	center.multiplyScalar(-0.5);

	var size = new Vector3();
	box.getSize(size);

	var max = size.toArray().reduce(function(a, b)
	{
		return a > b ? a : b;
	});

	if(this.grid !== null)
	{
		this.scene.remove(this.grid);
	}

	this.grid = new GridHelper(max * 2, 50, 0x888888);
	this.scene.add(this.grid);

	this.mesh.geometry = geometry;
	this.mesh.position.copy(center);

	this.controls.focusObject(this.mesh);
};

export {GeometryInspector};