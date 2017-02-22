"use strict";

function TreeElement(container)
{
	//Container
	if(container !== undefined)
	{
		this.container = container;
		this.parent = container.element;
	}
	else
	{
		this.container = null;
		this.parent = null;
	}
	
	//Self pointer
	var self = this;

	//Element
	this.element = document.createElement("div");
	this.element.draggable = true;
	this.element.style.position = "absolute";
	this.element.style.width = "100%";
	this.element.style.height = "20px";
	this.element.style.cursor = "pointer";
	this.element.style.boxSizing = "border-box";

	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	this.element.onmouseleave = function()
	{
		if(!Editor.isObjectSelected(self.obj))
		{
			this.style.backgroundColor = Editor.theme.buttonLightColor;
		}
	};

	//Arrow
	this.arrow = document.createElement("img");
	this.arrow.draggable = false;
	this.arrow.src = "editor/files/icons/misc/arrow_down.png";
	this.arrow.style.position = "absolute";
	this.arrow.style.opacity = 0.5;
	this.arrow.style.width = "15px";
	this.arrow.style.height = "15px";
	this.arrow.style.left = "5px";
	this.arrow.style.top = "3px";
	this.element.appendChild(this.arrow);

	this.arrow.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};

	this.arrow.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};

	//Fold
	this.arrow.onclick = function()
	{
		self.folded = !self.folded;
		self.updateFoldedState();
	};

	//Icon
	this.icon = document.createElement("img");
	this.icon.draggable = false;
	this.icon.src = "editor/files/icons/misc/arrow_down.png";
	this.icon.style.position = "absolute";
	this.icon.style.pointerEvents = "none";
	this.icon.style.width = "15px";
	this.icon.style.height = "15px";
	this.icon.style.left = "25px";
	this.icon.style.top = "3px";
	this.element.appendChild(this.icon);

	//Text
	this.label = document.createElement("div");
	this.label.style.overflow = "hidden";
	this.label.style.position = "absolute";
	this.label.style.pointerEvents = "none";
	this.label.style.top = "4px";
	this.element.appendChild(this.label);

	//Attributes
	this.size = new THREE.Vector2(0, 0);
	this.position = new THREE.Vector2(0, 0);
	this.visible = true;

	//Content
	this.folded = false;
	this.obj = null;
	this.level = 0;
	this.up = null; //Parent
	this.children = [];

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		if(self.obj !== null)
		{
			//Scene and program flags
			var program = self.obj instanceof Program;
			var scene = self.obj instanceof Scene;

			//Context menu object
			var menu = new ContextMenu();
			menu.size.set(140, 20);
			menu.position.set(event.clientX - 5, event.clientY - 5);
			
			//Open tab for object editor
			if(self.obj instanceof Script)
			{
				menu.addOption("Script editor", openScriptTab);
			}
			else if(self.obj instanceof Scene)
			{
				menu.addOption("Scene editor", openSceneTab);
			}
			else if(self.obj instanceof ParticleEmitter)
			{
				menu.addOption("Particle editor", openParticleTab);
			}

			//Rename Object
			menu.addOption("Rename", function()
			{
				var name = prompt("Rename object", self.obj.name);
				if(name !== null && name !== "")
				{
					self.obj.name = name;
					Editor.updateObjectViews();
				}
			});

			if(!program)
			{
				menu.addOption("Delete", function()
				{
					Editor.deleteObject(self.obj);
				});
			}

			if(!scene && !program)
			{
				//Create physics shape to match object
				menu.addOption("Add physics", function()
				{
					var physics = new PhysicsObject();
					physics.addShape(Mesh2shape.createShape(self.obj));
					physics.name = self.obj.name;
					
					Editor.addToScene(physics);
					Editor.updateObjectViews();
				});

				//Set object and children to static mode
				menu.addOption("Set static", function()
				{
					ObjectUtils.setMatrixAutoUpdate(self.obj, false);
					Editor.updateObjectViews();
				});

				//Set object and children to dynamic mode
				menu.addOption("Set dynamic", function()
				{
					ObjectUtils.setMatrixAutoUpdate(self.obj, true);
					Editor.updateObjectViews();
				});

				//Set object and children shadow casting mode
				menu.addOption("Enable shadows", function()
				{
					ObjectUtils.setShadowCasting(self.obj, true);
					ObjectUtils.setShadowReceiving(self.obj, true);

					Editor.updateObjectViews();
				});

				//Set object and children shadow casting mode
				menu.addOption("Disable shadows", function()
				{
					ObjectUtils.setShadowCasting(self.obj, false);
					ObjectUtils.setShadowReceiving(self.obj, false);

					Editor.updateObjectViews();
				});

				//Duplicate object
				menu.addOption("Duplicate", function()
				{
					var obj = new ObjectLoader().parse(self.obj.toJSON());
					obj.traverse(function(child)
					{
						child.uuid = THREE.Math.generateUUID();
					});
					self.obj.parent.add(obj);
					Editor.updateTreeView();
				});

				//Copy object
				menu.addOption("Copy", function()
				{
					Editor.copyObject(self.obj);
				});

				//Cut object
				menu.addOption("Cut", function()
				{
					Editor.cutObject(self.obj);
				});
			}
			
			if(!program)
			{
				//Paste object form clipboard
				menu.addOption("Paste", function()
				{
					Editor.pasteObject(self.obj);
				});
			}
		}
	};

	//Drag start (fired on the draggable object)
	this.element.ondragstart = function(event)
	{
		if(!(self.obj instanceof Scene))
		{
			event.dataTransfer.setData("uuid", self.obj.uuid);
			DragBuffer.pushDragElement(self.obj);
		}
	};

	//Clear element border
	function clearBorder()
	{
		self.element.style.border = "";
		self.element.style.borderTop = "";
		self.element.style.borderBottom = "";
	};

	//Drag end (fired on the draggable object, called after of ondrop on the drop target)
	this.element.ondragend = function(event)
	{
		clearBorder();

		//Try to remove event from buffer
		var uuid = event.dataTransfer.getData("uuid");
		var obj = DragBuffer.popDragElement(uuid);

		//To avoid mouse lock after drag
		Editor.mouse.updateKey(Mouse.LEFT, Key.UP);
	};

	//Flag to avoid unecessary border reflow
	var state = 0;

	this.element.ondragover = function(event)
	{
		//Above
		if(event.layerY < 5)
		{
			if(state !== 1)
			{
				state = 1;
				clearBorder();
				this.style.borderTop = "thin solid #999999";
			}
		}
		//Bellow
		else if(event.layerY > 15)
		{
			if(state !== 2)
			{
				state = 2;
				clearBorder();
				this.style.borderBottom = "thin solid #999999";
			}
		}
		//Inside
		else if(state !== 3)
		{
			state = 3;
			clearBorder();
			this.style.border = "thin solid #999999";
		}
	};

	this.element.ondragleave = function()
	{
		state = 0;
		clearBorder();
	};

	//Drop event (fired on the drop target)
	this.element.ondrop = function(event)
	{
		clearBorder();

		//Collect element from buffer
		var uuid = event.dataTransfer.getData("uuid");
		var obj = DragBuffer.popDragElement(uuid);

		if(obj !== null && obj !== self.obj && !ObjectUtils.isChildOf(obj ,self.obj))
		{
			//Above
			if(event.layerY < 5)
			{
				if(!(self.obj.parent instanceof Program))
				{
					self.obj.parent.addAbove(obj, self.obj);
				}
			}
			//Bellow
			else if(event.layerY > 15)
			{
				if(!(self.obj.parent instanceof Program))
				{
					self.obj.parent.addBellow(obj, self.obj);
				}
			}
			//Inside
			else
			{
				self.obj.add(obj);
			}

			self.updateSceneData();
		}
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
			openScriptTab();
		}
		else if(self.obj instanceof Scene)
		{
			openSceneTab();
		}
		else if(self.obj instanceof ParticleEmitter)
		{
			openParticleTab();
		}
	};

	//Open new script tab
	var openScriptTab = function()
	{
		var tab = Interface.tab.getTab(ScriptEditor, self.obj);
		if(tab === null)
		{
			tab = Interface.tab.addTab(ScriptEditor, true);
			tab.attach(self.obj);
		}
		tab.select();
	};

	//Open scene tab
	var openSceneTab = function()
	{
		var tab = Interface.tab.getTab(SceneEditor, self.obj);
		if(tab === null)
		{
			tab = Interface.tab.addTab(SceneEditor, true);
			tab.attach(self.obj);
		}
		tab.select();
	};

	var openParticleTab = function()
	{
		var tab = Interface.tab.getTab(ParticleEditor, self.obj);
		if(tab === null)
		{
			tab = Interface.tab.addTab(ParticleEditor, true);
			tab.attach(self.obj);
		}
		tab.select();
	};

	//Add element to document
	this.parent.appendChild(this.element);
}

