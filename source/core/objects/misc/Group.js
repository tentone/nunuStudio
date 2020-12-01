import {Group as TGroup} from "three";

/**
 * Groups are used to group objects together.
 *
 * They are not drawn in the scene are just used as logic containers.
 *
 * @class Group
 * @extends {Group}
 * @module Misc
 */
function Group()
{
	TGroup.call(this);

	this.name = "group";
	this.type = "Group";
}

Group.prototype = Object.create(TGroup.prototype);
Group.prototype.constructor = Group;

export {Group};
