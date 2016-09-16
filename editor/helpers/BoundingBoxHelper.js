"use strict";

function BoundingBoxHelper(object, hex)
{
	var color = (hex !== undefined) ? hex : 0x888888;

	this.object = object;
	this.box = new Box3();

	Mesh.call(this, new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: color, wireframe: true}));
}

BoundingBoxHelper.prototype = Object.create(Mesh.prototype);

BoundingBoxHelper.prototype.update = function()
{
	this.box.setFromObject(this.object);
	this.box.getSize(this.scale);
	this.box.getCenter(this.position);
}
