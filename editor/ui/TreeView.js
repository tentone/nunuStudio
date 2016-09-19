"use strict";

function TreeView(parent)
{	
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}

	//ID
	var id = "tree" + TreeView.id;
	TreeView.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "auto";
	this.element.style.cursor = "default";
	this.element.style.backgroundColor = Editor.theme.panel_color;

	//Label
	this.label = new Text(this.element);
	this.label.position.set(5, 10);
	this.label.setText("Object Explorer");
	this.label.setAlignment(Text.LEFT);
	this.label.updateInterface();

	//Element atributes
	this.fit_parent = true;
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

//TreeView conter
TreeView.id = 0;

//Set data from object
TreeView.prototype.attachObject = function(obj)
{	
	this.obj = obj;
}

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
	this.updateInterface();
}

//Update which object is currently selected
TreeView.prototype.updateSelectedObject = function(obj)
{
	TreeView.updateSelectedObject(this, obj);
}

//Add object to tree view
TreeView.prototype.addObject = function(obj)
{
	var element = new TreeElement(this);
	element.setObject(obj);
	element.up = this;

	this.children.push(element);

	return element;
}

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
}

//Remove element
TreeView.prototype.destroy = function()
{
	//Remove main element
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
	
	//Remove children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].destroy();
	}
	this.children = [];
}

//Update tree view children positions
TreeView.prototype.updateChildPosition = function()
{
	var size = TreeView.updateChildPosition(this, 20, 0, false);

	if(!this.fit_parent)
	{
		this.size.y = size;
	}
}

//Update
TreeView.prototype.update = function(){}

//Update division Size
TreeView.prototype.updateInterface = function()
{
	//Set Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Fit to parent
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight;
	}

	//Set element style
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";

	//Update childs
	var children = this.children;
	for(var i = 0; i < children.length; i++)
	{
		children[i].updateInterface();
	}
}

//Update treeview to highlight the selected object
TreeView.updateSelectedObject = function(element, obj)
{
	var children = element.children;
	var length = children.length;

	for(var i = 0; i < length; i++)
	{
		//Check if is the selected object
		if(children[i].obj.uuid === obj.uuid)
		{
			var element = children[i].element;
			element.style.backgroundColor = Editor.theme.button_over_color;
		}
		else
		{
			var element = children[i].element;
			element.style.backgroundColor = Editor.theme.button_light_color;
		}

		TreeView.updateSelectedObject(children[i], obj);
	}
}

//Get tree view element where the object is attached
TreeView.getElementFromObject = function(element, obj)
{
	var children = element.children;
	var length = children.length;

	for(var i = 0; i < length; i++)
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
}

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
}

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
}

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
}
