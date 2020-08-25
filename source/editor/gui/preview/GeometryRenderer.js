import {DirectionalLight, AmbientLight, Mesh, Geometry, MeshPhongMaterial, Vector3} from "three";
import {OrthographicCamera} from "../../../core/objects/cameras/OrthographicCamera.js";
import {PreviewRenderer} from "./PreviewRenderer.js";

/** 
 * The geometry renderer is used to generate preview thumbnails.
 *
 * A basic phong material is used to preview the geometry.
 *
 * @class TextureRenderer
 * @extends {PreviewRenderer}
 */
function GeometryRenderer()
{
	PreviewRenderer.call(this);
	
	this.camera = new OrthographicCamera(3, 1);

	var directional = new DirectionalLight(0x777777, 1.0);
	directional.position.set(3000, 10000, 400);
	this.scene.add(directional);
	this.scene.add(new AmbientLight(0x888888));

	this.mesh = new Mesh(new Geometry(), new MeshPhongMaterial({color: 0xFFFFFF}));
	this.scene.add(this.mesh);
}

GeometryRenderer.prototype = Object.create(PreviewRenderer.prototype);

GeometryRenderer.render = function(material, onRender)
{
	if (GeometryRenderer.instance === undefined)
	{
		GeometryRenderer.instance = new GeometryRenderer();
	}

	GeometryRenderer.instance.render(material, onRender);
};

GeometryRenderer.prototype.render = function(geometry, onRender)
{
	geometry.computeBoundingBox();
	
	var box = geometry.boundingBox;
	var center = new Vector3();
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

export {GeometryRenderer};
