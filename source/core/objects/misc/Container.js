"use strict";

/**
 * Containers are used to group objects together.
 *
 * They are not drawn in the scene are just used as logic containers.
 * 
 * @class Container
 * @extends {Group}
 * @module Misc
 */
function Container()
{
	THREE.Group.call(this);

	this.name = "container";
	this.type = "Group";
}

Container.prototype = Object.create(THREE.Group.prototype);
