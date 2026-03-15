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
class Group extends TGroup
{
	constructor()
	{
		super();

		this.name = "group";
		this.type = "Group";
	}
}

export {Group};
