//Create Vector3 from JSON data
THREE.Vector3.fromJSON = function(data)
{
	return new THREE.Vector3(data.x, data.y, data.z);
}