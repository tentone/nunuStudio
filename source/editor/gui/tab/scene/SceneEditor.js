"use strict";

function SceneEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Scene", Editor.filePath + "icons/misc/scene.png");

	var self = this;

	//Input
	this.keyboard = new Keyboard();
	this.mouse = new Mouse(window, true);

	//Renderer
	this.renderer = null;

	//Canvas
	this.canvas = null;
	this.alpha = true;
	this.resetCanvas();

	//Raycaster
	this.raycaster = new THREE.Raycaster(); 
	this.normalized = new THREE.Vector2();

	//State
	this.state = null;

	//Test program
	this.programRunning = null;

	//Scene
	this.scene = null;

	//Performance meter
	this.stats = new Stats();
	this.stats.dom.style.position = "absolute";
	this.stats.dom.style.display = "none";
	this.stats.dom.style.left = "0px";
	this.stats.dom.style.top = "0px";
	this.stats.dom.style.zIndex = "0";
	this.element.appendChild(this.stats.dom);

	//Helper scene
	this.helperScene = new THREE.Scene();
	this.helperScene.matrixAutoUpdate = false;

	//Tool scene
	this.toolScene = new THREE.Scene();
	this.toolScene.matrixAutoUpdate = false;

	//Camera orientation scene
	this.orientation = new OrientationCube();

	//Grid
	this.gridHelper = new GridHelper(Editor.settings.editor.gridSize, Editor.settings.editor.gridSpacing, 0x888888);
	this.gridHelper.visible = Editor.settings.editor.gridEnabled;
	this.helperScene.add(this.gridHelper);

	//Axis
	this.axisHelper = new THREE.AxesHelper(Editor.settings.editor.gridSize);
	this.axisHelper.material.depthWrite = false;
	this.axisHelper.material.transparent = true;
	this.axisHelper.material.opacity = 1;
	this.axisHelper.visible = Editor.settings.editor.axisEnabled;
	this.helperScene.add(this.axisHelper);

	//Object helper container
	this.objectHelper = new THREE.Group();
	this.objectHelper.matrixAutoUpdate = true;
	this.helperScene.add(this.objectHelper);

	//Tool
	this.toolMode = Editor.SELECT;
	this.tool = new TransformControls(this.camera, this.canvas, this.mouse);
	this.toolScene.add(this.tool);

	//Camera
	this.camera = null;
	this.controls = null;
	this.setCameraMode(SceneEditor.PERSPECTIVE);

	//Fullscreen button
	this.fullscreenButton = new ButtonImage(this);
	this.fullscreenButton.position.set(5, 5);
	this.fullscreenButton.size.set(30, 30);
	this.fullscreenButton.setImage(Editor.filePath + "icons/misc/fullscreen.png");
	this.fullscreenButton.setAltText("Toggle fullscreen");
	this.fullscreenButton.setImageScale(0.8, 0.8);
	this.fullscreenButton.updateSize();
	this.fullscreenButton.updatePosition(Element.BOTTOM_RIGHT);
	this.fullscreenButton.visible = false;
	this.fullscreenButton.element.style.backgroundColor = "#333333";
	this.fullscreenButton.element.style.borderRadius = "5px";
	this.fullscreenButton.element.style.opacity = 0.5;
	this.fullscreenButton.element.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};
	this.fullscreenButton.element.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};

	var fullscreen = true;
	this.fullscreenButton.setOnClick(function()
	{
		self.setFullscreen(fullscreen);
		fullscreen = !fullscreen;
	});

	//VR button
	this.vrButton = new ButtonImage(this);
	this.vrButton.size.set(30, 30);
	this.vrButton.position.set(40, 5);
	this.vrButton.setImage(Editor.filePath + "icons/misc/vr.png");
	this.vrButton.setAltText("Toggle VR mode");
	this.vrButton.setImageScale(0.8, 0.8);
	this.vrButton.updateSize();
	this.vrButton.updatePosition(Element.BOTTOM_RIGHT);
	this.vrButton.visible = false;
	this.vrButton.element.style.backgroundColor = "#333333";
	this.vrButton.element.style.borderRadius = "5px";
	this.vrButton.element.style.opacity = 0.5;
	this.vrButton.element.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};
	this.vrButton.element.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};

	//Transformation mode
	this.transformationSpace = new DropdownList(this);
	this.transformationSpace.size.set(60, 30);
	this.transformationSpace.position.set(145, 5);
	this.transformationSpace.updatePosition(Element.BOTTOM_RIGHT);
	this.transformationSpace.updateSize();
	this.transformationSpace.addValue("Local", "local");
	this.transformationSpace.addValue("World", "world");
	this.transformationSpace.element.style.opacity = 0.5;
	this.transformationSpace.setOnChange(function()
	{
		Editor.settings.editor.transformationSpace = self.transformationSpace.getValue();
		self.tool.setSpace(Editor.settings.editor.transformationSpace);
	});
	this.transformationSpace.element.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};
	this.transformationSpace.element.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};

	//Navigation modes
	this.navigation = new DropdownList(this);
	this.navigation.setAltText("Camera navigation mode");
	this.navigation.size.set(100, 30);
	this.navigation.position.set(40, 5);
	this.navigation.updatePosition(Element.BOTTOM_RIGHT);
	this.navigation.updateSize();
	this.navigation.addValue("First-Person", Settings.FIRST_PERSON);
	this.navigation.addValue("Orbit", Settings.ORBIT);
	this.navigation.addValue("Left", Settings.PLANAR_LEFT);
	this.navigation.addValue("Right", Settings.PLANAR_RIGHT);
	this.navigation.addValue("Front", Settings.PLANAR_FRONT);
	this.navigation.addValue("Back", Settings.PLANAR_BACK);
	this.navigation.addValue("Top", Settings.PLANAR_TOP);
	this.navigation.addValue("Bottom", Settings.PLANAR_BOTTOM);
	this.navigation.element.style.opacity = 0.5;
	this.navigation.setOnChange(function()
	{
		Editor.settings.editor.navigation = self.navigation.getValue();
		self.updateCameraControls(Editor.settings.editor.navigation);
	});
	this.navigation.element.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};
	this.navigation.element.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};

	//Camera mode button
	this.cameraButton = new ButtonImage(this);
	this.cameraButton.position.set(5, 5);
	this.cameraButton.size.set(30, 30);
	this.cameraButton.setImage(Editor.filePath + "icons/misc/3d.png");
	this.cameraButton.setAltText("Change camera mode");
	this.cameraButton.setImageScale(0.8, 0.8);
	this.cameraButton.updateSize();
	this.cameraButton.updatePosition(Element.BOTTOM_RIGHT);
	this.cameraButton.element.style.backgroundColor = "#333333";
	this.cameraButton.element.style.borderRadius = "5px";
	this.cameraButton.element.style.opacity = 0.5;
	this.cameraButton.element.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};
	this.cameraButton.element.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};
	this.cameraButton.setOnClick(function()
	{
		self.setCameraMode();

		if(self.cameraMode === SceneEditor.ORTHOGRAPHIC)
		{
			self.cameraButton.setImage(Editor.filePath + "icons/misc/2d.png");
		}
		else if(self.cameraMode === SceneEditor.PERSPECTIVE)
		{
			self.cameraButton.setImage(Editor.filePath + "icons/misc/3d.png");
		}
	});

	//Event manager
	this.manager = new EventManager();
	this.manager.add(document.body, "keydown", function(event)
	{
		var key = event.keyCode;

		if(self.state === SceneEditor.EDITING)
		{
			if(event.ctrlKey)
			{
				if(self.container.focused)
				{
					if(key === Keyboard.C)
					{
						Editor.copyObject();
					}
					else if(key === Keyboard.V)
					{
						Editor.pasteObject();
					}
					else if(key === Keyboard.X)
					{
						Editor.cutObject();
					}
				}
			}
			else if(key === Keyboard.F5)
			{
				self.setState(SceneEditor.TESTING);
			}
		}
		else if(self.state === SceneEditor.TESTING)
		{
			if(key === Keyboard.F5)
			{
				self.setState(SceneEditor.EDITING);
			}
		}
	});
}

