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

//Attach a program to the tree view
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

	//Create program tree
	this.createProgramTree();
	this.updateChildPosition();
};

//Traverse the tree view nodes
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

TreeView.prototype.addObject = function(object, parent, index)
{
	var parentNode = null;
	this.traverse(function(node)
	{
		if(node.uuid === parent.uuid)
		{
			parentNode = node;
		}
	});

	//Create object and children
	var element = parentNode.insertObject(object, index);
	for(var k = 0; k < object.children.length; k++)
	{
		insertObject(element, object.children[k]);
	}

	this.updateChildPosition();

	//Auxiliar method to insert object recursivelly
	function insertObject(parent, object)
	{
		var element = parent.addObject(object);

		for(var k = 0; k < object.children.length; k++)
		{
			insertObject(element, object.children[k]);
		}
	}
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

	this.updateChildPosition();
};

TreeView.prototype.moveObject = function(object, oldParent, newParent, index)
{
	this.removeObject(object, oldParent);
	this.addObject(object, newParent, index);
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
		tree.element.style.backgroundColor = Editor.isObjectSelected(tree.object) ? Editor.theme.buttonOverColor : Editor.theme.buttonLightColor;

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
	//Check if parent if folded (recursive)
	function checkParentFolded(element)
	{
		if(element.parent === null)
		{
			return false;
		}

		if(element.folded === true)
		{
			return true;
		}

		return checkParentFolded(element.parent);
	}

	//Update childs position (recursive)
	function updateChildPosition(parent, position, level, folded)
	{
		var children = parent.children;
		var length = parent.children.length;

		for(var i = 0; i < length; i++)
		{
			var element = children[i];

			if(folded || checkParentFolded(parent))
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
