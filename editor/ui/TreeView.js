function TreeView(parent, container)
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

	//Component
	if(container === undefined)
	{
		this.container = null;
	}
	else
	{
		this.container = container;
	}

	//ID
	var id = "tree" + TreeView.id;
	TreeView.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "panel";

	//Label
	this.label = new Text(this.element);
	this.label.position.set(5, 10);
	this.label.setText("Explorer");
	this.label.setAlignment(Text.LEFT);
	this.label.updateInterface();

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Childs
	this.up = null;
	this.fit_parent = true;
	this.scene = null;
	this.children = [];

	//Add element to document
	this.parent.appendChild(this.element);
}

//TreeView conter
TreeView.id = 0;

//Functions Prototype
TreeView.prototype.update = update;
TreeView.prototype.updateInterface = updateInterface;
TreeView.prototype.destroy = destroy;
TreeView.prototype.add = add;
TreeView.prototype.addFromObject = addFromObject;
TreeView.prototype.fromObject = fromObject;
TreeView.prototype.updateChildPosition = updateChildPosition;
TreeView.prototype.updateSelectedObject = updateSelectedObject;

//Set data from object
function fromObject(obj)
{
	//Remove all children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].destroy();
	}
	this.children = [];

	//Set scene
	this.scene = obj;
	
	//Add element and update interface
	TreeView.addSceneElement(this, obj);
	this.updateChildPosition();
	this.updateInterface();
}

//Update which object is currently selected
function updateSelectedObject(obj)
{
	TreeView.updateSelectedObject(this, obj);
}

//Add tree element from object
function addFromObject(obj)
{
	var element = new TreeElement(this);

	element.obj = obj;
	element.icon.setImage(ObjectIcons.get(obj.type));
	element.label.setText(obj.name);
	element.folded = obj.folded;
	element.up = this;

	this.children.push(element);

	return element;
}

//Add element
function add(text, icon)
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
function destroy()
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
function updateChildPosition()
{
	var size = TreeView.updateChildPosition(this, 20, 0, false);

	if(!this.fit_parent)
	{
		this.size.y = size;
	}
}

//Update TreeView
function update(){}

//Update division Size
function updateInterface()
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
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].updateInterface();
	}
}

//Update treeview to highlight the selected object
TreeView.updateSelectedObject = function(element, obj)
{
	for(var i = 0; i < element.children.length; i++)
	{
		//Check if is the selected object
		if(element.children[i].obj.uuid === obj.uuid)
		{
			element.children[i].element.className = "button_left_over";
		}
		else
		{
			element.children[i].element.className = "button_left_light";
		}

		//Call children
		TreeView.updateSelectedObject(element.children[i], obj);
	}
}

//Get tree view element where the object is attached
TreeView.getElementFromObject = function(element, obj)
{
	for(var i = 0; i < element.children.length; i++)
	{
		if(element.children[i].obj.uuid === obj.uuid)
		{
			return element.children[i];
		}

		var child = TreeView.getElementFromObject(element.children[i], obj);
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
	//Check if object is hidden
	if(!scene.hidden)
	{
		//Create new tree element and add
		var element = tree.addFromObject(scene);

		//Add object children
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
	for(var i = 0; i < parent.children.length; i++)
	{
		if(folded || TreeView.checkParentFolded(parent))
		{
			parent.children[i].setVisibility(false);
			folded = true;
		}
		else
		{
			parent.children[i].visible = true;
			parent.children[i].position.set(0, position);
			parent.children[i].level = level;
			parent.children[i].updateInterface();
			folded = false;
			position += 20;
		}

		if(parent.children[i].children.length > 0)
		{
			position = TreeView.updateChildPosition(parent.children[i], position, level + 1, folded);
		}
	}

	return position;
}
