"use strict";

function TreeElement(parent)
{
	//Children
	this.parent = parent;

	//Data
	this.visible = true;
	this.level = this.parent.level + 1;
	this.object = null;

	var self = this;
	var spacing = this.level * 20;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "static";
	this.element.style.display = "block";
	this.element.style.overflow = "hidden";
	this.parent.children.appendChild(this.element);

	//Node
	this.node = document.createElement("div")
	this.node.style.position = "static";
	this.node.style.display = "block";
	this.node.style.overflow = "hidden";
	this.node.style.height = "20px";
	this.node.draggable = true;
	this.element.appendChild(this.node);

	//Children
	this.children = document.createElement("div");
	this.children.style.overflow = "hidden";
	this.children.style.position = "static";
	this.children.style.display = "block";
	this.element.appendChild(this.children);

	//Arrow
	this.arrow = document.createElement("img");
	this.arrow.style.position = "absolute";
	this.arrow.style.display = "block";
	this.arrow.style.height = "16px";
	this.arrow.style.width = "16px";
	this.arrow.style.opacity = "0.5";
	this.arrow.style.left = spacing + "px";
	this.arrow.style.paddingTop = "2px";
	this.arrow.style.cursor = "pointer";
	this.node.appendChild(this.arrow);

	//Icon
	this.icon = document.createElement("img");
	this.icon.style.position = "absolute";
	this.icon.style.display = "block";
	this.icon.style.height = "16px";
	this.icon.style.width = "16px";
	this.icon.style.paddingTop = "2px";
	this.icon.style.left = (spacing + 20) + "px";
	this.node.appendChild(this.icon);

	//Span
	this.span = document.createElement("span");
	this.span.style.position = "absolute";
	this.span.style.display = "block";
	this.span.style.left = (spacing + 40) + "px";
	this.span.style.paddingTop = "2px";
	this.span.style.height = "16px";
	this.node.appendChild(this.span);

	//Text
	this.text = document.createTextNode("node");
	this.span.appendChild(this.text);

	var self = this;

	this.arrow.onmouseenter = function()
	{
		this.style.opacity = "1.0";
	};

	this.arrow.onmouseleave = function()
	{
		this.style.opacity = "0.5";
	};

	this.arrow.onclick = function()
	{
		if(self.object.folded)
		{
			self.expand();
		}
		else
		{
			self.collapse();
		}
	};

	//Mouse enter
	this.node.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	//Mouse leave
	this.node.onmouseleave = function()
	{
		//if(!Editor.isObjectSelected(self.object))
		//{
			this.style.backgroundColor = Editor.theme.buttonLightColor;
		//}
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
						self.parent.updateObjectsView();
					}
				}
				//Bellow
				else if(event.layerY > 15)
				{
					if(!selfIsProgram || (dragIsScene && selfIsScene) || (!dragIsScene && !selfIsScene))
					{
						var index = self.object.parent.children.indexOf(self.object) + 1;
						Editor.history.add(new ObjectMovedAction(obj, self.object.parent, index));
						self.parent.updateObjectsView();
					}
				}
				//Inside
				else
				{	
					if((selfIsScene && !dragIsScene) || (dragIsScene && selfIsProgram) || (!selfIsScene && !selfIsProgram && !dragIsScene))
					{
						Editor.history.add(new ObjectMovedAction(obj, self.object));	
						self.parent.updateObjectsView();
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
TreeElement.prototype.attach = function(object)
{
	this.object = object;

	if(object.locked)
	{
		this.node.draggable = false;
		this.icon.src = ObjectIcons.locked;
	}
	else
	{
		this.icon.src = ObjectIcons.get(object.type);
	}
	
	this.arrow.style.visibility = this.object.isEmpty() ? "hidden" : "visible";
	this.text.data = object.name;
	
	if(object.folded)
	{
		this.children.style.display = "none";
		this.arrow.src = TreeElement.ARROW_RIGHT;
	}
	else
	{
		this.children.style.display = "block";
		this.arrow.src = TreeElement.ARROW_DOWN;
	}

	if(Editor.isObjectSelected(object))
	{
		this.node.style.backgroundColor = Editor.theme.buttonOverColor;
	}
};

//Collapse the tree node.
TreeElement.prototype.collapse = function()
{
	this.object.folded = true;
	this.children.style.display = "none";
	this.arrow.src = TreeElement.ARROW_RIGHT;
};

//Expand the tree node.
TreeElement.prototype.expand = function()
{
	this.object.folded = false;
	this.children.style.display = "block";
	this.arrow.src = TreeElement.ARROW_DOWN;
};

//Add tree element from object
TreeElement.prototype.addObject = function(object)
{
	var element = new TreeElement(this);
	element.attach(object);
	return element;
};

/*
//Add tree element from object
TreeElement.prototype.insertObject = function(obj, index)
{
	//TODO <CHECK THIS CODE>
	var element = new TreeElement(this.parent);
	element.attach(obj);
	element.parent = this;
	this.children.splice(index, 0, element);
	return element;
};

//Remove element
TreeElement.prototype.removeElementIndex = function(index)
{	
	//TODO <CHECK THIS CODE>
	var element = this.children[index];
	this.children.splice(index, 1);
	return element;
};

//Add tree element from object
TreeElement.prototype.insertElementIndex = function(element, index)
{
	//TODO <CHECK THIS CODE>
	element.parent = this;
	this.children.splice(index, 0, element);
	return element;
};
*/

//Remove element
TreeElement.prototype.destroy = function()
{
	if(this.parent.children.contains(this.element))
	{
		this.parent.children.removeChild(this.element);
	}
};

//Update interface
TreeElement.prototype.updateInterface = function(){};
