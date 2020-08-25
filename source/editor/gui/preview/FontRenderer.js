import {MeshBasicMaterial} from "three";
import {TextMesh} from "../../../core/objects/text/TextMesh.js";
import {OrthographicCamera} from "../../../core/objects/cameras/OrthographicCamera.js";
import {PreviewRenderer} from "./PreviewRenderer.js";

/** 
 * The font renderer is used to generate preview thumbnails for fonts.
 *
 * @class FontRenderer
 * @extends {PreviewRenderer}
 */
function FontRenderer()
{
	PreviewRenderer.call(this);

	// Camera
	this.camera = new OrthographicCamera(3, 1);

	// Text
	this.text = new TextMesh("Abc", new MeshBasicMaterial({color: 0xFFFFFF}), null);
	this.text.position.z = -3;
	this.scene.add(this.text);
}

FontRenderer.prototype = Object.create(PreviewRenderer.prototype);

FontRenderer.render = function(font, onRender)
{
	if (FontRenderer.instance === undefined)
	{
		FontRenderer.instance = new FontRenderer();
	}

	FontRenderer.instance.render(font, onRender);
};

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

	// Callback
	onRender(this.canvas.toDataURL());
};

export {FontRenderer};
