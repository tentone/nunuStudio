function TreeElement(container)
{
	//Component
	if(container === undefined)
	{
		this.container = null;
	}
	else
	{
		this.container = container;
	}
	this.parent = this.container.element;
	
	//ID
	var id = "tree_elem" + TreeElement.id;
	TreeElement.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.draggable = true;
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "button_left_light";
	this.element.style.left = "0px";
	this.element.style.top = "0px";
	this.element.style.width = container.size.x + "px";
	this.element.style.height = "20px";

	//Arrow
	this.arrow = new Image(this.element);
	this.arrow.size.set(15, 15);
	this.arrow.position.set(5, 3);
	this.arrow.setImage("editor/files/icons/misc/arrow_down.png");
	this.arrow.updateInterface();

	//Icon
	this.icon = new Image(this.element);
	this.icon.size.set(15, 15);
	this.icon.position.set(25, 3);
	this.icon.updateInterface();

	//Text
	this.label = new Text(this.element);
	this.label.position.set(45, 10);
	this.label.fit_content = true;
	this.label.setAlignment(Text.LEFT);
	this.label.updateInterface();

	//Element atributes
	this.size = new THREE.Vector2(container.size.x, 20);
	this.position = new THREE.Vector2(0, 0);
	this.visible = true;

	//Content
	this.folded = false;
	this.obj = null;
	this.level = 0;
	this.up = null; //Parent
	this.children = [];

	//Mouse events
	var self = this;

	//Mouse over event
	this.element.onmouseenter = function()
	{
		self.element.className = "button_left_over";
	};

	//Mouse leave event
	this.element.onmouseleave = function()
	{
		if(!Editor.isObjectSelected(self.obj))
		{
			self.element.className = "button_left_light";
		}
	};

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX - 5, event.clientY - 5);
		
		context.addOption("Rename", function()
		{
			if(self.obj !== null)
			{
				self.obj.name = prompt("Rename object", self.obj.name);
				self.updateSceneData();
				Editor.updateObjectViews();
			}
		});
		
		context.addOption("Delete", function()
		{
			self.deleteObject();
		});

		if(!(self.obj instanceof Scene) && !(self.obj instanceof Program))
		{
			context.addOption("Copy", function()
			{
				if(self.obj !== null)
				{
					try
					{
						App.clipboard.set(JSON.stringify(self.obj.toJSON()), "text");
					}
					catch(e){}
				}
			});

			context.addOption("Cut", function()
			{
				if(self.obj !== null)
				{
					try
					{
						App.clipboard.set(JSON.stringify(self.obj.toJSON()), "text");
						self.deleteObject();	
					}
					catch(e){}
				}
			});
		}

		context.addOption("Paste", function()
		{
			if(self.obj !== null)
			{
				try
				{
					var content = App.clipboard.get("text");
					var loader = new ObjectLoader();
					var data = JSON.parse(content);

					//Create object
					var obj = loader.parse(data);
					obj.uuid = THREE.Math.generateUUID();
					obj.position.set(0, 0, 0);

					//Add object
					self.obj.add(obj);
					self.updateSceneData();
				}
				catch(e){}
			}
		});
	};

	//Drag start
	this.element.ondragstart = function(event)
	{
		if(self.obj.uuid !== undefined && !(self.obj instanceof Scene))
		{
			event.dataTransfer.setData("uuid", self.obj.uuid);
			DragBuffer.pushDragElement(self.obj);
		}
	};

	//Drag end (called after of ondrop)
	this.element.ondragend = function(event)
	{
		//Try to remove event from buffer
		var uuid = event.dataTransfer.getData("uuid");
		var obj = DragBuffer.popDragElement(uuid);

		//To avoid mouse lock after drag
		Mouse.updateKey(Mouse.LEFT, Key.KEY_UP);
	};

	//Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();

		//Collect element from buffer
		var uuid = event.dataTransfer.getData("uuid");
		var obj = DragBuffer.popDragElement(uuid);
		
		if(obj !== null)
		{
			if(obj.uuid !== self.obj.uuid && !ObjectUtils.isChildOf(obj ,self.obj))
			{
				self.obj.add(obj);
				self.updateSceneData();
			}
		}
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Object select event
	this.element.onclick = function()
	{
		Editor.selectObject(self.obj);
	};

	//Double click event
	this.element.ondblclick = function()
	{
		if(self.obj instanceof Script)
		{
			//Check if there is already a tab with this script attached
			var found = false;
			for(var i = 0; i < Interface.tab.options.length; i++)
			{
				if(Interface.tab.options[i].component instanceof CodeEditor)
				{
					if(Interface.tab.options[i].component.script === self.obj)
					{
						found = true;
						Interface.tab.selectOption(i);
						break;
					}
				}
			}

			//If not found open new tab
			if(!found)
			{
				//Add new Code Editor tab
				var tab = Interface.tab.addOption(self.obj.name, Interface.file_dir + "icons/tab/code.png", true);
				var code = new CodeEditor();
				code.attachScript(self.obj);
				tab.attachComponent(code);
				
				//Select added tab
				tab.select();
			}
		}
		else if(self.obj instanceof Scene)
		{
			//Check if there is already a tab with this scene attached
			var found = false;
			for(var i = 0; i < Interface.tab.options.length; i++)
			{
				if(Interface.tab.options[i].component instanceof SceneEditor)
				{
					//If found select it
					if(Interface.tab.options[i].component.scene === self.obj)
					{
						found = true;
						Interface.tab.selectOption(i);
						break;
					}
				}
			}

			//If no tab is found create new one with a scene container
			if(!found)
			{
				//Scene Canvas
				var tab = Interface.tab.addOption(self.obj.name, Interface.file_dir + "icons/tab/scene.png", true);
				var container = new SceneEditor();
				container.setScene(self.obj);
				tab.attachComponent(container);

				//Select tab
				tab.select();
			}
		}
		else if(self.obj instanceof ParticleEmitter)
		{
			//Check if there is already a tab with this particle emitter attached
			var found = false;
			for(var i = 0; i < Interface.tab.options.length; i++)
			{
				if(Interface.tab.options[i].component instanceof ParticleEditor)
				{
					if(Interface.tab.options[i].component.particle === self.obj)
					{
						found = true;
						Interface.tab.selectOption(i);
						break;
					}
				}
			}

			//If not found open new tab
			if(!found)
			{
				//Add new Particle Editor tab
				var tab = Interface.tab.addOption(self.obj.name, Interface.file_dir + "icons/effects/particles.png", true);
				var particle = new ParticleEditor();
				particle.attachParticle(self.obj);
				tab.attachComponent(particle);
				
				//Select added tab
				tab.select();
			}
		}
	};

	//Arrow click
	this.arrow.img.onclick = function()
	{
		self.folded = !self.folded;
		self.updateFoldedState();
	};

	//Add element to document
	this.parent.appendChild(this.element);
}

