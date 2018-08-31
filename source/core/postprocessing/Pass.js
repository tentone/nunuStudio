"use strict";

/**
 * A render Pass is used to render something in the graphics pipeline.
 *
 * Can be used to render a scene, apply post processing effects, merge buffers,  etc.
 *
 * @class Pass
 * @module Postprocessing
 */

function Pass()
{
	this.uuid = THREE.Math.generateUUID();
	this.type = "Pass";

	/**
	 * If set to true, the pass is processed by the composer.
	 *
	 * @property enabled
	 * @type {Boolean}
	 */
	this.enabled = true;

	/**
	 * If set to true, the pass indicates to swap read and write buffer after rendering.
	 *
	 * @property needsSwap
	 * @type {Boolean}
	 */
	this.needsSwap = true;

	/**
	 * If set to true, the pass clears its buffer before rendering.
	 *
	 * @property clear
	 * @type {Boolean}
	 */
	this.clear = false;

	/**
	 * If set to true, the result of the pass is rendered to screen.
	 *
	 * @property renderToScreen
	 * @type {Boolean}
	 */
	this.renderToScreen = false;
}

/**
 * Set resolution of this render pass.
 * 
 * @method setSize
 * @param {Number} width
 * @param {Number} height
 */
Pass.prototype.setSize = function(width, height){};

/**
 * Render the scene using this render pass.
 *
 * @method render
 * @param {WebGLRenderer} renderer
 * @param {WebGLRenderTarget} writeBuffer Buffer to write output.
 * @param {WebGLRenderTarget} readBuffer Input buffer.
 * @param {Number} delta Delta time in milliseconds.
 * @param {Boolean} maskActive Not used in this pass.
 * @param {Scene} scene Scene to render.
 */
Pass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera){};

/**
 * Dispose this render pass.
 *
 * @method dispose
 */
Pass.prototype.dispose = function(){};

/**
 * Serialize pass to json.
 *
 * @method toJSON
 * @param {Object} meta Metadata object.
 */
Pass.prototype.toJSON = function(meta)
{
	var data = {};

	data.uuid = this.uuid;
	data.type = this.type;

	data.enabled = this.enabled;
	data.needsSwap = this.needsSwap;
	data.renderToScreen = this.renderToScreen;
	data.clear = this.clear;

	return data;
};
