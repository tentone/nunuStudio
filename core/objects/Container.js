"use strict";

//Container constructor
function Container()
{
	THREE.Object3D.call(this);

	this.name = "container";
	this.type = "Group";
}

//Super prototype
Container.prototype = Object.create(THREE.Object3D.prototype);
