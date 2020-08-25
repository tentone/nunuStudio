import {Box3, Vector3} from "three";

THREE.Points.prototype.raycast = function(raycaster, intersects)
{
	if (this.geometry.boundingBox === null)
	{
		this.geometry.computeBoundingBox();
	}

	var box = new Box3();
	box.copy(this.geometry.boundingBox);
	box.applyMatrix4(this.matrixWorld);

	var point = raycaster.ray.intersectBox(box, new Vector3());

	if (point !== null)
	{
		intersects.push({object: this});
	}
};
