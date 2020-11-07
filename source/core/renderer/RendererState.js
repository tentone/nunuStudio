import {Color, WebGLRenderer} from "three";

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

	this.sortObjects = true;

	this.clearColor = new Color();
	this.clearAlpha = 1;
}

/**
 * Store the renderer state.
 *
 * @method backup
 * @param {WebGLRenderer} renderer
 */
RendererState.prototype.backup = function(renderer)
{
	this.autoClear = renderer.autoClear;
	this.autoClearColor = renderer.autoClearColor;
	this.autoClearStencil = renderer.autoClearStencil;
	this.autoClearDepth = renderer.autoClearDepth;

	this.sortObjects = renderer.sortObjects;

	this.clearColor.copy(renderer.getClearColor());
	this.clearAlpha = renderer.getClearAlpha();
};

/**
 * Restore the renderer state.
 *
 * @method restore
 * @param {WebGLRenderer} renderer
 */
RendererState.prototype.restore = function(renderer)
{
	renderer.autoClear = this.autoClear;
	renderer.autoClearColor = this.autoClearColor;
	renderer.autoClearStencil = this.autoClearStencil;
	renderer.autoClearDepth = this.autoClearDepth;

	renderer.sortObjects = this.sortObjects;

	renderer.setClearColor(this.clearColor);
	renderer.setClearAlpha(this.clearAlpha);
};

export {RendererState};
