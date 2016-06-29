//Create Vector2 from JSON data
THREE.Vector2.fromJSON = function(data)
{
	return new THREE.Vector2(data.x, data.y);
}