import {Mesh, PlaneBufferGeometry, MeshBasicMaterial, DoubleSide} from "three";

/**
 * Helper to visualizer rect aread lights.
 *
 * @class RectAreaLightHelper
 */
function RectAreaLightHelper(object) 
{
	Mesh.call(this, new PlaneBufferGeometry(1, 1), new MeshBasicMaterial({side: DoubleSide}));

	/**
	 * Object attached to the helper
	 *
	 * @attribute object
	 * @type {Object3D}
	 */
	this.object = object;

	this.update();
}

RectAreaLightHelper.prototype = Object.create(Mesh.prototype);

RectAreaLightHelper.prototype.update = function()
{
	this.material.color.copy(this.object.color).multiplyScalar(this.object.intensity);

	this.object.getWorldPosition(this.position);
	this.object.getWorldQuaternion(this.quaternion);

	this.scale.set(this.object.width, this.object.height, 1);
};
export {RectAreaLightHelper};
