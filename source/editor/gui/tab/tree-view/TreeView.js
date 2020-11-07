import {Object3D} from "three";
import {Global} from "../../../Global.js";
import {Editor} from "../../../Editor.js";
import {TabGroup} from "../../../components/tabs/TabGroup.js";
import {TabComponent} from "../../../components/tabs/TabComponent.js";
import {SearchBox} from "../../../components/SearchBox.js";
import {Component} from "../../../components/Component.js";
import {TreeNode} from "./TreeNode.js";

/**
 * TreeView component is used to represent a object tree.
 *
 * Each tree entry represents direclty a Object3D object present in the editor.
 *
 * @class TreeView
 * @extends {TabComponent}
 * @param {Component} parent Parent element.
 * @param {boolean} closeable If the tab is closeable.
 * @param {TabGroup} container The container where this tab is inserted.
 * @param {number} index Index inside the container button array.
 */
function TreeView(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, "Project Explorer", Global.FILE_PATH + "icons/misc/menu.png");

	var self = this;

	this.element.style.overflow = "auto";
	this.element.style.backgroundColor = null;

	this.search = new SearchBox(this);
	this.search.element.style.backgroundColor = "var(--bar-color)";
	this.search.setOnChange(function()
	{
		self.selectByName(self.search.search.getText());
	});

	this.program = null;
	this.root = null;
}

TreeView.prototype = Object.create(TabComponent.prototype);

/**
 * Select tree nodes by their name.
 *
 * All nodes that contain the name will be selected.
 *
 * @method selectByName
 * @param {string} search String with portion of the name to be found and filtered.
 */
TreeView.prototype.selectByName = function(search)
{
	search = search.toLowerCase();

	Editor.clearSelection();

	function filterRecursive(node)
	{
		var text = node.object.name.toLowerCase();
		if (text.search(search) !== -1)
		{
			Editor.addToSelection(node.object);
		}

		for (var i = 0; i < node.children.length; i++)
		{
			filterRecursive(node.children[i]);
		}
	}

	filterRecursive(this.root);
};


/**
 * Attach a program to the tree view.
 *
 * @method attach
 */
TreeView.prototype.attach = function(program)
{
	if (this.program === program)
	{
		return;
	}

	this.program = program;

	// Destroy old root object
	if (this.root !== null)
	{
		this.root.destroy();
		this.root = null;
	}

	// Create program tree
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

		for (var i = 0; i < node.children.length; i++)
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
 * @param {Object3D} object New object to add to the tree.
 * @param {Object3D} parent Parent to insert the object.
 * @param {number} index Index to insert the object.
 */
TreeView.prototype.addObject = function(object, parent, index)
{
	var parentNode = null;
	this.traverse(function(node)
	{
		if (node.uuid === parent.uuid)
		{
			parentNode = node;
		}
	});

	// Create object and children
	var element = parentNode.insertObject(object, index);
	for (var k = 0; k < object.children.length; k++)
	{
		insertObject(element, object.children[k]);
	}

	this.updateChildPosition();

	// Auxiliar method to insert object recursivelly
	function insertObject(parent, object)
	{
		var element = parent.addObject(object);

		for (var k = 0; k < object.children.length; k++)
		{
			insertObject(element, object.children[k]);
		}
	}
};

/**
 * Remove a object from the treeview.
 *
 * @method removeObject
 * @param {Object3D} object Object to be removed from the tree.
 * @param {Object3D} parent Parent object.
 */
TreeView.prototype.removeObject = function(object, parent)
{
	var parentNode = null;
	this.traverse(function(node)
	{
		if (node.uuid === parent.uuid)
		{
			parentNode = node;
		}
	});

	var node = parentNode.removeElementUUID(object.uuid);

	if (node !== null)
	{
		node.destroy();
	}
	else
	{
		console.warn("nunuStudio: Failed to remove node from tree view.", object, parent, node, parentNode);
	}

	this.updateChildPosition();
};

/**
 * Move object in the tree, from a position to another position and parent.
 *
 * @method addObject
 * @param {Object3D} object New object to add to the tree.
 * @param {Object3D} oldParent Old parent to remove the object from.
 * @param {Object3D} newParent New parent to insert the object into.
 * @param {number} index New index to insert the object.
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

		for (var i = 0; i < object.children.length; i++)
		{
			fillTree(element, object.children[i]);
		}
	}

	if (this.root !== null)
	{
		this.root.destroy();
		this.root = null;
	}

	this.root = new TreeNode(this);
	this.root.attach(this.program);
	this.root.updateInterface();

	for (var i = 0; i < this.program.children.length; i++)
	{
		fillTree(this.root, this.program.children[i]);
	}
};

/**
 * Update tree view children positions.
 *
 * @method updateChildPosition
 */
TreeView.prototype.updateChildPosition = function()
{
	// Check if parent if folded (recursive)
	function checkParentFolded(element)
	{
		if (element.parent === null)
		{
			return false;
		}

		if (element.folded === true)
		{
			return true;
		}

		return checkParentFolded(element.parent);
	}

	// Update childs position (recursive)
	function updateChildPosition(parent, position, level, folded)
	{
		var children = parent.children;
		var length = parent.children.length;

		for (var i = 0; i < length; i++)
		{
			var element = children[i];

			if (folded || checkParentFolded(parent))
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

			if (element.children.length > 0)
			{
				position = updateChildPosition(children[i], position, level + 1, folded);
			}
		}

		return position;
	}

	if (this.root !== null)
	{
		this.root.position.set(0, this.search.size.y);
		this.root.updateInterface();

		this.size.y = updateChildPosition(this.root, this.search.size.y + 20, 1, this.root.folded);
	}
};

TreeView.prototype.updateSize = function()
{
	TabComponent.prototype.updateSize.call(this);

	this.search.size.set(this.size.x, 25);
	this.search.updateInterface();
};

export {TreeView};
