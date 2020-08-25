import {OrthographicCamera as TOrthographicCamera, Object3D} from "three";
import {RenderPass} from "../../postprocessing/RenderPass.js";
import {EffectComposer} from "../../postprocessing/EffectComposer.js";
import {Scene} from "../Scene.js";
import {Viewport} from "./Viewport.js";

/**
 * Orthographic Camera is used for 2D like image projection.
 * 
 * Based on OrthographicCamera, original documentation available at https:// threejs.org/docs/index.html#Reference/Cameras/OrthographicCamera.
 * 
 * @class OrthographicCamera
 * @extends {OrthographicCamera}
 * @module Cameras
 * @param {number} size Camera size relative to resize mode
 * @param {number} aspect Aspect ratio X/Y
 * @param {number} mode Camera resize mode (RESIZE_HORIZONTAL or RESIZE_VERTICAL)
 * @param {number} near Near projection plane
 * @param {number} far Far projection plane
 */
function OrthographicCamera(size, aspect, mode, near, far)
{
	TOrthographicCamera.call(this, -1.0, 1.0, 1.0, -1.0, near, far);

	this.name = "camera";

	/**
	 * Camera size relative to resize mode.
	 * 
	 * @property size
	 * @default 10.0
	 * @type {number}
	 */
	this.size = size != undefined ? size : 10.0;

	/**
	 * Aspect ratio X/Y.
	 * 
	 * @property aspect
	 * @default 1.0
	 * @type {number}
	 */
	this.aspect = aspect != undefined ? aspect : 1.0;

	/**
	 * Camera resize mode.
	 * 
	 * @property mode
	 * @default RESIZE_HORIZONTAL
	 * @type {number}
	 */
	this.mode = mode !== undefined ? mode : OrthographicCamera.RESIZE_HORIZONTAL;

	/**
	 * Camera viewport indicates where the image is drawn on the screen.
	 * 
	 * @property viewport
	 * @type {Viewport}
	 */
	this.viewport = new Viewport();

	/**
	 * Clear screen color flag.
	 * 
	 * @property clearColor
	 * @default false
	 * @type {boolean}
	 */
	this.clearColor = true;

	/**
	 * Clear depth flag.
	 * 
	 * @property clearDepth
	 * @default false
	 * @type {boolean}
	 */
	this.clearDepth = true;

	/**
	 * Clear stencil buffer flag.
	 * 
	 * @property clearDepth
	 * @default false
	 * @type {boolean}
	 */
	this.clearStencil = true;

	/**
	 * Camera draw order preference.
	 * 
	 * If more than one camera has the same order value the draw order is undefined for those cameras.
	 * 
	 * @property order
	 * @default 0
	 * @type {number}
	 */
	this.order = 0;

	this.updateProjectionMatrix();
	
	/**
	 * Effect composed of this camera. Is used to render the scene to the screen and apply effects.
	 *
	 * It is inialized with a RenderPass attached to it.
	 * 
	 * @property composer
	 * @type {EffectComposer}
	 */
	this.composer = new EffectComposer();

	var renderPass = new RenderPass();
	renderPass.renderToScreen = true;
	this.composer.addPass(renderPass);
}

OrthographicCamera.prototype = Object.create(TOrthographicCamera.prototype);

/**
 * Used to set camera to resize horizontally 
 *
 * @attribute RESIZE_HORIZONTAL
 * @type {number}
 */
OrthographicCamera.RESIZE_HORIZONTAL = 0;

/**
 * Used to set camera to resize vertically.
 *  
 *
 * @attribute RESIZE_VERTICAL
 * @type {number}
 */
OrthographicCamera.RESIZE_VERTICAL = 1;

/**
 * Resize this camera, should be called every time after resizing the screen.
 *
 * Updates the viewport, rendering composer and the camera projection matrix.
 *
 * @method resize
 * @param {number} x Width of the screen.
 * @param {number} y Height of the screen.
 * @param {Viewport} viewport Viewport that encapsulates the viewport of the camera.
 */
OrthographicCamera.prototype.resize = function(x, y, viewport)
{
	this.viewport.width = x;
	this.viewport.height = y;
	this.viewport.update(viewport);

	this.aspect = this.viewport.getAspectRatio();
	this.updateProjectionMatrix();

	this.composer.setSize(this.viewport.viewport.z, this.viewport.viewport.w);
};

/**
 * Prepare the renderer to render the frame using the camera settings.
 *
 * Should be called before the render() method to setup clear configuration and viewport.
 *
 * @method setupRenderer
 * @param {WebGLRenderer} renderer WebGL renderer to configure.
 */
OrthographicCamera.prototype.setupRenderer = function(renderer)
{
	this.viewport.enable(renderer);
	renderer.clear(this.clearColor, this.clearDepth, this.clearStencil);
};

/**
 * Render a scene using this camera and the internal EffectComposer.
 *
 * @method render
 * @param {WebGLRenderer} renderer WebGL renderer to use.
 * @param {Scene} scene Scene to be rendered.
 */
OrthographicCamera.prototype.render = function(renderer, scene)
{
	this.composer.render(renderer, scene, this, 0.016);
};

/**
 * Destroy camera object and remove it from the scene.
 * 
 * @method destroy
 */
OrthographicCamera.prototype.destroy = function()
{
	var scene = this.getScene();
	if (scene !== null)
	{
		scene.removeCamera(this);
	}
	
	Object3D.prototype.destroy.call(this);
};

/**
 * Update camera projection matrix.
 * 
 * Also updates left right, top and bottom values from aspect and size.
 *
 * Should be called after chaging projection parameters.
 * 
 * @method updateProjectionMatrix
 */
OrthographicCamera.prototype.updateProjectionMatrix = function()
{
	if (this.mode === OrthographicCamera.RESIZE_HORIZONTAL)
	{
		this.top = this.size / 2;
		this.bottom = -this.top;
		this.right = this.top * this.aspect;
		this.left = -this.right;
	}
	else if (this.mode === OrthographicCamera.RESIZE_VERTICAL)
	{
		this.right = this.size / 2;
		this.left = -this.right;
		this.top = this.right / this.aspect;
		this.bottom = -this.top;
	}

	TOrthographicCamera.prototype.updateProjectionMatrix.call(this);
};

OrthographicCamera.prototype.toJSON = function(meta)
{
	var data = TOrthographicCamera.prototype.toJSON.call(this, meta);

	data.object.size = this.size;
	data.object.aspect = this.aspect;
	data.object.mode = this.mode;

	data.object.clearColor = this.clearColor;
	data.object.clearDepth = this.clearDepth;
	data.object.clearStencil = this.clearStencil;

	data.object.viewport = this.viewport.toJSON();
	
	data.object.order = this.order;
	data.object.composer = this.composer.toJSON();

	return data;
};
export {OrthographicCamera};
