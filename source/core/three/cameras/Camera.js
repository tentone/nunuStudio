import {Camera} from "three";

Camera.prototype.render = function(renderer, scene)
{
	renderer.render(scene, this);
};