//State
SceneEditor.EDITING = 9;
SceneEditor.TESTING = 11;

//Camera mode
SceneEditor.ORTHOGRAPHIC = 20;
SceneEditor.PERSPECTIVE = 21;

SceneEditor.prototype = Object.create(TabElement.prototype);

SceneEditor.prototype.createRenderer = RendererCanvas.prototype.createRenderer;
SceneEditor.prototype.reloadContext = RendererCanvas.prototype.reloadContext;
SceneEditor.prototype.forceContextLoss = RendererCanvas.prototype.forceContextLoss;

//Update container object data
SceneEditor.prototype.updateMetadata = function()
{
	if(this.scene !== null)
	{
		this.setName(this.scene.name);

		//Check if object has a parent
		if(this.scene.parent === null)
		{
			this.close();
			return;
		}

		//Check if object exists in parent
		var children = this.scene.parent.children;
		for(var i = 0; i < children.length; i++)
		{
			if(this.scene.uuid === children[i].uuid)
			{
				return;
			}
		}

		//If not found close tab
		if(i >= children.length)
		{
			this.close();
		}
	}
};

//Set fullscreen mode
SceneEditor.prototype.setFullscreen = function(fullscreen)
{
	if(fullscreen)
	{
		Nunu.setFullscreen(true, this.element);
		this.position.set(0, 0);	
		this.size.set(window.screen.width, window.screen.height);
		this.updateInterface();
	}
	else
	{
		Nunu.setFullscreen(false);
		Editor.gui.updateInterface();
	}
};

