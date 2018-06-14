"use strict";

function CompressedGeometry()
{
	THREE.BufferGeometry.call(this);

	this.type = "CompressedGeometry";
}

CompressedGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
