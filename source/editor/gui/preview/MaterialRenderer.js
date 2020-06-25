import {OrthographicCamera} from "../../../../core/objects/cameras/OrthographicCamera.js";
import {PreviewRenderer} from "../PreviewRenderer.js";
import {SphereGeometry, Mesh, Points, Line, Sprite, AmbientLight, PointLight, Material, SpriteMaterial, LineBasicMaterial, PointsMaterial} from "three";

/** 
 * The material renderer is used to generate preview thumbnails.
 *
 * @class MaterialRenderer
 * @extends {PreviewRenderer}
 */
function MaterialRenderer()
{
	PreviewRenderer.call(this);

	// Camera
	this.camera = new OrthographicCamera(2.15, 1);

	// Geometry
	this.geometry = new SphereGeometry(1, 16, 16);

	// Mesh
	this.mesh = new Mesh(this.geometry);
	this.scene.add(this.mesh);

	// Points
	this.points = new Points(this.geometry);
	this.scene.add(this.points);

	// Line
	this.line = new Line(this.geometry);
	this.scene.add(this.line);

	// Sprite
	this.sprite = new Sprite();
	this.sprite.scale.set(2, 2, 1);
	this.scene.add(this.sprite);

	// Ambient light
	var ambient = new AmbientLight(0x999999);
	this.scene.add(ambient);

	// Point light
	var point = new PointLight(0x999999);
	point.position.set(-0.5, 1, 1.5);
	this.scene.add(point);
}

MaterialRenderer.prototype = Object.create(PreviewRenderer.prototype);

/**
 * Create a DOM element with the material preview render.
 *
 * @static
 * @method generateElement
 * @param {Material} material Material to preview.
 */
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
	if(material instanceof SpriteMaterial)
	{
		this.mesh.visible = false;
		this.sprite.visible = true;
		this.points.visible = false;
		this.line.visible = false;

		this.sprite.material = material;
		this.camera.position.set(0, 0, 0.5);
	}
	else if(material instanceof LineBasicMaterial)
	{
		this.mesh.visible = false;
		this.sprite.visible = false;
		this.points.visible = false;
		this.line.visible = true;

		this.line.material = material;
		this.camera.position.set(0, 0, 0.5);
	}
	else if(material instanceof PointsMaterial)
	{
		this.mesh.visible = false;
		this.sprite.visible = false;
		this.points.visible = true;
		this.line.visible = false;

		this.points.material = material;
		this.camera.position.set(0, 0, 0.5);
	}
	else
	{
		this.sprite.visible = false;
		this.mesh.visible = true;
		this.points.visible = false;
		this.line.visible = false;

		this.mesh.material = material;
		this.camera.position.set(0, 0, 1.5);
	}

	// Render
	this.renderer.render(this.scene, this.camera);

	// Callback
	onRender(this.canvas.toDataURL());
};
export {MaterialRenderer};