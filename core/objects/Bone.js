"use strict";

//Bone constructor
function Bone()
{
	THREE.Bone.call(this);

	this.name = "bone";
}

//Bone Methods
Bone.prototype = Object.create(THREE.Bone.prototype);
