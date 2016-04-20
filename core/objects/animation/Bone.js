function Bone()
{
	THREE.Bone.call(this);

	this.name = "bone";
}

Bone.prototype = Object.create(THREE.Bone.prototype);
Bone.prototype.icon = "editor/files/icons/animation/bone.png";

Bone.prototype.update = update;
Bone.prototype.initialize = initialize;

//Initialize Bone
function initialize(){}

//Update Bone
function update(){}