//Set object attached to element
TreeElement.prototype.setObject = function(obj)
{
	this.obj = obj;
	this.folded = obj.folded;

	this.setIcon(ObjectIcons.get(obj.type));
	this.setLabel(obj.name);
	
	if(obj.folded)
	{
		this.arrow.src = "editor/files/icons/misc/arrow_right.png";
	}
}

//Set icon
TreeElement.prototype.setIcon = function(icon)
{
	this.icon.src = icon;
}

//Set label
TreeElement.prototype.setLabel = function(label)
{
	this.label.innerHTML = label;
}

//Add tree element from object
TreeElement.prototype.addObject = function(obj)
{
	var element = new TreeElement(this.container);
	element.setObject(obj);
	element.up = this;
	
	this.children.push(element);
	return element;
}

//Add tree element
TreeElement.prototype.add = function(label, icon)
{
	var element = new TreeElement(this.container);
	if(label !== undefined)
	{
		element.setLabel(label);
	}
	if(icon !== undefined)
	{
		element.setIcon(icon);
	}
	
	element.up = this;

	this.children.push(element);
	return element;
}

//Remove element
TreeElement.prototype.destroy = function()
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
TreeElement.prototype.updateFoldedState = function()
{
	if(this.obj !== undefined)
	{
		this.obj.folded = this.folded;
	}

	if(this.folded)
	{
		this.arrow.src = "editor/files/icons/misc/arrow_right.png";
	}
	else
	{
		this.arrow.src = "editor/files/icons/misc/arrow_down.png";
	}

	this.container.updateChildPosition();
}

//Update parent tree element from scene data
TreeElement.prototype.updateSceneData = function()
{
	if(this.container.scene !== null)
	{
		this.container.updateView();
	}
}

//Set element visibility
TreeElement.prototype.setVisibility = function(visible)
{
	this.visible = visible;

	if(this.visible)
	{
		this.element.style.display = "block";
	}
	else
	{
		this.element.style.display = "none";
	}
}

//Update interface
TreeElement.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";
	
		var offset = this.level * 20;

		//Arrow
		if(this.obj.isEmpty())
		{
			this.arrow.style.display = "none";
		}
		else
		{
			this.arrow.style.display = "block";
			this.arrow.style.left = (5 + offset) + "px";
		}

		//Icon
		this.icon.style.left = (25 + offset) + "px";

		//Text
		this.label.style.left = (45 + offset) + "px";

		//Base
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";

		//Update childs
		for(var i = 0; i < this.children.length; i++)
		{
			this.children[i].updateInterface();
		}
	}
	else
	{
		this.element.style.display = "none";
	}
}