import {Sprite, SpriteMaterial} from "three";
import {CanvasTexture} from "../../texture/CanvasTexture.js";

/**
 * Canvas sprite is used to render canvas based elements in a 2D canvas.
 *
 * The sprite can be configured to keep a relative size to the screen of an absolute size.
 * 
 * @class CanvasSprite
 * @extends {Sprite}
 */
class CanvasSprite extends Sprite
{
	constructor()
	{
		/**
		 * Texture where the text is drawn to.
		 * 
		 * @attribute texture
		 * @type {CanvasTexture}
		 */
		var texture = new CanvasTexture();

		var material = new SpriteMaterial(
			{
				map: texture,
				color: 0xFFFFFF,
				transparent: true,
				alphaTest: 0.4,
				depthTest: true,
				depthWrite: true,
				sizeAttenuation: true
			});

		super(material);

		this.texture = texture;

		/**
		 * DOM canvas to draw.
		 * 
		 * @attribute canvas
		 * @type {Element}
		 */
		this.canvas = this.texture.image;

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
				get: function() {return this.material.sizeAttenuation;},
				set: function(value)
				{
					this.material.sizeAttenuation = value;
					this.material.needsUpdate = true;
				}
			}
			});
	}
}

export {CanvasSprite};
