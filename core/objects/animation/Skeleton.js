function Skeleton(bones, boneInverses, useVertexTexture)
{
	THREE.Skeleton.call(this, bones, boneInverses, useVertexTexture);

	this.name = "skeleton";
}

Skeleton.prototype = Object.create(THREE.Skeleton.prototype);
Skeleton.prototype.icon = "editor/files/icons/animation/skeleton.png";

Skeleton.prototype.update = update;
Skeleton.prototype.initialize = initialize;

//Initialize Skeleton
function initialize(){}

//Update Skeleton
function update(){}