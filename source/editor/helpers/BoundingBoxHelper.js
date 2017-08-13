"use strict";

function BoundingBoxHelper(object, hex)
{
	THREE.Mesh.call(this, new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshBasicMaterial(
	{
		color: (hex !== undefined) ? hex : 0x888888,
		wireframe: true
	}));

	this.object = object;

	this.box = new Box3();
	this.update();
}

BoundingBoxHelper.prototype = Object.create(Mesh.prototype);

BoundingBoxHelper.prototype.update = function()
{
	this.box.setFromObject(this.object);
	this.box.getSize(this.scale);
	this.box.getCenter(this.position);
};
