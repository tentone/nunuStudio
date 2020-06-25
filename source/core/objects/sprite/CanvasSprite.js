import {Texture} from "../../../texture/Texture.js";
import {CanvasTexture} from "../../../texture/CanvasTexture.js";
import {Text} from "../../../../editor/components/Text.js";
import {Canvas} from "../../../../editor/components/Canvas.js";
import {Sprite, SpriteMaterial} from "three";

/**
 * Canvas sprite is used to render canvas based elements in a 2D canvas.
 *
 * The sprite can be configured to keep a relative size to the screen of an absolute size.
 * 
 * @class CanvasSprite
 * @extends {Sprite}
 */
function CanvasSprite()
{
	/**
	 * Texture where the text is drawn to.
	 * 
	 * @attribute texture
	 * @type {CanvasTexture}
	 */
	this.texture = new CanvasTexture();

	/**
	 * DOM canvas to draw.
	 * 
	 * @attribute canvas
	 * @type {Element}
	 */
	this.canvas = this.texture.image;

	var material = new SpriteMaterial(
	{
		map: this.texture,
		color: 0xFFFFFF,
		transparent: true,
		alphaTest: 0.4,
		depthTest: true,
		depthWrite: true,
		sizeAttenuation: true
	});

	Sprite.call(this, material);

	this.name = "sprite";
	this.type = "CanvasSprite";

	Object.defineProperties(this,
	{
		/**
		 * Size attenuation indicates how the sprite should be scaled relative to the camera.
		 *
		 * @attribute sizeAttenuation
		 * @type {number}
		 */
		sizeAttenuation:
		{
			get: function(){return this.material.sizeAttenuation;},
			set: function(value)
			{
				this.material.sizeAttenuation = value;
				this.material.needsUpdate = true;
			}
		}
	});
}	

CanvasSprite.prototype = Object.create(Sprite.prototype);

export {CanvasSprite};