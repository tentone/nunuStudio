"use strict";

function TreeElement(parentNode)
{
	//Container
	this.parentNode = parentNode;

	//Attributes
	this.visible = true;

	//Object attached
	this.uuid = null;
	this.folded = false;
	this.level = this.parent.level + 1;
	this.object = null;

	//Children and parent elements
	this.parent = null;
	this.children = [];

	var self = this;
	var spacing = this.level * 20;

	//Element
	this.element = document.createElement("div");
	this.node.style.position = "static";
	this.node.style.display = "block";
	this.node.style.overflow = "hidden";
	this.parentNode.container.appendChild(this.element);

	//Arrow
	this.arrow = document.createElement("img");
	this.arrow.draggable = false;
	this.arrow.style.position = "absolute";
	this.arrow.style.opacity = 0.5;
	this.arrow.style.width = "15px";
	this.arrow.style.height = "15px";
	this.arrow.style.left = "5px";
	this.arrow.style.top = "3px";
	this.node.appendChild(this.arrow);

	//Icon
	this.icon = document.createElement("img");
	this.icon.draggable = false;
	this.icon.style.position = "absolute";
	this.icon.style.pointerEvents = "none";
	this.icon.style.width = "15px";
	this.icon.style.height = "15px";
	this.icon.style.left = "25px";
	this.icon.style.top = "3px";
	this.node.appendChild(this.icon);

	//Label
	this.label = document.createElement("span");
	this.label.style.overflow = "hidden";
	this.label.style.position = "absolute";
	this.label.style.pointerEvents = "none";
	this.label.style.whiteSpace = "nowrap";
	this.label.style.top = "4px";
	this.node.appendChild(this.label);

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
	this.node.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	//Mouse leave
	this.node.onmouseleave = function()
	{
		if(!Editor.isObjectSelected(self.object))
		{
			this.style.backgroundColor = Editor.theme.buttonLightColor;
		}
	};

	//Drag state
	var state = 0;

	//Clear element border
	function clearBorder()
	{
		self.element.style.border = "";
		self.element.style.borderTop = "";
		self.element.style.borderBottom = "";
	};

	//Drag start
	this.node.ondragstart = function(event)
	{
		if(!self.object.locked)
		{
			event.dataTransfer.setData("uuid", self.object.uuid);
			DragBuffer.pushDragElement(self.object);
		}
	};

	//Drag end
	this.node.ondragend = function(event)
	{
		clearBorder();
		event.preventDefault();

		if(!self.object.locked)
		{
			//Try to remove event from buffer
			var uuid = event.dataTransfer.getData("uuid");
			var obj = DragBuffer.popDragElement(uuid);
		}
	};

	//Drag leave
	this.node.ondragleave = function()
	{
		event.preventDefault();
		clearBorder();
		state = 0;
	};

	//Context menu
	this.node.oncontextmenu = function(event)
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
			else if(self.object instanceof THREE.Object3D)
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
					physics.addShape(Mesh2shape.createShape(object, mode));

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
					createPhysics(self.object, Mesh2shape.Type.BOX);
				});

				physics.addOption("Sphere", function()
				{
					createPhysics(self.object, Mesh2shape.Type.SPHERE);
				});

				physics.addOption("Cylinder", function()
				{
					createPhysics(self.object, Mesh2shape.Type.CYLINDER);
				});
	
				physics.addOption("ConvexHull", function()
				{
					createPhysics(self.object, Mesh2shape.Type.HULL);
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
					var obj = new ObjectLoader().parse(self.object.toJSON());
					obj.traverse(function(child)
					{
						child.uuid = THREE.Math.generateUUID();
					});

					Editor.history.add(new ObjectAddedAction(obj, self.object.parent));
					Editor.gui.treeView.updateObjectsView();
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
					Editor.history.add(new ObjectRemovedAction(self.object));
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
	this.node.ondragover = function(event)
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
		}
	};

	//Drop event (fired on the drop target)
	this.node.ondrop = function(event)
	{
		event.preventDefault();
		clearBorder();

		if(self.object.locked)
		{
			return;
		}

		//Collect element from buffer
		var uuid = event.dataTransfer.getData("uuid");
		var obj = DragBuffer.popDragElement(uuid);

		//Object 3D
		if(obj instanceof THREE.Object3D && obj !== self.object)
		{
			if(ObjectUtils.isChildOf(obj ,self.object))
			{
				Editor.alert("Cannot add object into is child.");
			}
			else
			{
				var selfIsScene = self.object instanceof Scene;
				var selfIsProgram = self.object instanceof Program;
				var dragIsScene = obj instanceof Scene;
				var dragIsProgram = obj instanceof Program;

				//Above
				if(event.layerY < 5)
				{
					if(!selfIsProgram || (dragIsScene && selfIsScene) || (!dragIsScene && !selfIsScene))
					{
						var index = self.object.parent.children.indexOf(self.object);
						Editor.history.add(new ObjectMovedAction(obj, self.object.parent, index));
						self.parentNode.updateObjectsView();
					}
				}
				//Bellow
				else if(event.layerY > 15)
				{
					if(!selfIsProgram || (dragIsScene && selfIsScene) || (!dragIsScene && !selfIsScene))
					{
						var index = self.object.parent.children.indexOf(self.object) + 1;
						Editor.history.add(new ObjectMovedAction(obj, self.object.parent, index));
						self.parentNode.updateObjectsView();
					}
				}
				//Inside
				else
				{	
					if((selfIsScene && !dragIsScene) || (dragIsScene && selfIsProgram) || (!selfIsScene && !selfIsProgram && !dragIsScene))
					{
						Editor.history.add(new ObjectMovedAction(obj, self.object));	
						self.parentNode.updateObjectsView();
					}
				}
			}
		}
		//Material
		else if(obj instanceof THREE.Material)
		{
			var actions = [];
			self.object.traverse(function(children)
			{
				if(children.material !== undefined)
				{
					actions.push(new ChangeAction(children, "material", obj));
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
	this.node.onclick = function(event)
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
	this.node.ondblclick = function()
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

//Set object attached to element
TreeElement.prototype.attach = function(obj)
{
	this.object = obj;
	this.uuid = obj.uuid;
	this.folded = obj.folded;

	this.node.draggable = !obj.locked;

	this.labelText.data = obj.name;
	this.icon.src = this.object.locked ? ObjectIcons.locked : ObjectIcons.get(obj.type);
	this.arrow.src = this.folded ? TreeElement.ARROW_RIGHT : TreeElement.ARROW_DOWN;
	
	if(Editor.isObjectSelected(obj))
	{
		this.node.style.backgroundColor = Editor.theme.buttonOverColor;
	}
};

//Add tree element from object
TreeElement.prototype.addObject = function(obj)
{
	var element = new TreeElement(this.parentNode);
	element.attach(obj);
	element.parent = this;
	this.children.push(element);
	return element;
};

//Add tree element from object
TreeElement.prototype.insertObject = function(obj, index)
{
	var element = new TreeElement(this.parentNode);
	element.attach(obj);
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
	if(this.parentNode.container.contains(this.element))
	{
		this.parentNode.container.removeChild(this.element);
	}
};

//Update folded state for this tree element
TreeElement.prototype.updateFoldedState = function()
{
	this.object.folded = this.folded;
	this.arrow.src = this.folded ? TreeElement.ARROW_RIGHT : TreeElement.ARROW_DOWN;
	this.parentNode.updateChildPosition();
};

TreeElement.prototype.setVisibility = function(visible)
{
	this.visible = visible;
	this.node.style.display = visible ? "block" : "none";
};

//Update interface
TreeElement.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.node.style.display = "block";
		this.arrow.style.display = this.object.isEmpty() ? "none" : "block";
	}
	else
	{
		this.node.style.display = "none";
	}
};
