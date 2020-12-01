import {Group as TGroup} from "three";

/**
 * Object that makes it rotation be the same as the camera.
 *
 * It is rotated every frame before rendering to always face the camera direction.
 *
 * @class BillboardGroup
 * @extends {THREE.Group}
 */
function BillboardGroup()
{
	TGroup.call(this);

	this.name = "container";
	this.type = "Group";
}

BillboardGroup.prototype = Object.create(TGroup.prototype);
BillboardGroup.prototype.constructor = BillboardGroup;

BillboardGroup.prototype.onBeforeRender = function(renderer, scene, camera, geometry, material, group)
{
	var temp = new THREE.Quaternion();
	camera.getWorldQuaternion(temp);
	this.quaternion.copy(temp);
};

export {BillboardGroup};
