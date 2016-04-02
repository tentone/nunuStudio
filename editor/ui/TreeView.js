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
	this.element.className = "container";

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
	this.scene = null;
	this.auto_update_size = true;
	this.children = [];
	this.folded = false;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Object drag buffer (stores objects being dragged)
TreeView.drag_buffer = [];

//TreeView conter
TreeView.id = 0;

//Functions Prototype
TreeView.prototype.update = update;
TreeView.prototype.updateInterface = updateInterface;
TreeView.prototype.destroy = destroy;
TreeView.prototype.add = add;
TreeView.prototype.fromScene = fromScene;

//Set data from scene
function fromScene(scene)
{	
	//Remove all children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].destroy();
	}
	this.children = [];

	//Set scene
	this.scene = scene;
	
	//Add element and update interface
	TreeView.addSceneElement(this, scene);
	this.updateInterface();
}

//Add element
function add(text, icon)
{
	var element = new TreeElement(this);
	if(text != undefined)
	{
		element.setLabel(text);
	}
	if(icon != undefined)
	{
		element.setIcon(icon);
	}
	element.updateInterface();

	this.children.push(element);

	return element;
}

//Remove element
function destroy()
{
	this.parent.removeChild(this.element);
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].destroy();
	}
	this.children = [];
}

//Update TreeView
function update(){}

//Update division Size
function updateInterface()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update childs position and level
	this.size.y = TreeView.updateChildPosition(this, 20, 0);

	//Update element size
	if(this.auto_update_size && this.container != null)
	{
		this.size.x = this.container.size.x;
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

//Push elemento to drag buffer
TreeView.pushDragElement = function(obj)
{
	//Check if element dont exist on drag buffer
	if(TreeView.drag_buffer.indexOf(obj) === -1)
	{
		TreeView.drag_buffer.push(obj);
	}
}

//Get element from drag buffer using uuid
TreeView.popDragElement = function(uuid)
{
	for(var i = 0; i < TreeView.drag_buffer.length; i++)
	{
		if(TreeView.drag_buffer[i].uuid === uuid)
		{
			var obj = TreeView.drag_buffer[i]; 
			TreeView.drag_buffer.splice(i, 1);
			return obj;
		}
	}
	return null;
}

//Add scene element to tree (recursive)
TreeView.addSceneElement = function(tree, scene)
{
	var element = tree.add(scene.name, scene.icon);
	element.obj = scene;

	for(var i = 0; i < scene.children.length; i++)
	{
		TreeView.addSceneElement(element, scene.children[i]);
	}
}


//Check if parent if folded (recursive)
TreeView.checkParentFolded = function(element)
{
	if(element === null || element === undefined || element.folded === undefined || element.folded === null)
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
TreeView.updateChildPosition = function(parent, position, level)
{
	for(var i = 0; i < parent.children.length; i++)
	{
		if(TreeView.checkParentFolded(parent))
		{
			parent.children[i].visible = false;
		}
		else
		{
			parent.children[i].visible = true;
			parent.children[i].position.set(0, position);
			parent.children[i].level = level;
			position += 20;
		}

		parent.children[i].updateInterface();

		if(parent.children[i].children.length > 0)
		{
			position = TreeView.updateChildPosition(parent.children[i], position, level+1);
		}
	}

	return position;
}