//Activate
SceneEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	if(this.scene instanceof Scene)
	{
		Editor.program.scene = this.scene;
	}

	this.createRenderer();
	this.updateSettings();
	this.setState(SceneEditor.EDITING);

	this.mouse.create();
	this.manager.create();

	Editor.gui.toolBar.selectTool(Editor.SELECT);
};

//Deactivate
SceneEditor.prototype.deactivate = function()
{
	TabElement.prototype.deactivate.call(this);

	Editor.gui.menuBar.run.visible = false;
	Editor.gui.menuBar.run.updateInterface();

	this.mouse.dispose();
	this.manager.destroy();
};

//Update camera controller object
SceneEditor.prototype.updateCameraControls = function(mode)
{
	//Controls
	if(mode === Settings.FIRST_PERSON)
	{
		this.controls = new EditorFreeControls();
	}
	else if(mode === Settings.ORBIT)
	{
		this.controls = new EditorOrbitControls();
	}
	else
	{
		this.controls = new EditorPlanarControls(mode);
	}

	this.controls.attach(this.camera);
}

//Update settings
SceneEditor.prototype.updateSettings = function()
{
	//Grid
	this.gridHelper.visible = Editor.settings.editor.gridEnabled;
	this.gridHelper.setSize(Editor.settings.editor.gridSize);
	this.gridHelper.setSpacing(Editor.settings.editor.gridSpacing);
	this.gridHelper.update();

	//Axis
	this.axisHelper.visible = Editor.settings.editor.axisEnabled;

	//Orientation
	var size = Editor.settings.editor.cameraRotationCubeSize;
	this.orientation.size.set(size, size);

	//Controls
	this.navigation.setValue(Editor.settings.editor.navigation);
	this.updateCameraControls(Editor.settings.editor.navigation);

	//Tool
	this.transformationSpace.setValue(Editor.settings.editor.transformationSpace);
	this.tool.setSpace(Editor.settings.editor.transformationSpace);
	this.tool.setSnap(Editor.settings.editor.snap);
	this.tool.setTranslationSnap(Editor.settings.editor.gridSpacing);
	this.tool.setRotationSnap(Editor.settings.editor.snapAngle);

	//Stats
	this.stats.dom.style.display = (Editor.settings.general.showStats && this.visible) ? "block" : "none";
};

SceneEditor.prototype.destroy = function()
{
	TabElement.prototype.destroy.call(this);

	this.mouse.dispose();
	this.keyboard.dispose();
	this.tool.dispose();

	this.disposeRunningProgram();

	if(this.renderer !== null)
	{
		this.renderer.dispose();
		this.renderer.forceContextLoss();
		this.renderer = null;
	}
};

SceneEditor.prototype.attach = function(scene)
{
	this.scene = scene;
	this.updateMetadata();
};

//Check if scene is attached
SceneEditor.prototype.isAttached = function(scene)
{
	return this.scene === scene;
};

