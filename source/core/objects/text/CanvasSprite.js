"use strict";

/**
 * Canvas sprite is used to render canvas based elements in a 2D canvas.
 *
 * The sprite can be configured to keep a relative size to the screen of an absolute size.
 * 
 * @class CanvasSprite
 * @extends {THREE.Sprite}
 * @param {THREE.SpriteMaterial} material Override material if it is present no canvas and texture will be created internally.
 */
function CanvasSprite(material)
{
	if(material === undefined)
	{
		/**
		 * DOM canvas to draw.
		 * 
		 * @attribute canvas
		 * @type {DOM}
		 */
		this.canvas = document.createElement("canvas");

		/**
		 * Texture where the text is drawn to.
		 * 
		 * @attribute texture
		 * @type {THREE.CanvasTexture}
		 */
		this.texture = new THREE.CanvasTexture(this.canvas);
		this.texture.premultiplyAlpha = true;

		material = new THREE.SpriteMaterial(
		{
			map: this.texture,
			color: 0xffffff,
			transparent: true,
			alphaTest: 0.2,
			depthTest: false,
			depthWrite: false,
			sizeAttenuation: false
		});
	}

	THREE.Sprite.call(this, material);

	/** 
	 * Size of the sprite.
	 *
	 * If configured as relative to the screen (from 0 to 1) or absolutely in px.
	 *
	 * @attribute size
	 * @type {Number}
	 */
	this.size = 0.06;

	/**
	 * Sizing mode, can be relative of absolute.
	 *
	 * @attribute resizeMode
	 * @type {Number}
	 */
	this.sizingMode = null;
	this.setSizingMode(CanvasSprite.RELATIVE);
}	

CanvasSprite.prototype = Object.create(THREE.Sprite.prototype);

/**
 * Relative sizing is done relative to the screen height.
 *
 * @static
 * @attribute RELATIVE
 * @type {Number}
 */ 
CanvasSprite.RELATIVE = 100;

/**
 * Scaled sizing is done relative to the camera position.
 *
 * Is similar to the RELATIVE sizing but the actual sprite size is recalculated (slower) but allows for raytracing to be performed properly.
 *
 * @static
 * @attribute SCALED
 * @type {Number}
 */ 
CanvasSprite.SCALED = 101;

/**
 * Absolute sizing is performed directly in px.
 *
 * @static
 * @attribute ABSOLUTE
 * @type {Number}
 */ 
CanvasSprite.ABSOLUTE = 102;

/**
 * Redraw the content on the canvas.
 *
 * Should be called everytime that information that needs to be displayed is updated.
 * 
 * When relative scalling is enabled size changed should be applied here.
 *
 * @method draw
 */
CanvasSprite.prototype.draw = function(){};

/** 
 * Set the sizing mode for this canvas.
 *
 * @method setSizingMode
 * @param {Number} sizingMode
 */
CanvasSprite.prototype.setSizingMode = function(sizingMode)
{
	this.sizingMode = sizingMode;

	if(this.material instanceof THREE.SpriteMaterial)
	{
		this.material.sizeAttenuation = this.sizingMode === CanvasSprite.SCALED;
		this.material.needsUpdate = true;
	}
};

CanvasSprite.tempA = new THREE.Vector3();
CanvasSprite.tempB = new THREE.Vector3();

CanvasSprite.prototype.onBeforeRender = function(renderer, scene, camera, geometry, material, group)
{
	if(this.sizingMode === CanvasSprite.SCALED)
	{
		this.getWorldPosition(CanvasSprite.tempA);
		camera.getWorldPosition(CanvasSprite.tempB);
		var scale = CanvasSprite.tempA.distanceTo(CanvasSprite.tempB) / 15 * this.size;
		this.scale.set(scale, scale, scale);
	}
};