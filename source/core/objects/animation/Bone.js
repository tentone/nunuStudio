"use strict";

//Bone
function Bone()
{
	THREE.Bone.call(this);

	this.name = "bone";
}

Bone.prototype = Object.create(THREE.Bone.prototype);
