"use strict";

function TreeUtils(){}

TreeUtils.compare = function(a, b)
{
	//TODO <ADD CODE HERE>
}

TreeUtils.test = function()
{
	//TODO <ADD CODE HERE>
}

function Tree()
{
	this.value = null;
	this.parent = null;
	this.children = [];
}

Tree.prototype.add = function(tree)
{
	if(tree instanceof Tree)
	{
		this.children.push(tree);
	}
}

Tree.prototype.remove = function(tree)
{
	if(tree instanceof Tree)
	{
		var index = this.children.indexOf(tree);
		if(index !== -1)
		{
			this.chilren.splice(index, 1);
		}
	}
}

