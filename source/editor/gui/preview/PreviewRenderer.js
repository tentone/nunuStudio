"use strict";

/** 
 * The preview renderer is used to generate preview thumbnails to preview resources in the editor.
 *
 * @class PreviewRenderer
 */
function PreviewRenderer()
{
	/**
	 * WebGL renderer used to generate the preview.
	 *
	 * @attribute renderer
	 * @type {THREE.WebGLRenderer}
	 */
	this.renderer = new THREE.WebGLRenderer({alpha: true});
	this.renderer.setSize(128, 128);
	
	/**
	 * DOM canvas where the result is rendered to.
	 *
	 * @attribute canvas
	 * @type {Element}
	 */
	this.canvas = this.renderer.domElement;
	
	/**
	 * Scene to compose the render
	 *
	 * @attribute scene
	 * @type {THREE.Scene}
	 */
	this.scene = new THREE.Scene();
}

/**
 * Render the thumbnail to internal canvas and copy image to html image element.
 *
 * The result is returned in the onRender callback. Image data is passed as argument.
 *
 * @static
 * @method render
 * @param {Object} resource Resource to generate the preview.
 * @param {Function} onRender Callback method that receives Base64 encoded data with the thumbnail produced.
 */
PreviewRenderer.prototype.render = function(resource, onRender){};

/**
 * Set thumbnail renderer size.
 *
 * @method setSize
 * @param {number} x
 * @param {number} y
 */
PreviewRenderer.prototype.setSize = function(x, y)
{
	this.renderer.setSize(x, y);
};

/**
 * Render the thumbnail to internal canvas and copy image to html image element.
 *
 * The result is returned in the onRender callback. Image data is passed as argument.
 *
 * @method render
 * @param {Object} resource Resource to generate the preview.
 * @param {Function} onRender Callback method that receives Base64 encoded data with the thumbnail produced.
 */
PreviewRenderer.prototype.render = function(resource, onRender){};
