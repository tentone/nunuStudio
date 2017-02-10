"use strict";

/**
 * Containers are used to group objects together
 * @class Container
 * @constructor
 * @extends {Object3D}
 * @module Misc
 */
function Container()
{
	THREE.Object3D.call(this);

	this.name = "container";
	this.type = "Group";
}

Container.prototype = Object.create(THREE.Object3D.prototype);
