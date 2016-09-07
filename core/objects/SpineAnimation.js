"use strict";

function SpineAnimation()
{
	spine.threejs.SkeletonMesh.call(this);

	this.data = null; //Spite json data
	this.atlas = null; //Atlas data

	this.name = "spine";
	this.type = "SpineAnimation";

	this.receiveShadow = true;
	this.castShadow = true;

	this.clock = THREE.Clock();
}

SpineAnimation.prototype = Object.create(spine.threejs.SkeletonMesh.prototype);

SpineAnimation.prototype.update = function()
{
	spine.threejs.SkeletonMesh.update.call(this, this.clock.getDelta());

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

SpineAnimation.prototype.toJSON = function()
{
	//TODO <ADD CODE HERE>
}