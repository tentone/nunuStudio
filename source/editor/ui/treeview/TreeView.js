"use strict";

function TreeView(parent, closeable, container, index)
{	
	TabElement.call(this, parent, closeable, container, index, "Project Explorer", Editor.filePath + "icons/misc/about.png");

	this.element.style.display = "block";
	this.element.style.overflow = "auto";
	this.element.style.top = "0px";
	this.element.style.left = "0px";
	this.element.style.width = "100%";
	this.element.style.height = "100%";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	this.program = null;
	this.root = null;
}

TreeView.prototype = Object.create(TabElement.prototype);

//Set data from object
TreeView.prototype.attach = function(program)
{	
	this.program = program;
};

TreeView.prototype.updateView = function()
{
	var time = performance.now();
	
	if(this.root !== null)
	{
		this.root.destroy();
		this.root = null;
	}

	this.createProgramTree();
	this.updateChildPosition();
	
	var delta = performance.now() - time;
	console.log("Treeview update time: " + delta);
};

TreeView.prototype.createProgramTree = function()
{
	this.root = new TreeElement(this);
	this.root.attach(this.program);

	for(var i = 0; i < this.program.children.length; i++)
	{
		TreeView.fillTree(this.root, this.program.children[i]);
	}
};

//Update which object is currently selected
TreeView.prototype.updateSelectedObject = function()
{
	TreeView.updateSelectedObject(this.root);
};

//Remove element
TreeView.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

//Update tree view children positions
TreeView.prototype.updateChildPosition = function()
{
	this.root.updateInterface();

	this.size.y = TreeView.updateChildPosition(this.root, 20, 1, false);
};

//Update division Size
TreeView.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";

		if(this.root !== null)
		{
			this.root.updateInterface();
		}
	}
	else
	{
		this.element.style.display = "none";
	}
};

//Fill tree roo with objects
TreeView.fillTree = function(root, object)
{
	if(!object.hidden)
	{
		var element = root.addObject(object);
		for(var i = 0; i < object.children.length; i++)
		{
			TreeView.fillTree(element, object.children[i]);
		}
	}
};

//Update treeview to highlight the selected object
TreeView.updateSelectedObject = function(element)
{
	var children = element.children;

	for(var i = 0; i < children.length; i++)
	{
		//Check if is the selected object
		if(Editor.isObjectSelected(children[i].obj))
		{
			var element = children[i].element;
			element.style.backgroundColor = Editor.theme.buttonOverColor;
		}
		else
		{
			var element = children[i].element;
			element.style.backgroundColor = Editor.theme.buttonLightColor;
		}

		TreeView.updateSelectedObject(children[i]);
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

//Update childs position (recursive)
TreeView.updateChildPosition = function(parent, position, level, folded)
{
	var children = parent.children;
	var length = parent.children.length;

	for(var i = 0; i < length; i++)
	{
		if(folded || TreeView.checkParentFolded(parent))
		{
			children[i].setVisibility(false);
			folded = true;
		}
		else
		{
			children[i].visible = true;
			children[i].position.set(0, position);
			children[i].level = level;
			children[i].updateInterface();
 
			folded = false;
			position += 20;
		}

		if(children[i].children.length > 0)
		{
			position = TreeView.updateChildPosition(children[i], position, level + 1, folded);
		}
	}

	return position;
};
