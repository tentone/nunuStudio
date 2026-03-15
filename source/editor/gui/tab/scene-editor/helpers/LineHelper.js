import {Line, Color} from "three";

/** 
 * Line helper is used to preview Line objects.
 * 
 * @class LineHelper
 * @param {Line} object
 * @param {number} hex Helper color in hexadecimal.
 */
class LineHelper extends Line {
	constructor(object, hex) {
	super(object.geometry, object.material.clone());

	this.material.color = new Color(hex !== undefined ? hex : 0xFFFF00);
	
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
export {LineHelper};
