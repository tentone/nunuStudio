import {CSM} from "three/examples/jsm/csm/CSM";
import {DirectionalLight, Object3D} from "three";

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
}

DirectionalLightCSM.prototype = Object.create(Object3D.prototype);

export {DirectionalLightCSM};
