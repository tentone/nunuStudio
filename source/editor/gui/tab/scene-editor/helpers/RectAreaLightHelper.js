"use strict";

/**
 * Helper to visualizer rect aread lights.
 *
 * @class RectAreaLightHelper
 */
function RectAreaLightHelper(object) 
{
	THREE.Mesh.call(this, new THREE.PlaneBufferGeometry(1, 1), new THREE.MeshBasicMaterial({side: THREE.DoubleSide}));

	/**
	 * Object attached to the helper
	 *
	 * @attribute object
	 * @type {Object3D}
	 */
	this.object = object;

	this.update();
}

RectAreaLightHelper.prototype = Object.create(THREE.Mesh.prototype);

RectAreaLightHelper.prototype.update = function()
{
	this.material.color.copy(this.object.color).multiplyScalar(this.object.intensity);

	this.object.getWorldPosition(this.position);
	this.object.getWorldQuaternion(this.quaternion);

	this.scale.set(this.object.width, this.object.height, 1);
};