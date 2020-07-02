import {Camera} from "three";

THREE.Camera.prototype.render = function(renderer, scene)
{
	renderer.render(scene, this);
};
