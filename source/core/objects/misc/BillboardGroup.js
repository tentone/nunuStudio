import {BufferGeometry, Mesh, MeshBasicMaterial} from "three";

/**
 * Object that makes it rotation be the same as the camera.
 *
 * It is rotated every frame before rendering to always face the camera direction.
 *
 * @class BillboardGroup
 * @extends {Mesh}
 */
function BillboardGroup()
{
	Mesh.call(this, new BufferGeometry(), new MeshBasicMaterial({depthWrite: false, colorWrite: false}));

	this.name = "billboard";
	this.type = "BillboardGroup";
}

BillboardGroup.prototype = Object.create(Mesh.prototype);
BillboardGroup.prototype.constructor = BillboardGroup;

BillboardGroup.prototype.isScene = true;

BillboardGroup.prototype.onBeforeRender = function(renderer, scene, camera, geometry, material, group)
{
	var quaternion = new THREE.Quaternion();
	camera.getWorldQuaternion(quaternion);
	this.quaternion.copy(quaternion);
};

export {BillboardGroup};
