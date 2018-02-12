"use strict";

/**
 * Tree structure used to represent Trees.
 *
 * Every tree stores Trees as children and have a parent children.
 *
 * If the parent is null then the Tree is the root.
 *
 * @class Tree
 */
function Tree(value)
{
	this.value = (value !== undefined) ? value : null;
	
	this.uuid = THREE.Math.generateUUID();
	this.parent = null;
	this.children = [];
}

/**
 * Add new element to tree.
 *
 * @method add
 * @param {Object} tree Object to be added to the three, if object is not a tree a new tree is created automatically.
 */
Tree.prototype.add = function(tree)
{
	if(tree instanceof Tree)
	{
		this.children.push(tree);
		tree.parent = this;
		return tree;
	}
	else
	{
		var tree = new Tree(tree);
		tree.parent = this;
		this.children.push(tree);
		return tree;
	}	
};

/**
 * Remove element from tree.
 *
 * @method remove
 * @param {Tree} tree Element to be removed from the three
 */
Tree.prototype.remove = function(tree)
{
	var uuid = tree.uuid;

	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].uuid === uuid)
		{
			this.children.splice(i, 1);
			return;
		}
	}
};

/**
 * Clone tree recursively.
 *
 * The cloned tree has the same UUID.
 *
 * @method clone
 * @return {Tree} Cloned tree.
 */
Tree.prototype.clone = function()
{
	var tree = new Tree();
	tree.uuid = this.uuid;
	tree.value = this.value;

	for(var i = 0; i < this.children.length; i++)
	{
		tree.add(this.children[i].clone());
	}

	return tree;
};

/**
 * Print tree into console, recursively.
 *
 * @method print
 * @param {Number} level Recursive parameter, not required.
 */
Tree.prototype.print = function(level)
{
	if(level === undefined)
	{
		level = 1;
	}

	var space = "";
	for(var i = level - 1; i > 0; i--)
	{
		space += "----";
	}
	space += "--->";

	for(var i = 0; i < this.children.length; i++)
	{
		console.log(space + this.children[i].value + "(" + this.children[i].uuid + ")");
		this.children[i].print(level + 1);
	}
};