//Update scene editor logic
SceneEditor.prototype.update = function()
{
	this.mouse.update();
	this.keyboard.update();

	if(this.stats !== null)
	{
		this.stats.begin();
	}

	var isEditingObject = false;

	if(this.state === SceneEditor.EDITING)
	{
		//Check if mouse is inside canvas
		if(this.mouse.insideCanvas())
		{
			//Update selection
			if(this.toolMode === Editor.SELECT)
			{
				if(this.mouse.buttonJustPressed(Mouse.LEFT))
				{
					this.selectObjectWithMouse();
				}
				
				if(Editor.selection.length > 0)
				{
					if(this.mouse.buttonDoubleClicked(Mouse.LEFT) || this.keyboard.keyJustPressed(Keyboard.F))
					{
						if(Editor.selection[0].isObject3D === true)
						{
							this.controls.focusObject(Editor.selection[0]);
						}
					}
				}
			}
			else
			{
				//If mouse double clicked select object
				if(this.mouse.buttonDoubleClicked(Mouse.LEFT))
				{
					this.selectObjectWithMouse();
				}

				isEditingObject = this.tool.update();
			}

			//Lock mouse when camera is moving
			if(Editor.settings.editor.lockMouse && Nunu.runningOnDesktop())
			{
				if(!isEditingObject && (this.mouse.buttonJustPressed(Mouse.LEFT) || this.mouse.buttonJustPressed(Mouse.RIGHT) || this.mouse.buttonJustPressed(Mouse.MIDDLE)))
				{
					this.mouse.setLock(true);
				}
				else if(this.mouse.buttonJustReleased(Mouse.LEFT) || this.mouse.buttonJustReleased(Mouse.RIGHT) || this.mouse.buttonJustReleased(Mouse.MIDDLE))
				{
					this.mouse.setLock(false);
				}
			}

			if(isEditingObject)
			{
				Editor.gui.panelContainer.updateValues();
			}
			else
			{
				//Update controls
				this.controls.update(this.mouse, this.keyboard);

				//Update grid helper position
				this.gridHelper.position.x = this.controls.position.x - (this.controls.position.x % Editor.settings.editor.gridSpacing);
				this.gridHelper.position.z = this.controls.position.z - (this.controls.position.z % Editor.settings.editor.gridSpacing);
			}
		}

		//If has objects selected
		if(Editor.hasObjectSelected())
		{
			//Update object transformation matrix
			for(var i = 0; i < Editor.selection.length; i++)
			{
				if(Editor.selection[i].matrixAutoUpdate === false)
				{
					Editor.selection[i].updateMatrix();
				}
			}
			
			//Update object helper
			this.objectHelper.update();
		}
	}
	else if(this.state === SceneEditor.TESTING)
	{
		try
		{
			this.programRunning.update();
		}
		catch(e)
		{
			this.setState(SceneEditor.EDITING);
			Editor.alert("Error testing program\nState update caused an error\n(" + e + ")");
			console.error("nunuStudio: Error updating program state", e);
		}
	}

	this.render();

	if(this.stats !== null)
	{
		this.stats.end();
	}
};

