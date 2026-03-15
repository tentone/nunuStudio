import {Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide} from "three";

/**
 * Helper to visualizer rect aread lights.
 *
 * @class RectAreaLightHelper
 */
class RectAreaLightHelper extends Mesh {
	constructor(object) {
	super(new PlaneGeometry(1, 1), new MeshBasicMaterial({side: DoubleSide}));

	/**
	 * Object attached to the helper
	 *
	 * @attribute object
	 * @type {Object3D}
	 */
	this.object = object;

	this.update();
	}

	update() {
	this.material.color.copy(this.object.color).multiplyScalar(this.object.intensity);

	this.object.getWorldPosition(this.position);
	this.object.getWorldQuaternion(this.quaternion);

	this.scale.set(this.object.width, this.object.height, 1);
	}

}
export {RectAreaLightHelper};