//TreeElement conter
TreeElement.id = 0;

//Functions Prototype
TreeElement.prototype.update = update;
TreeElement.prototype.updateSceneData = updateSceneData;
TreeElement.prototype.updateInterface = updateInterface;
TreeElement.prototype.updateFoldedState = updateFoldedState;
TreeElement.prototype.destroy = destroy;
TreeElement.prototype.add = add;
TreeElement.prototype.setLabel = setLabel;
TreeElement.prototype.setIcon = setIcon;
TreeElement.prototype.setObject = setObject;

//Tree object manipulation
TreeElement.prototype.deleteObject = deleteObject;

//Delete object attached to this three element
function deleteObject()
{
	//Delete object
	if((this.obj !== null) && (this.obj.parent !== null))
	{
		this.obj.parent.remove(this.obj);
		this.updateSceneData();

		//If this object is selected reset editing flags
		if(Editor.isObjectSelected(this.obj))
		{
			Editor.resetEditingFlags();
		}
	}
}

//Set object attached to element
function setObject(obj)
{
	this.obj = obj;
	this.icon.setImage(obj.icon);
	this.label.setText(obj.name);
	this.folded = obj.folded;
	this.updateFoldedState();
}

//Set icon
function setIcon(icon)
{
	this.icon.setImage(icon);
}

//Set label
function setLabel(label)
{
	this.label.setText(label);
}

//Add element
function add(label, icon)
{
	var element = new TreeElement(this.container);
	if(label != undefined)
	{
		element.setLabel(label);
	}
	if(icon != undefined)
	{
		element.setIcon(icon);
	}
	
	element.up = this;
	element.updateInterface();

	this.children.push(element);
	return element;
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
	
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].destroy();
	}
}

//Update folded state for this tree element
function updateFoldedState()
{
	if(this.obj !== undefined)
	{
		this.obj.folded = this.folded;
	}

	if(this.folded)
	{
		this.arrow.setImage("editor/files/icons/misc/arrow_right.png");
		this.container.updateInterface();
	}
	else
	{
		this.arrow.setImage("editor/files/icons/misc/arrow_down.png");
		this.container.updateInterface();
	}
}

//Update parent tree element form scene data
function updateSceneData()
{
	if(this.container.scene != null)
	{
		this.container.fromObject(this.container.scene);
	}
}

//Update TreeElement
function update(){}

//Update division Size
function updateInterface()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
	
	//Update size
	if(this.container != null)
	{
		this.size.x = this.container.size.x;
	}

	var offset = this.level * 20;

	//Arrow
	this.arrow.visible = (this.children.length > 0) && this.visible;
	this.arrow.position.set(5 + offset, 3);
	this.arrow.updateInterface();

	//Icon
	this.icon.visible = this.visible;
	this.icon.position.set(25 + offset, 3);
	this.icon.updateInterface();

	//Text
	this.label.visible = this.visible;
	this.label.position.set(45 + offset, 10);
	this.label.size.set(this.size.x - (45 + offset), 0);
	this.label.updateInterface();
	
	//Base
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";

	//Update childs
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].updateInterface();
	}
}