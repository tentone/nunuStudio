"use strict";

function TreeView(parent)
{	
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "auto";
	this.element.style.cursor = "default";
	this.element.style.top = "0px";
	this.element.style.left = "0px";
	this.element.style.width = "100%";
	this.element.style.height = "100%";	
	this.element.style.backgroundColor = Editor.theme.panelColor;

	//Label
	this.label = new Text(this.element);
	this.label.position.set(5, 10);
	this.label.setText("Project Explorer");
	this.label.setAlignment(Text.LEFT);
	this.label.updateInterface();

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Object
	this.obj = null;

	//Childs
	this.up = null;
	this.children = [];

	//Add element to document
	this.parent.appendChild(this.element);
}

//Set data from object
TreeView.prototype.attachObject = function(obj)
{	
	this.obj = obj;
};

TreeView.prototype.updateView = function()
{
	//Remove old elements
	var children = this.children;
	for(var i = 0; i < children.length; i++)
	{
		children[i].destroy();
	}

	this.children = [];

	//Add element and update interface
	TreeView.addSceneElement(this, this.obj);
	this.updateChildPosition();
};

//Update which object is currently selected
TreeView.prototype.updateSelectedObject = function()
{
	TreeView.updateSelectedObject(this);
};

//Add object to tree view
TreeView.prototype.addObject = function(obj)
{
	var element = new TreeElement(this);
	element.setObject(obj);
	element.up = this;

	this.children.push(element);

	return element;
};

//Add entry to tree view
TreeView.prototype.add = function(text, icon)
{
	var element = new TreeElement(this);
	
	if(text !== undefined)
	{
		element.setLabel(text);
	}
	if(icon !== undefined)
	{
		element.setIcon(icon);
	}

	this.children.push(element);

	return element;
};

//Remove element
TreeView.prototype.destroy = function()
{
	//Remove main element
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}

	//Clear children list
	this.children = [];
};

//Update tree view children positions
TreeView.prototype.updateChildPosition = function()
{
	var size = TreeView.updateChildPosition(this, 20, 0, false);

	this.size.y = size;
};

//Update division Size
TreeView.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";

		//Update childs
		for(var i = 0; i < this.children.length; i++)
		{
			this.children[i].updateInterface();
		}
	}
	else
	{
		this.element.style.visibility = "hidden";
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

//Get tree view element where the object is attached
TreeView.getElementFromObject = function(element, obj)
{
	var children = element.children;

	for(var i = 0; i < children.length; i++)
	{
		if(children[i].obj.uuid === obj.uuid)
		{
			return children[i];
		}

		var child = TreeView.getElementFromObject(children[i], obj);
		if(child !== null)
		{
			return child;
		}
	}

	return null;
};

//Add object element to tree (recursive)
TreeView.addSceneElement = function(tree, scene)
{
	if(!scene.hidden)
	{
		var element = tree.addObject(scene);

		for(var i = 0; i < scene.children.length; i++)
		{
			TreeView.addSceneElement(element, scene.children[i]);
		}
	}
};

//Check if parent if folded (recursive)
TreeView.checkParentFolded = function(element)
{
	if(element.up === null)
	{
		return false;
	}

	if(element.folded)
	{
		return true;
	}

	return TreeView.checkParentFolded(element.up);
};

//Update childs position (recursive)
TreeView.updateChildPosition = function(parent, position, level, folded)
{
	var length = parent.children.length;
	var children = parent.children;

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
