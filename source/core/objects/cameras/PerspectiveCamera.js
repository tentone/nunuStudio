"use strict";

/**
 * Perspective camera, used for 3D scenes with objects getting smaller as they get away from the camera.
 * 
 * Based on THREE.PerspectiveCamera, original documentation available at https://threejs.org/docs/index.html#Reference/Cameras/PerspectiveCamera.
 * 
 * @class PerspectiveCamera
 * @extends {PerspectiveCamera}
 * @module Cameras
 * @constructor
 * @param {Number} fov Field of view
 * @param {Number} aspect Aspect ratio
 * @param {Number} near Near projection plane (how closer can be objects visible by this camera)
 * @param {Number} far Far projection plane (how far can be objects visible by this camera)
 */

/**
 * Camera field of view in degrees.
 * 
 * @property fov
 * @default 50
 * @type {Number}
 */
/**
 * Camera aspect ratio X/Y.
 * 
 * @property aspect
 * @default 1.0
 * @type {Number}
 */
/**
 * Camera zoom.
 * 
 * @property zoom
 * @default 1.0
 * @type {Number}
 */
/**
 * Camera viewport offset.
 * 
 * Values range from 0.0 to 1.0 in screen space.
 * 
 * @property offset
 * @type {Vector2}
*/
/**
 * Camera viewport size.
 * 
 * Values range from 0.0 to 1.0 in screen space.
 * 
 * @property viewport
 * @type {Vector2}
*/
/**
 * Clear screen color flag.
 * 
 * @property clearColor
 * @default false
 * @type {boolean}
*/
/**
 * Clear depth flag.
 * 
 * @property clearDepth
 * @default false
 * @type {boolean}
*/
/**
 * Camera draw order preference.
 * 
 * If more than one camera has the same order value the draw order is undefined for those cameras.
 * 
 * @property order
 * @default 0
 * @type {Number}
*/
function PerspectiveCamera(fov, aspect, near, far)
{
	THREE._PerspectiveCamera.call(this, fov, aspect, near, far);

	this.name = "camera";

	this.offset = new THREE.Vector2(0.0, 0.0);
	this.viewport = new THREE.Vector2(1.0, 1.0);
	this.clearColor = false;
	this.clearDepth = false;
	this.order = 0;

	//Render pass
	var renderPass = new RenderPass();

	//Unreal bloom
	var bloomPass = new UnrealBloomPass(0.8, 0.3, 0.8);
	bloomPass.renderToScreen = true;

	this.composer = new EffectComposer();
	this.composer.addPass(renderPass);
	this.composer.addPass(bloomPass);
}

THREE._PerspectiveCamera = THREE.PerspectiveCamera;
THREE.PerspectiveCamera = PerspectiveCamera;

PerspectiveCamera.prototype = Object.create(THREE._PerspectiveCamera.prototype);

PerspectiveCamera.prototype.render = function(renderer, scene)
{
	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	//Render pass
	//var renderPass = new THREE.RenderPass(scene, this);
	//renderPass.renderToScreen = false;

	//FXAA
	/*var fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
	fxaaPass.uniforms["resolution"].value.set(1 / width, 1 / height);
	fxaaPass.renderToScreen = false;*/

	//Bokeh Depth of field
	/*
	var bokehPass = new THREE.BokehPass(scene, this,
	{
		focus: 1,
		aperture: 0.02,
		maxblur: 0.01
	});
	bokehPass.renderToScreen = true;
	*/

	//Scalable Ambient Occlusion
	/*
	var saoPass = new THREE.SAOPass(scene, this, false, true);
	saoPass.params =
	{
		output: THREE.SAOPass.OUTPUT.Default, //Beauty | SAO | Depth | Normal
		saoBias: 0.1,
		saoIntensity: 0.1,
		saoScale: 20,
		saoKernelRadius: 10,
		saoMinResolution: 0,
		saoBlur: true,
		saoBlurRadius: 12,
		saoBlurStdDev: 4,
		saoBlurDepthCutoff: 0.01
	};
	saoPass.setSize(width, height);
	saoPass.renderToScreen = false;
	*/

	//Unreal bloom
	//var bloomPass = new UnrealBloomPass(undefined, 1.4, 0.4, 0.7);
	//bloomPass.renderToScreen = true;

	//Screen space ambient occlusion
	/*var ssaoPass = new THREE.SSAOPass(scene, this, width, height);
	ssaoPass.radius = 0.2;
	ssaoPass.onlyAO = true;
	ssaoPass.aoClamp = 0.25;
	ssaoPass.lumInfluence = 0.7;
	ssaoPass.renderToScreen = true;*/

	//Copy shader
	//var copyPass = new THREE.ShaderPass(THREE.CopyShader);
	//copyPass.renderToScreen = true;

	this.composer.render(renderer, scene, this, 0.016);
};

PerspectiveCamera.prototype.resize = function(x, y)
{
	this.composer.setSize(x, y);
	
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].resize(x, y);
	}
};

/**
 * Destroy camera object and remove it from the scene.
 * 
 * @method destroy
 */
PerspectiveCamera.prototype.destroy = function()
{
	var scene = ObjectUtils.getScene(this);
	if(scene !== null)
	{
		scene.removeCamera(this);
	}
	
	THREE.Object3D.prototype.destroy.call(this);
};

/**
 * Update camera projection matrix.
 * 
 * Should be called after chaging projection parameters.
 * 
 * @method updateProjectionMatrix
 */
PerspectiveCamera.prototype.updateProjectionMatrix = function()
{
	var top = this.near * Math.tan(THREE.Math.DEG2RAD * 0.5 * this.fov ) / this.zoom;
	var height = 2 * top;
	var width = this.aspect * height * ((this.viewport !== undefined) ? (this.viewport.x / this.viewport.y) : 1.0);
	var left = -0.5 * width;

	if(this.filmOffset !== 0)
	{
		left += this.near * this.filmOffset / this.getFilmWidth();
	}

	this.projectionMatrix.makePerspective(left, left + width, top, top - height, this.near, this.far);
};

/**
 * Serialize object to JSON.
 * 
 * @method toJSON
 * @param  {Object} meta
 * @return {Object} JSON descrition
 */
PerspectiveCamera.prototype.toJSON = function(meta)
{
	var data = THREE._PerspectiveCamera.prototype.toJSON.call(this, meta);

	data.object.clearColor = this.clearColor;
	data.object.clearDepth = this.clearDepth;
	data.object.viewport = this.viewport.toArray();
	data.object.offset = this.offset.toArray();
	data.object.order = this.order;
	
	return data;
};
