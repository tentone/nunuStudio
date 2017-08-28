"use strict";

THREE.Camera.prototype.offset = new THREE.Vector2(0.0, 0.0);
THREE.Camera.prototype.viewport = new THREE.Vector2(1.0, 1.0);
THREE.Camera.prototype.clearColor = false;
THREE.Camera.prototype.clearDepth = false;
THREE.Camera.prototype.order = 0;

THREE.Camera.prototype.render = function(renderer, scene)
{
	renderer.render(scene, this);
};