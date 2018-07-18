"use strict";

function TreeElement(container)
{
	//Container
	this.container = container;

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Object attached
	this.object = null;
	this.uuid = null;
	this.folded = false;

	//Children and parent elements
	this.parent = null;
	this.children = [];
	this.level = 0;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.draggable = true;
	this.element.style.left = "0px";
	this.element.style.height = "20px";
	this.element.style.width = "100%";
	this.element.style.cursor = "pointer";
	this.element.style.boxSizing = "border-box";
	this.container.element.appendChild(this.element);

	//Arrow
	this.arrow = document.createElement("img");
	this.arrow.draggable = false;
	this.arrow.style.position = "absolute";
	this.arrow.style.opacity = 0.5;
	this.arrow.style.width = "15px";
	this.arrow.style.height = "15px";
	this.arrow.style.left = "5px";
	this.arrow.style.top = "3px";
	this.element.appendChild(this.arrow);

	//Icon
	this.icon = document.createElement("img");
	this.icon.draggable = false;
	this.icon.style.position = "absolute";
	this.icon.style.pointerEvents = "none";
	this.icon.style.width = "15px";
	this.icon.style.height = "15px";
	this.icon.style.left = "25px";
	this.icon.style.top = "3px";
	this.element.appendChild(this.icon);

	//Label
	this.label = document.createElement("span");
	this.label.style.overflow = "hidden";
	this.label.style.position = "absolute";
	this.label.style.pointerEvents = "none";
	this.label.style.whiteSpace = "nowrap";
	this.label.style.top = "4px";
	this.element.appendChild(this.label);

	//Label text
	this.labelText = document.createTextNode("");
	this.label.appendChild(this.labelText);

	var self = this;

	this.arrow.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};

	this.arrow.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};

	this.arrow.onclick = function()
	{
		self.folded = !self.folded;
		self.updateFoldedState();
	};

	//Mouse enter
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	//Mouse leave
	this.element.onmouseleave = function()
	{
		if(!Editor.isObjectSelected(self.object))
		{
			this.style.backgroundColor = Editor.theme.buttonLightColor;
		}
	};

	//Drag state
	var state = 0;

	//Drag start
	this.element.ondragstart = function(event)
	{
		if(!self.object.locked)
		{
			event.dataTransfer.setData("uuid", self.object.uuid);
			DragBuffer.pushDragElement(self.object);
		}
	};

	//Drag end
	this.element.ondragend = function(event)
	{
		self.clearBorder();
		event.preventDefault();

		if(!self.object.locked)
		{
			//Try to remove event from buffer
			var uuid = event.dataTransfer.getData("uuid");
			var object = DragBuffer.popDragElement(uuid);
		}
	};

	//Drag leave
	this.element.ondragleave = function()
	{
		event.preventDefault();
		self.clearBorder();
		state = 0;
	};

	//Context menu
	this.element.oncontextmenu = function(event)
	{
		if(!self.object.locked)
		{
			//Scene and program flags
			var isProgram = self.object instanceof Program;
			var isScene = self.object instanceof Scene;

			//Context menu
			var context = new ContextMenu();
			context.size.set(150, 20);
			context.position.set(event.clientX, event.clientY);
			
			//Open editor
			if(isScene)
			{
				context.addOption("Scene editor", openSceneTab);
			}
			else if(isProgram)
			{
				context.addOption("Create scene", function()
				{
					Editor.program.addDefaultScene();
					Editor.updateObjectsViewsGUI();
				});			
			}
			else if(self.object.isObject3D === true)
			{
				context.addOption("Object editor", openSceneTab);

				if(self.object instanceof Script)
				{
					context.addOption("Script editor", openScriptTab);
				}
				else if(self.object instanceof ParticleEmitter)
				{
					context.addOption("Particle editor", openParticleTab);
				}
			}
	
			//Recalculate Origin
			context.addOption("Recenter geometries", function()
			{
				ObjectUtils.recalculateGeometryOrigin(self.object);
			});

			//Rename
			context.addOption("Rename", function()
			{
				Editor.renameObject(self.object);
			});

			//Delete
			if(!isProgram)
			{
				context.addOption("Delete", function()
				{
					Editor.deleteObject(self.object);
				});
			}

			//Mesh specific stuff
			if(self.object instanceof THREE.Mesh || self.object instanceof THREE.SkinnedMesh)
			{
				//If mesh has a geometry attached
				if(self.object.geometry !== undefined)
				{
					//Generate normals for the attached geometry
					context.addOption("Compute normals", function()
					{
						self.object.geometry.computeVertexNormals();
					});

					//Apply transformation to geometry
					context.addOption("Apply transformation", function()
					{
						self.object.geometry.applyMatrix(self.object.matrixWorld);
						self.object.position.set(0, 0, 0);
						self.object.scale.set(1, 1, 1);
						self.object.rotation.set(0, 0, 0);
					});
				}
				
				//Add physics object
				function createPhysics(object, mode)
				{
					var physics = new PhysicsObject();
					physics.addShape(PhysicsGenerator.createShape(object, mode));

					physics.name = object.name;
					physics.position.copy(object.position);
					physics.quaternion.copy(object.quaternion);

					object.position.set(0, 0, 0);
					object.quaternion.set(0, 0, 0, 1);
					object.parent.add(physics);

					physics.add(object);

					Editor.updateObjectsViewsGUI();
				}

				var physics = context.addMenu("Add physics");

				physics.addOption("Box", function()
				{
					createPhysics(self.object, PhysicsGenerator.Type.BOX);
				});

				physics.addOption("Sphere", function()
				{
					createPhysics(self.object, PhysicsGenerator.Type.SPHERE);
				});

				physics.addOption("Cylinder", function()
				{
					createPhysics(self.object, PhysicsGenerator.Type.CYLINDER);
				});
	
				physics.addOption("ConvexHull", function()
				{
					createPhysics(self.object, PhysicsGenerator.Type.HULL);
				});
			}

			if(!isScene && !isProgram)
			{
				var autoUpdate = context.addMenu("Static");

				//Set object and children to static mode
				autoUpdate.addOption("Static", function()
				{
					ObjectUtils.setMatrixAutoUpdate(self.object, false);
					Editor.updateObjectsViewsGUI();
				});

				//Set object and children to dynamic mode
				autoUpdate.addOption("Dynamic", function()
				{
					ObjectUtils.setMatrixAutoUpdate(self.object, true);
					Editor.updateObjectsViewsGUI();
				});

				var shadow = context.addMenu("Shadows");

				//Set object and children shadow casting mode
				shadow.addOption("Enable", function()
				{
					ObjectUtils.setShadowCasting(self.object, true);
					ObjectUtils.setShadowReceiving(self.object, true);

					Editor.updateObjectsViewsGUI();
				});

				//Set object and children shadow casting mode
				shadow.addOption("Disable", function()
				{
					ObjectUtils.setShadowCasting(self.object, false);
					ObjectUtils.setShadowReceiving(self.object, false);

					Editor.updateObjectsViewsGUI();
				});

				//Duplicate object
				context.addOption("Duplicate", function()
				{
					var object = new ObjectLoader().parse(self.object.toJSON());
					object.traverse(function(child)
					{
						child.uuid = THREE.Math.generateUUID();
					});

					Editor.history.add(new AddedAction(object, self.object.parent));
				});

				//Copy object
				context.addOption("Copy", function()
				{
					Editor.copyObject(self.object);
				});

				//Cut object
				context.addOption("Cut", function()
				{
					Editor.cutObject(self.object);
					Editor.history.add(new RemovedAction(self.object));
				});
			}
			
			if(!isProgram)
			{
				//Paste object form clipboard
				context.addOption("Paste", function()
				{
					Editor.pasteObject(self.object);
				});
			}

			context.updateInterface();
		}
	};

	//Drag over
	this.element.ondragover = function(event)
	{
		event.preventDefault();

		if(!self.object.locked)
		{
			//Above
			if(event.layerY < 5)
			{
				if(state !== 1)
				{
					state = 1;
					self.clearBorder();
					this.style.borderTop = "thin solid #999999";
				}
			}
			//Bellow
			else if(event.layerY > 15)
			{
				if(state !== 2)
				{
					state = 2;
					self.clearBorder();
					this.style.borderBottom = "thin solid #999999";
				}
			}
			//Inside
			else if(state !== 3)
			{
				state = 3;
				self.clearBorder();
				this.style.border = "thin solid #999999";
			}
		}
	};

	//Drop event (fired on the drop target)
	this.element.ondrop = function(event)
	{
		event.preventDefault();
		self.clearBorder();

		if(self.object.locked)
		{
			return;
		}

		//Collect element from buffer
		var uuid = event.dataTransfer.getData("uuid");
		var object = DragBuffer.popDragElement(uuid);

		//Object 3D
		if(object.isObject3D === true && object !== self.object)
		{
			if(ObjectUtils.isChildOf(object, self.object))
			{
				Editor.alert("Cannot add object into is child.");
			}
			else
			{
				var selfIsScene = self.object instanceof Scene;
				var selfIsProgram = self.object instanceof Program;
				var dragIsScene = object instanceof Scene;
				var dragIsProgram = object instanceof Program;

				//Above
				if(event.layerY < 5)
				{
					if(!selfIsProgram || (dragIsScene && selfIsScene) || (!dragIsScene && !selfIsScene))
					{
						var index = self.object.parent.children.indexOf(self.object);
						Editor.history.add(new MovedAction(object, self.object.parent, index));
					}
				}
				//Bellow
				else if(event.layerY > 15)
				{
					if(!selfIsProgram || (dragIsScene && selfIsScene) || (!dragIsScene && !selfIsScene))
					{
						var index = self.object.parent.children.indexOf(self.object) + 1;
						Editor.history.add(new MovedAction(object, self.object.parent, index));
					}
				}
				//Inside
				else
				{	
					if((selfIsScene && !dragIsScene) || (dragIsScene && selfIsProgram) || (!selfIsScene && !selfIsProgram && !dragIsScene))
					{
						Editor.history.add(new MovedAction(object, self.object));	
					}
				}
			}
		}
		//Material
		else if(object instanceof THREE.Material)
		{
			var actions = [];
			self.object.traverse(function(children)
			{
				if(children.material !== undefined)
				{
					actions.push(new ChangeAction(children, "material", object));
				}
			});

			if(actions.length > 0)
			{
				Editor.history.add(new ActionBundle(actions));
			}
		}
		//Dragged file
		else if(event.dataTransfer.files.length > 0)
		{
			var files = event.dataTransfer.files;
			for(var i = 0; i < files.length; i++)
			{
				var file = files[i];

				if(Model.fileIsModel(file))
				{
					Editor.loadModel(file, self.object);
				}
			}
		}
	};

	//Click on object
	this.element.onclick = function(event)
	{
		if(event.ctrlKey)
		{
			if(Editor.isObjectSelected(self.object))
			{
				Editor.removeFromSelection(self.object);
			}
			else
			{
				Editor.addToSelection(self.object);
			}
		}
		else
		{
			Editor.selectObject(self.object);
		}
	};

	//Double click
	this.element.ondblclick = function()
	{
		if(!self.object.locked)
		{
			if(self.object instanceof Script)
			{
				openTab(ScriptEditor, self.object);
			}
			else if(self.object instanceof Scene)
			{
				openTab(SceneEditor, self.object);
			}
			else if(self.object instanceof ParticleEmitter)
			{
				openTab(ParticleEditor, self.object);
			}
			else if(self.object instanceof THREE.Camera)
			{
				openTab(CameraEditor, self.object);
			}
		}
	};

	function openTab(Constructor, object)
	{
		var tab = Editor.gui.tab.getTab(Constructor, object);
		if(tab === null)
		{
			tab = Editor.gui.tab.addTab(Constructor, true);
			tab.attach(self.object);
		}
		tab.select();
	}

	function openSceneTab()
	{
		openTab(SceneEditor, self.object);
	}
	function openScriptTab()
	{
		openTab(ScriptEditor, self.object);
	}
	function openParticleTab()
	{
		openTab(ParticleEditor, self.object);
	}
}

