import {CSM} from "three/examples/jsm/csm/CSM";
import {DirectionalLight, Object3D} from "three";
import { runInThisContext } from "vm";

/**
 * A light that gets emitted in a specific direction and has a cascaded shadow map set.
 * 
 * Allows to project shadows over large distances by spliting the shadow frustum sections into multiple shadow maps with diferent resolution.
 * 
 * @class DirectionalLightCSM
 * @extends {Object3D}
 * @module Lights
 */
function DirectionalLightCSM()
{
	Object3D.call(globalThis);

	this.name = "directional";
	this.type = "DirectionalLightCSM";

	this.shadowMapSize = 1024;

	this.lightDirection = new THREE.Vector3(1, 1, 1).normalize();

	this.mode = "pratical";

	this.cascades = 4;
	
	this.maxFar = 1000;

	this.fade = false;

	this.csm = new CSM({
		fade: this.fade,
		maxFar: this.maxFar,
		cascades: this.cascades,
		mode: this.mode,
		parent: this,
		shadowMapSize: this.shadowMapSize,
		lightDirection: this.lightDirection
	});
}

DirectionalLightCSM.prototype = Object.create(Object3D.prototype);

DirectionalLight.prototype.onBeforeRender = function(renderer, scene, camera, geometry, material, group)
{
	if (this.csm.camera !== camera) 
	{
		this.csm.camera = camera;
		this.csm.updateFrustums();
	}

	this.csm.update();
};

export {DirectionalLightCSM};
