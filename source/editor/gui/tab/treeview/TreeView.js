"use strict";

function TreeView(parent, closeable, container, index)
{	
	TabElement.call(this, parent, closeable, container, index, "Project Explorer", Editor.filePath + "icons/misc/menu.png");

	this.element.style.overflow = "auto";
	this.element.style.display = "block";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	this.program = null;

	this.root = null;
}

TreeView.prototype = Object.create(TabElement.prototype);

TreeView.prototype.attach = function(program)
{	
	if(this.program === program)
	{
		return;
	}

	this.program = program;

	//Destroy old root object
	if(this.root !== null)
	{
		this.root.destroy();
		this.root = null;
	}
};

TreeView.prototype.updateObjectNames = function()
{

	//TODO
};

TreeView.prototype.addObject = function(object, parent, index)
{
	/*
	var to = diffs[i].to;
	var length = to.length;
	var tree = this.root;
	var object = this.program;

	for(var j = 0; j < length - 1; j++)
	{
		tree = tree.children[to[j]];
		object = object.children[to[j]];
	}

	object = object.children[to[length - 1]];

	//Create object and children
	var element = tree.insertObject(object, to[length - 1]);
	for(var k = 0; k < object.children.length; k++)
	{
		insertObject(element, object.children[k]);
	}

	//Auxiliar method to insert object recursivelly
	function insertObject(parent, object)
	{
		var element = parent.addObject(object);

		for(var k = 0; k < object.children.length; k++)
		{
			insertObject(element, object.children[k]);
		}
	}
	*/
};

TreeView.prototype.traverse = function(callback)
{
	function traverse(node, callback)
	{
		callback(node);
		for(var i = 0; i < node.children.length; i++)
		{
			traverse(node.children[i], callback);
		}
	}

	traverse(this.root, callback); 
};

TreeView.prototype.removeObject = function(object, parent)
{
	var parentNode = null;

	this.traverse(function(node)
	{
		if(node.uuid === parent.uuid)
		{
			parentNode = node;
		}
	});

	var node = parentNode.removeElementUUID(object.uuid);

	if(node !== null)
	{
		node.destroy();	
	}
	else
	{
		console.warn("nunuStudio: Failed to remove node from treeview.", object, parent, node, parentNode);
	}
};

TreeView.prototype.moveObject = function(object, oldParent, newParent, index)
{
	this.removeObject(object, oldParent);
	this.addObject(object, newParent, index);
};

TreeView.prototype.updateObjectsView = function(changes)
{
	/*if(this.root !== null)
	{
		var diffs = TreeUtils.compare(this.root, this.program, diffs);

		console.log(diffs);

		for(var i = 0; i < diffs.length; i++)
		{
			//Added
			if(diffs[i].status === TreeUtils.DIFF_ADDED)
			{
				var to = diffs[i].to;
				var length = to.length;
				var tree = this.root;
				var object = this.program;

				for(var j = 0; j < length - 1; j++)
				{
					tree = tree.children[to[j]];
					object = object.children[to[j]];
				}

				object = object.children[to[length - 1]];

				//Create object and children
				var element = tree.insertObject(object, to[length - 1]);
				for(var k = 0; k < object.children.length; k++)
				{
					insertObject(element, object.children[k]);
				}

				//Auxiliar method to insert object recursivelly
				function insertObject(parent, object)
				{
					var element = parent.addObject(object);

					for(var k = 0; k < object.children.length; k++)
					{
						insertObject(element, object.children[k]);
					}
				}
			}
			//Removed
			else if(diffs[i].status === TreeUtils.DIFF_REMOVED)
			{
				var from = diffs[i].from;
				var length = from.length;
				var tree = this.root;

				for(var j = 0; j < length - 1; j++)
				{
					tree = tree.children[from[j]];
				}

				tree.removeElementIndex(from[length - 1]).destroy();
			}
			//Moved
			else if(diffs[i].status === TreeUtils.DIFF_MOVED)
			{
				//Remove element
				var from = diffs[i].from;
				var fromLength = from.length;
				var fromTree = this.root;

				for(var j = 0; j < fromLength - 1; j++)
				{
					fromTree = fromTree.children[from[j]];
				}

				//Insert in new position
				var to = diffs[i].to;
				var toLength = to.length;
				var toTree = this.root;

				for(var j = 0; j < toLength - 1; j++)
				{
					toTree = toTree.children[to[j]];
				}

				//Remove and re-insert
				var element = fromTree.removeElementIndex(from[fromLength - 1]);
				toTree.insertElementIndex(element, to[toLength - 1]);
			}
		}
	}
	else
	{
		this.createProgramTree();
	}*/

	this.createProgramTree();
	this.updateChildPosition();
};

TreeView.prototype.createProgramTree = function()
{
	//Fill tree roo with objects (recursive)
	function fillTree(root, object)
	{
		var element = root.addObject(object);

		for(var i = 0; i < object.children.length; i++)
		{
			fillTree(element, object.children[i]);
		}
	}

	if(this.root !== null)
	{
		this.root.destroy();
	}

	this.root = new TreeElement(this);
	this.root.attach(this.program);

	for(var i = 0; i < this.program.children.length; i++)
	{
		fillTree(this.root, this.program.children[i]);
	}
};

//Update which object is currently selected
TreeView.prototype.updateSelection = function()
{
	//Update treeview to highlight the selected object recursive
	function updateSelection(tree)
	{
		tree.element.style.backgroundColor = Editor.isObjectSelected(tree.obj) ? Editor.theme.buttonOverColor : Editor.theme.buttonLightColor;

		var children = tree.children;
		for(var i = 0; i < children.length; i++)
		{
			updateSelection(children[i]);
		}
	}

	if(this.root !== null)
	{
		updateSelection(this.root);
	}
};

//Update tree view children positions
TreeView.prototype.updateChildPosition = function()
{
	//Update childs position (recursive)
	function updateChildPosition(parent, position, level, folded)
	{
		var children = parent.children;
		var length = parent.children.length;

		for(var i = 0; i < length; i++)
		{
			var element = children[i];

			if(folded || TreeView.checkParentFolded(parent))
			{
				element.setVisibility(false);
				folded = true;
			}
			else
			{
				element.visible = true;
				element.position.set(0, position);
				element.level = level;
				element.updateInterface();
	 
				folded = false;
				position += 20;
			}

			if(element.children.length > 0)
			{
				position = updateChildPosition(children[i], position, level + 1, folded);
			}
		}

		return position;
	}

	this.root.updateInterface();
	this.size.y = updateChildPosition(this.root, 20, 1, this.root.folded);
};

//Update division Size
TreeView.prototype.updateSize = function()
{
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
	
	if(this.root !== null)
	{
		this.root.updateInterface();
	}
};

//Check if parent if folded (recursive)
TreeView.checkParentFolded = function(element)
{
	if(element.parent === null)
	{
		return false;
	}

	if(element.folded)
	{
		return true;
	}

	return TreeView.checkParentFolded(element.parent);
};
