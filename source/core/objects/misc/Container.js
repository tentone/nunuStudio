"use strict";

/**
 * Containers are used to group objects together.
 * 
 * @class Container
 * @constructor
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