TreeElement.ARROW_DOWN = "editor/files/icons/misc/arrow_down.png";
TreeElement.ARROW_RIGHT = "editor/files/icons/misc/arrow_right.png";

TreeElement.prototype = Object.create(Element.prototype);

//Clear element border
TreeElement.prototype.clearBorder = function()
{
	this.element.style.border = null;
	this.element.style.borderTop = null;
	this.element.style.borderBottom = null;
};

//Set object attached to element
TreeElement.prototype.attach = function(object)
{
	this.object = object;
	this.uuid = object.uuid;
	this.folded = object.folded;

	this.element.draggable = !object.locked;

	this.labelText.data = object.name;
	this.icon.src = this.object.locked ? ObjectIcons.locked : ObjectIcons.get(object.type);
	this.arrow.src = this.folded ? TreeElement.ARROW_RIGHT : TreeElement.ARROW_DOWN;
	
	if(Editor.isObjectSelected(object))
	{
		this.element.style.backgroundColor = Editor.theme.buttonOverColor;
	}
};

//Add tree element from object
TreeElement.prototype.addObject = function(object)
{
	var element = new TreeElement(this.container);
	element.attach(object);
	element.parent = this;
	this.children.push(element);
	return element;
};

//Add tree element from object
TreeElement.prototype.insertObject = function(object, index)
{
	var element = new TreeElement(this.container);
	element.attach(object);
	element.parent = this;
	this.children.splice(index, 0, element);
	return element;
};

