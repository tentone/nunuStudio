"use strict";

//TODO <THIS IS NOT USED>

function CompressedGeometry()
{
	THREE.BufferGeometry.call(this);

	this.type = "CompressedGeometry";
}

CompressedGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