//Scene render
SceneEditor.prototype.render = function()
{
	if(this.renderer === null)
	{
		return;
	}

	var renderer = this.renderer;
	renderer.autoClear = false;

	if(this.state === SceneEditor.EDITING)
	{
		//Render scene
		renderer.setViewport(0, 0, this.canvas.width, this.canvas.height);
		renderer.setScissor(0, 0, this.canvas.width, this.canvas.height);
		renderer.setClearColor(this.scene.background);
		renderer.clear(true, true, true);
		renderer.render(this.scene, this.camera);

		//Render tools
		renderer.render(this.helperScene, this.camera);
		renderer.render(this.toolScene, this.camera);

		//Draw camera cube
		if(Editor.settings.editor.cameraRotationCube)
		{
			var code = this.orientation.raycast(this.mouse, this.canvas);
			
			if(code !== null && (this.mouse.buttonDoubleClicked(Mouse.LEFT) || this.mouse.buttonJustPressed(Mouse.MIDDLE)))
			{
				this.controls.setOrientation(code);
			}

			renderer.clear(false, true, false);
			this.orientation.updateRotation(this.controls);
			this.orientation.render(renderer, this.canvas);
		}

		//Camera preview
		if(Editor.settings.editor.cameraPreviewEnabled)
		{
			var width = Editor.settings.editor.cameraPreviewPercentage * this.canvas.width;
			var height = Editor.settings.editor.cameraPreviewPercentage * this.canvas.height;
			var scene = this.scene;
			
			var position = Editor.settings.editor.cameraPreviewPosition;
			var x = (position === Settings.BOTTOM_RIGHT || position === Settings.TOP_RIGHT) ? this.canvas.width - width - 10 : 10;
			var y = (position === Settings.BOTTOM_RIGHT || position === Settings.BOTTOM_LEFT) ? this.canvas.height - height - 10 : 10;

			renderer.setScissorTest(true);
			renderer.setViewport(x, y, width, height);
			renderer.setScissor(x, y, width, height);

			//Preview selected camera
			if(Editor.selection[0] instanceof PerspectiveCamera || Editor.selection[0] instanceof OrthographicCamera)
			{
				var camera = Editor.selection[0];
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				camera.resize(width, height);

				renderer.setViewport(x + width * camera.offset.x, y + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
				renderer.setScissor(x + width * camera.offset.x, y + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
				renderer.clear(camera.clearColor, camera.clearDepth, camera.clearStencil);
				camera.render(renderer, scene);
			}
			//Cube camera
			else if(Editor.selection[0] instanceof CubeCamera)
			{
				var cameras = Editor.selection[0].cameras;

				function renderCamera(index, x, y, w, h)
				{
					renderer.setViewport(x, y, w, h);
					renderer.setScissor(x, y, w, h);
					renderer.clear(true, true, true);
					cameras[index].updateMatrixWorld();
					cameras[index].render(renderer, scene);
				}

				var size = height/3;
				
				x += width - size * 4;
				
				renderCamera(CubeTexture.LEFT, x, y + size, size, size);
				renderCamera(CubeTexture.FRONT, x + size, y + size, size, size);
				renderCamera(CubeTexture.RIGHT, x + size * 2, y + size, size, size);
				renderCamera(CubeTexture.BACK, x + size * 3, y + size, size, size);
				renderCamera(CubeTexture.TOP, x + size, y + size * 2, size, size);
				renderCamera(CubeTexture.BOTTOM, x + size, y, size, size);
			}
			//Preview all cameras in use
			else if(this.scene.cameras !== undefined && this.scene.cameras.length > 0)
			{
				//Clear before starting rendering
				renderer.clear();

				//Render all cameras
				for(var i = 0; i < scene.cameras.length; i++)
				{
					var camera = scene.cameras[i];
					camera.aspect = width / height;
					camera.updateProjectionMatrix();
					camera.resize(width, height);

					renderer.setViewport(x + width * camera.offset.x, y + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
					renderer.setScissor(x + width * camera.offset.x, y + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
					renderer.clear(camera.clearColor, camera.clearDepth, camera.clearStencil);
					camera.render(renderer, scene);
				}
			}
		}

		//Clear scissor configuration
		renderer.setScissorTest(false);
		renderer.setScissor(0, 0, this.canvas.width, this.canvas.height);
	}
	else if(this.state === SceneEditor.TESTING)
	{
		try
		{
			this.programRunning.render(renderer, this.canvas.width, this.canvas.height);
		}
		catch(e)
		{
			this.setState(SceneEditor.EDITING);
			Editor.alert("Error testing program\nRender caused an error\n(" + e + ")");
			console.error("nunuStudio: Error rendering program", e);
		}
	}
};

SceneEditor.prototype.resetCanvas = function()
{
	RendererCanvas.prototype.resetCanvas.call(this);

	this.mouse.setCanvas(this.canvas);

	//Prevent deafault when object dragged over
	this.canvas.ondragover = Element.preventDefault;

	var self = this;

	//Canvas ondrop
	this.canvas.ondrop = function(event)
	{
		event.preventDefault();

		//Canvas element
		var canvas = self.element;
		var rect = canvas.getBoundingClientRect();

		//Update raycaster direction
		var position = new THREE.Vector2(event.clientX - rect.left, event.clientY - rect.top);
		self.updateRaycaster(position.x / self.canvas.width * 2 - 1, -2 * position.y / self.canvas.height + 1);

		//Get object from drag buffer
		var uuid = event.dataTransfer.getData("uuid");
		var draggedObject = DragBuffer.get(uuid);

		//Check intersected objects
		var intersections = self.raycaster.intersectObjects(self.scene.children, true);

		//Auxiliar method to copy details from a object to a destination
		function copyDetails(destination, object)
		{
			destination.name = object.name;
			destination.visible = object.visible;
			destination.castShadow = object.castShadow;
			destination.receiveShadow = object.receiveShadow;
			destination.frustumCulled = object.frustumCulled;
			destination.renderOrder = object.renderOrder;
			destination.matrixAutoUpdate = object.matrixAutoUpdate;
			destination.position.copy(object.position);
			destination.scale.copy(object.scale);
			destination.quaternion.copy(object.quaternion);
		}

		//Auxiliar method to attach textures to objects
		function attachTexture(texture, object)
		{
			if(object instanceof THREE.Mesh || object instanceof THREE.SkinnedMesh)
			{
				var material = new THREE.MeshStandardMaterial({map:texture, color:0xffffff, roughness: 0.6, metalness: 0.2});
				material.name = texture.name;
				Editor.addAction(new ChangeAction(object, "material", material));
				Editor.updateObjectsViewsGUI();
			}
			else if(object instanceof THREE.Sprite)
			{
				var material = new THREE.SpriteMaterial({map:texture, color:0xffffff});
				material.name = texture.name;
				Editor.addAction(new ChangeAction(object, "material", material));
				Editor.updateObjectsViewsGUI();
			}
		}

		//Dragged file
		if(event.dataTransfer.files.length > 0)
		{
			var files = event.dataTransfer.files;

			for(var i = 0; i < files.length; i++)
			{
				var file = files[i];

				//Check if mouse instersects and object
				if(intersections.length > 0)
				{
					var name = FileSystem.getFileName(file.name);
					var object = intersections[0].object;

					//Image
					if(Image.fileIsImage(file))
					{
						Editor.loadTexture(file, function(texture)
						{
							attachTexture(texture ,object);
						});
					}
					//Video
					else if(Video.fileIsVideo(file))
					{
						Editor.loadVideoTexture(file, function(texture)
						{
							attachTexture(texture ,object);
						});
					}
					//Font
					else if(Font.fileIsFont(file))
					{
						if(object.font !== undefined)
						{
							Editor.loadFont(file, function(font)
							{
								object.setFont(font);
							});
						}
					}
				}
				
				//Model
				if(Model.fileIsModel(file))
				{
					Editor.loadModel(file);
				}
			}
		}
		//Dragged resource
		else if(draggedObject !== null)
		{
			//Object intersected
			if(intersections.length > 0)
			{
				var object = intersections[0].object;

				//Material
				if(draggedObject instanceof THREE.Material)
				{
					//Sprite material
					if(draggedObject instanceof THREE.SpriteMaterial)
					{
						if(object instanceof THREE.Sprite)
						{
							Editor.addAction(new ChangeAction(object, "material", draggedObject));
							Editor.updateObjectsViewsGUI();
						}
					}
					//Points material
					else if(draggedObject instanceof THREE.PointsMaterial)
					{
						if(object instanceof THREE.Points)
						{
							Editor.addAction(new ChangeAction(object, "material", draggedObject));
							Editor.updateObjectsViewsGUI();
						}
						else if(object.geometry !== undefined)
						{
							var newObject = new THREE.Points(object.geometry, draggedObject);
							copyDetails(newObject, object);
							Editor.addAction(new SwapAction(object, newObject, true));
						}
					}
					//Line material
					else if(draggedObject instanceof THREE.LineBasicMaterial)
					{
						if(object instanceof THREE.Line)
						{
							Editor.addAction(new ChangeAction(object, "material", draggedObject));
							Editor.updateObjectsViewsGUI();
						}
						else if(object.geometry !== undefined)
						{
							var newObject = new THREE.Line(object.geometry, draggedObject);
							copyDetails(newObject, object);
							Editor.addAction(new SwapAction(object, newObject, true));
						}
					}
					//Shader material
					else if(draggedObject instanceof THREE.ShaderMaterial)
					{
						if(object.material !== undefined)
						{
							Editor.addAction(new ChangeAction(object, "material", draggedObject));
							Editor.updateObjectsViewsGUI();
						}
					}
					//Mesh material
					else
					{
						if(object instanceof THREE.Mesh)
						{
							Editor.addAction(new ChangeAction(object, "material", draggedObject));
							Editor.updateObjectsViewsGUI();
						}
						else if(object.geometry !== undefined)
						{
							var newObject = new THREE.Mesh(object.geometry, draggedObject);
							copyDetails(newObject, object);
							Editor.addAction(new SwapAction(object, newObject, true));
						}
					}
				}
				//Cubemap
				else if(draggedObject.isCubeTexture === true)
				{
					if(object.material instanceof THREE.Material)
					{
						Editor.addAction(new ChangeAction(object.material, "envMap", draggedObject));
						self.reloadContext();
						Editor.updateObjectsViewsGUI();
					}
				}
				//Texture
				else if(draggedObject instanceof THREE.Texture)
				{
					attachTexture(draggedObject, object);
				}
				//Image
				else if(draggedObject instanceof Image)
				{
					attachTexture(new Texture(draggedObject), object);
				}
				//Video
				else if(draggedObject instanceof Video)
				{
					attachTexture(new VideoTexture(draggedObject), object);
				}
				//Font
				else if(draggedObject instanceof Font)
				{
					if(object.font !== undefined)
					{
						object.setFont(draggedObject);
						Editor.updateObjectsViewsGUI();
					}
				}
				//Geometry
				else if(draggedObject instanceof THREE.Geometry || draggedObject instanceof THREE.BufferGeometry)
				{
					if(object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line)
					{
						Editor.addAction(new ChangeAction(object, "geometry", draggedObject));
						Editor.updateObjectsViewsGUI();
					}
				}
			}

			//Create audio emitter
			if(draggedObject instanceof Audio)
			{
				var audio = new AudioEmitter(draggedObject);
				audio.name = draggedObject.name;
				Editor.addObject(audio);
			}
		}
	};
};

//Update raycaster position from editor mouse position
SceneEditor.prototype.updateRaycasterFromMouse = function()
{
	this.normalized.set((this.mouse.position.x / this.canvas.width) * 2 - 1, -(this.mouse.position.y / this.canvas.height) * 2 + 1);
	this.raycaster.setFromCamera(this.normalized, this.camera);
};

//Select objects with mouse
SceneEditor.prototype.selectObjectWithMouse = function()
{
	this.updateRaycasterFromMouse();

	var intersects = this.raycaster.intersectObjects(this.scene.children, true);
	if(intersects.length > 0)
	{	
		if(this.keyboard.keyPressed(Keyboard.CTRL))
		{	
			if(Editor.isSelected(intersects[0].object))
			{
				Editor.unselectObject(intersects[0].object);
			}
			else
			{
				Editor.addToSelection(intersects[0].object);
			}
		}
		else
		{
			Editor.selectObject(intersects[0].object);
		}
	}
};

//Update editor raycaster with new x and y positions (normalized -1 to 1)
SceneEditor.prototype.updateRaycaster = function(x, y)
{
	this.normalized.set(x, y);
	this.raycaster.setFromCamera(this.normalized, this.camera);
};

//Set camera mode (ortho or perspective)
SceneEditor.prototype.setCameraMode = function(mode)
{
	if(mode === undefined)
	{
		mode = (this.cameraMode === SceneEditor.PERSPECTIVE) ? SceneEditor.ORTHOGRAPHIC : SceneEditor.PERSPECTIVE;
	}
	
	this.cameraMode = mode;

	var aspect = (this.canvas !== null) ? this.canvas.width / this.canvas.height : 1.0;

	if(this.cameraMode === SceneEditor.ORTHOGRAPHIC)
	{
		this.camera = new OrthographicCamera(10, aspect, OrthographicCamera.RESIZE_HORIZONTAL);
	}
	else if(this.cameraMode === SceneEditor.PERSPECTIVE)
	{
		this.camera = new PerspectiveCamera(60, aspect);
	}

	this.tool.setCamera(this.camera);

	if(this.controls !== null)
	{
		this.controls.attach(this.camera);
		this.controls.reset();
	}
};

//Set scene editor state
SceneEditor.prototype.setState = function(state)
{
	this.state = state;

	if(state === SceneEditor.EDITING)
	{
		//Set run button text
		Editor.gui.menuBar.run.setText(Locale.run);
		Editor.gui.menuBar.run.visible = true;
		Editor.gui.menuBar.run.updateInterface();

		//Dispose running program
		this.disposeRunningProgram();

		//Set buttons
		this.fullscreenButton.setVisibility(false);
		this.vrButton.setVisibility(false);
		this.cameraButton.setVisibility(true);
		this.transformationSpace.setVisibility(true);
		this.navigation.setVisibility(true);

		//Update interface
		this.updateInterface();
	}
	else if(state === SceneEditor.TESTING)
	{
		try
		{
			//Run the program directly all changed made with code are kept
			if(Editor.settings.general.immediateMode)
			{
				this.programRunning = Editor.program;
			}
			//Run a copy of the program
			else
			{
				this.programRunning = Editor.program.clone();
			}
			
			//Use editor camera as default camera for program
			this.programRunning.defaultCamera = this.camera;
			this.programRunning.setRenderer(this.renderer);

			//Initialize scene
			this.programRunning.setMouseKeyboard(this.mouse, this.keyboard);
			this.programRunning.initialize();
			this.programRunning.resize(this.canvas.width, this.canvas.height);

			//Show full screen and VR buttons
			this.fullscreenButton.setVisibility(true);
			this.cameraButton.setVisibility(false);
			this.transformationSpace.setVisibility(false);
			this.navigation.setVisibility(false);

			//If program uses VR set button
			if(this.programRunning.vr)
			{
				if(Nunu.webvrAvailable())
				{
					//Show VR button
					this.vrButton.setVisibility(true);

					//Create VR switch callback
					var vr = true;
					this.vrButton.setOnClick(function()
					{
						if(vr)
						{
							this.programRunning.displayVR();
						}
						else
						{
							this.programRunning.exitVR();
						}

						vr = !vr;
					});
				}
			}

			//Lock mouse pointer
			if(this.programRunning.lockPointer)
			{
				this.mouse.setLock(true);
			}

			//Renderer size
			this.renderer.setViewport(0, 0, this.canvas.width, this.canvas.height);
			this.renderer.setScissor(0, 0, this.canvas.width, this.canvas.height);

			//Run button text
			Editor.gui.menuBar.run.setText("Stop");
			Editor.gui.menuBar.run.visible = true;
			Editor.gui.menuBar.run.updateInterface();
		}
		catch(e)
		{
			this.setState(SceneEditor.EDITING);
			Editor.alert("Error testing program\nInitialization caused an error\n(" + e + ")");
			console.error("nunuStudio: Error initializing program", e);
		}
		//Update interface
		this.updateInterface();
	}
};

//Select editing tool
SceneEditor.prototype.selectTool = function(tool)
{	
	if(tool !== undefined)
	{
		this.toolMode = tool;
	}

	if(this.toolMode === Editor.MOVE)
	{
		this.tool.setMode("translate");
		this.tool.setSpace(Editor.settings.editor.transformationSpace);
	}
	else if(this.toolMode === Editor.SCALE)
	{
		this.tool.setMode("scale");
	}
	else if(this.toolMode === Editor.ROTATE)
	{
		this.tool.setMode("rotate");
		this.tool.setSpace(Editor.settings.editor.transformationSpace);
	}
	
	if(this.toolMode === Editor.SELECT)
	{
		this.tool.visible = false;
	}
};

//Select helper to debug selected object data
SceneEditor.prototype.updateSelection = function()
{
	//Filter Object3D objects
	var selectedObjects = [];
	for(var i = 0; i < Editor.selection.length; i++)
	{
		if(Editor.selection[i].isObject3D === true)
		{
			selectedObjects.push(Editor.selection[i]);
		}
	}

	//Transform tool
	this.tool.attach(selectedObjects);
	this.objectHelper.removeAll();

	for(var i = 0; i < selectedObjects.length; i++)
	{
		var object = selectedObjects[i];

		//Camera
		if(object instanceof THREE.Camera)
		{
			this.objectHelper.add(new THREE.CameraHelper(object));
			this.objectHelper.add(new ObjectIconHelper(object, Editor.filePath + "icons/camera/camera.png"));
		}
		//Light
		else if(object instanceof THREE.Light)
		{
			//Directional light
			if(object instanceof THREE.DirectionalLight)
			{
				this.objectHelper.add(new THREE.DirectionalLightHelper(object, 1));
			}
			//Point light
			else if(object instanceof THREE.PointLight)
			{
				this.objectHelper.add(new THREE.PointLightHelper(object, 1));
			}
			//RectArea light
			else if(object instanceof THREE.RectAreaLight)
			{
				this.objectHelper.add(new RectAreaLightHelper(object));
			}
			//Spot light
			else if(object instanceof THREE.SpotLight)
			{
				this.objectHelper.add(new THREE.SpotLightHelper(object));
			}
			//Hemisphere light
			else if(object instanceof THREE.HemisphereLight)
			{
				this.objectHelper.add(new THREE.HemisphereLightHelper(object, 1));
			}
			//Ambient light
			else
			{
				this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
			}
		}
		//Physics
		else if(object instanceof PhysicsObject)
		{
			this.objectHelper.add(new PhysicsObjectHelper(object));
		}
		//LensFlare
		else if(object instanceof LensFlare)
		{
			this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
		}
		//Skinned Mesh
		else if(object instanceof THREE.SkinnedMesh)
		{
			this.objectHelper.add(new SkeletonHelper(object.parent));
			this.objectHelper.add(new WireframeHelper(object, 0xFFFF00));
		}
		//Bone
		else if(object instanceof THREE.Bone)
		{
			this.objectHelper.add(new SkeletonHelper(object.parent));
			this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
		}
		//Mesh
		else if(object instanceof THREE.Mesh)
		{
			this.objectHelper.add(new WireframeHelper(object, 0xFFFF00));
		}
		//Line
		else if(object instanceof THREE.Line)
		{
			this.objectHelper.add(new LineHelper(object, 0xFFFF00));
		}
		//Points
		else if(object instanceof THREE.Points)
		{
			this.objectHelper.add(new PointsHelper(object, 0xFFFF00));
		}
		//Spine animation
		else if(object instanceof SpineAnimation)
		{
			this.objectHelper.add(new WireframeHelper(object, 0xFFFFFF));
			this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
		}
		//Container
		else if(object instanceof Container)
		{
			this.objectHelper.add(new THREE.BoxHelper(object, 0xFFFF00));
			this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
		}
		//Object 3D
		else
		{
			this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
		}
	}
};

//Dispose running program if there is one
SceneEditor.prototype.disposeRunningProgram = function()
{
	//Dispose running program if there is one
	if(this.programRunning !== null)
	{
		this.setFullscreen(false);
		this.programRunning.dispose();
		this.programRunning = null;
	}

	//Unlock mouse
	this.mouse.setLock(false);
};

//Resize scene editor canvas and camera
SceneEditor.prototype.resizeCanvas = function()
{
	var width = this.size.x * window.devicePixelRatio;
	var height = this.size.y * window.devicePixelRatio;

	this.canvas.width = width;
	this.canvas.height = height;
	this.canvas.style.width = this.size.x + "px";
	this.canvas.style.height = this.size.y + "px";

	if(this.renderer !== null)
	{
		this.renderer.setSize(this.size.x, this.size.y, false);

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		if(this.state === SceneEditor.TESTING)
		{
			this.programRunning.resize(width, height);
		}
	}
};

SceneEditor.prototype.updateVisibility = function()
{
	TabElement.prototype.updateVisibility.call(this);

	this.stats.dom.style.display = (Editor.settings.general.showStats && this.visible) ? "block" : "none";
};

//Update scene editor interface
SceneEditor.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);

	this.resizeCanvas();
};