//Remove element
TreeElement.prototype.removeElementIndex = function(index)
{	
	var element = this.children[index];
	this.children.splice(index, 1);
	return element;
};

//Remove element from uuid
TreeElement.prototype.removeElementUUID = function(uuid)
{	
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].uuid === uuid)
		{
			break;
		}
	}

	if(i < this.children.length)
	{
		var element = this.children[i];
		this.children.splice(i, 1);
		return element;
	}

	return null;
};

//Add tree element from object
TreeElement.prototype.insertElementIndex = function(element, index)
{
	element.parent = this;
	this.children.splice(index, 0, element);
	return element;
};

//Remove element
TreeElement.prototype.destroy = function()
{
	if(this.container.element.contains(this.element))
	{
		this.container.element.removeChild(this.element);
	}
	
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].destroy();
	}
};

//Update folded state for this tree element
TreeElement.prototype.updateFoldedState = function()
{
	this.object.folded = this.folded;
	this.arrow.src = this.folded ? TreeElement.ARROW_RIGHT : TreeElement.ARROW_DOWN;
	this.container.updateChildPosition();
};

TreeElement.prototype.setVisibility = function(visible)
{
	this.visible = visible;
	this.element.style.display = visible ? "block" : "none";
};

//Update interface
TreeElement.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		
		this.labelText.data = this.object.name;

		var offset = this.level * 20;

		//Arrow
		if(this.object.isEmpty())
		{
			this.arrow.style.display = "none";
		}
		else
		{
			this.arrow.style.display = "block";
			this.arrow.style.left = (5 + offset) + "px";
		}

		this.icon.style.left = (25 + offset) + "px";
		this.label.style.left = (45 + offset) + "px";

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
};
