"use strict";

// TODO <ADD CODE HERE>
/**
 * Render target textures are used to store render results obtained from cameras.
 *
 * @class RenderTargetTexture
 * @constructor
 */
function RenderTargetTexture(width, height, options)
{
	THREE.WebGLRenderTarget.call(this, width, height, options);
}
