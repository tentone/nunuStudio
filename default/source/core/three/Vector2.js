"use strict";

//Create Vector2 from JSON data
THREE.Vector2.fromJSON = function(data)
{
	return new THREE.Vector2(data.x, data.y);
}

//Serialize to JSON
THREE.Vector2.prototype.toJSON = function()
{
	return {x: this.x, y: this.y};
}