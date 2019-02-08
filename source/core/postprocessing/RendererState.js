"use strict";

/**
 * Renderer state can be used to store and restore a renderer state between postprocessing passes.
 *
 * It stores the clean configurations of the renderer.
 *
 * @class RendererState
 */

//TODO <NOT USED>

function RendererState()
{
	//Auto clear configuration
	this.autoClear = false;
	this.autoClearColor = false;
	this.autoClearStencil = false;
	this.autoClearDepth = false;

	//Clear colors
	this.clearColor = new THREE.Color();
	this.clearAlpha = 1;

	//TODO <ADD CODE HERE>
}

/**
 * Store the renderer state.
 *
 * @method store
 * @param {THREE.WebGlRenderer} renderer
 */ 
RendererState.prototype.store = function(renderer)
{
	this.autoClear = renderer.autoClear;
	this.autoClearColor = renderer.autoClearColor;
	this.autoClearStencil = renderer.autoClearStencil;
	this.autoClearDepth = renderer.autoClearDepth;

	this.clearColor.copy(renderer.getClearColor());
	this.clearAlpha = renderer.getClearAlpha();

	//TODO <ADD CODE HERE>
};

/**
 * Restore the renderer state.
 *
 * @method restore
 * @param {THREE.WebGlRenderer} renderer
 */ 
RendererState.prototype.restore = function(renderer)
{
	renderer.autoClear = this.autoClear;
	renderer.autoClearColor = this.autoClearColor;
	renderer.autoClearStencil = this.autoClearStencil;
	renderer.autoClearDepth = this.autoClearDepth;

	renderer.setClearColor(this.clearColor);
	renderer.setClearAlpha(this.clearAlpha);

	//TODO <ADD CODE HERE>
};
