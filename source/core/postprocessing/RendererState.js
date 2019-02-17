"use strict";

//TODO <NOT USED>

/**
 * Renderer state can be used to store and restore a renderer state between postprocessing passes.
 *
 * It stores the clean configurations of the renderer.
 *
 * @class RendererState
 */
function RendererState()
{
	this.autoClear = false;
	this.autoClearColor = false;
	this.autoClearStencil = false;
	this.autoClearDepth = false;

	this.clearColor = new THREE.Color();
	this.clearAlpha = 1;
}

/**
 * Store the renderer state.
 *
 * @method backup
 * @param {THREE.WebGlRenderer} renderer
 */ 
RendererState.prototype.backup = function(renderer)
{
	this.autoClear = renderer.autoClear;
	this.autoClearColor = renderer.autoClearColor;
	this.autoClearStencil = renderer.autoClearStencil;
	this.autoClearDepth = renderer.autoClearDepth;

	this.clearColor.copy(renderer.getClearColor());
	this.clearAlpha = renderer.getClearAlpha();
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
};
