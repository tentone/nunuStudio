import {Object3D, Mesh, MeshBasicMaterial} from "three";

/** 
 * Wireframe helper is used to preview drawable objects.
 * 
 * Every line is drawn individually, usefull to analyse the geometry in detail.
 *
 * @class WireframeHelper
 * @param {Object3D} object
 * @param {number} hex Helper color in hexadecimal.
 */
class WireframeHelper extends Mesh {
	constructor(object, hex) {
	super(object.geometry, new MeshBasicMaterial(
		{
			color: hex !== undefined ? hex : 0xFFFFFF,
			wireframe: true
		}));

	/**
	 * Object attached to the helper
	 *
	 * @attribute object
	 * @type {Object3D}
	 */
	this.object = object;
	
	this.matrixAutoUpdate = false;
	this.update();
	}

	update() {
	this.geometry = this.object.geometry;
	this.matrix.copy(this.object.matrixWorld);
	}

}
export {WireframeHelper};
