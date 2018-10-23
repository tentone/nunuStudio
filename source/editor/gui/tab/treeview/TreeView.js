"use strict";

/**
 * TreeView component is used to represent a object tree.
 *
 * Each tree entry represents direclty a Object3D object present in the editor.
 * 
 * @class TreeView
 * @extends {TabElement}
 * @param {Element} parent Parent element.
 * @param {Boolean} closeable If the tab is closeable.
 * @param {TabGroup} container The container where this tab is inserted.
 * @param {Number} index Index inside the container button array.
 */
function TreeView(parent, closeable, container, index)
{	
	TabElement.call(this, parent, closeable, container, index, "Project Explorer", Editor.filePath + "icons/misc/menu.png");

	this.element.style.overflow = "auto";
	this.element.style.backgroundColor = null;

	this.program = null;
	this.root = null;
}

TreeView.prototype = Object.create(TabElement.prototype);

/**
 * Attach a program to the tree view.
 *
 * @method attach
 */
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
	this.buildTree();
	this.updateChildPosition();
};

/**
 * Traverse the whole tree view and call the callback method.
 * 
 * The callback method receives the object attached to the tree and the depth.
 * 
 * @method traverse
 * @param {Function} callback Callback function(treeNode)
 */
TreeView.prototype.traverse = function(callback)
{
	function traverse(node)
	{
		callback(node);

		for(var i = 0; i < node.children.length; i++)
		{
			traverse(node.children[i]);
		}
	}

	traverse(this.root); 
};

/**
 * Add new object to a parent in a specific position.
 * 
 * @method addObject
 * @param {THREE.Object3D} object New object to add to the tree.
 * @param {THREE.Object3D} parent Parent to insert the object.
 * @param {Number} index Index to insert the object.
 */
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

/**
 * Remove a object from the treeview.
 * 
 * @method removeObject
 * @param {THREE.Object3D} object Object to be removed from the tree.
 * @param {THREE.Object3D} parent Parent object.
 */
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

/**
 * Move object in the tree, from a position to another position and parent.
 * 
 * @method addObject
 * @param {THREE.Object3D} object New object to add to the tree.
 * @param {THREE.Object3D} oldParent Old parent to remove the object from.
 * @param {THREE.Object3D} newParent New parent to insert the object into.
 * @param {Number} index New index to insert the object.
 */
TreeView.prototype.moveObject = function(object, oldParent, newParent, index)
{
	this.removeObject(object, oldParent);
	this.addObject(object, newParent, index);
	this.updateChildPosition();
};

/**
 * Fill the tree view with the attached object children.
 * 
 * @method buildTree
 */
TreeView.prototype.buildTree = function()
{
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
		this.root = null;
	}

	this.root = new TreeNode(this);
	this.root.attach(this.program);
	this.root.updateInterface();

	for(var i = 0; i < this.program.children.length; i++)
	{
		fillTree(this.root, this.program.children[i]);
	}
};

/**
 * Update treeview to highlight the selected object.
 *
 * @updateSelection
 */
TreeView.prototype.updateSelection = function()
{
	function updateSelection(tree)
	{
		tree.element.style.backgroundColor = Editor.isSelected(tree.object) ? Editor.theme.buttonOverColor : Editor.theme.buttonLightColor;

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

/**
 * Update tree view children positions.
 *
 * @method updateChildPosition
 */
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

	if(this.root !== null)
	{
		this.size.y = updateChildPosition(this.root, 20, 1, this.root.folded);
	}
};
