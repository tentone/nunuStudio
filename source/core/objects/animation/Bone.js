"use strict";

//Bone
function Bone()
{
	THREE.Bone.call(this);

	this.name = "bone";
}

//Super prototype
Bone.prototype = Object.create(THREE.Bone.prototype);
