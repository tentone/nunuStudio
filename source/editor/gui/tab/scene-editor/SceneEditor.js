"use strict";

/** 
 * The scene editor is the core of the nunuStudio editor.
 *
 * It is used to edit the scenes and apply changes to the objects using helper objects.
 *
 * @class SceneEditor
 * @extends {TabComponent}
 */
function SceneEditor(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.scene, Global.FILE_PATH + "icons/misc/scene.png");

	var self = this;

	/**
	 * Rendering canvas element where the scene is presented.
	 *
	 * @attribute canvas
	 * @type {RendererCanvas}
	 */
	this.canvas = new RendererCanvas(this, Editor.getRendererConfig());
	this.canvas.resetCanvas = function()
	{
		RendererCanvas.prototype.resetCanvas.call(this);

		self.transform.setCanvas(this.canvas);
		self.mouse.setCanvas(this.canvas);

		this.canvas.ondragover = Component.preventDefault;
		this.canvas.ondrop = function(event)
		{
			event.preventDefault();

			var uuid = event.dataTransfer.getData("uuid");
			var draggedObject = DragBuffer.get(uuid);

			var canvas = this;
			var rect = canvas.getBoundingClientRect();

			var position = new THREE.Vector2(event.clientX - rect.left, event.clientY - rect.top);
			var normalized = new THREE.Vector2(position.x / self.canvas.size.x * 2.0 - 1.0, -2.0 * position.y / self.canvas.size.y + 1.0);
			self.raycaster.setFromCamera(normalized, self.camera);

			var intersections = self.raycaster.intersectObjects(self.scene.children, true);

			// Auxiliar method to copy details from a object to a destination
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

			// Auxiliar method to attach textures to objects
			function attachTexture(texture, object)
			{
				var material = null;
				if(object instanceof THREE.Mesh || object instanceof THREE.SkinnedMesh)
				{
					material = new THREE.MeshStandardMaterial({map:texture, color:0xffffff, roughness: 0.6, metalness: 0.2});
					material.name = texture.name;
				}
				else if(object instanceof THREE.Line)
				{
					material = new THREE.LineBasicMaterial({color:0xffffff});
					material.name = texture.name;
				}
				else if(object instanceof THREE.Points)
				{
					material = new THREE.PointsMaterial({map:texture, color:0xffffff});
					material.name = texture.name;
				}
				else if(object instanceof THREE.Sprite)
				{
					material = new THREE.SpriteMaterial({map:texture, color:0xffffff});
					material.name = texture.name;
				}

				Editor.addAction(new ActionBundle(
				[
					new AddResourceAction(material, Editor.program, "materials"), 
					new ChangeAction(object, "material", material)
				]));
			}

			// Dragged file
			if(event.dataTransfer.files.length > 0)
			{
				var files = event.dataTransfer.files;

				for(var i = 0; i < files.length; i++)
				{
					var file = files[i];

					// Check if mouse intersects and object
					if(intersections.length > 0)
					{
						var name = FileSystem.getFileName(file.name);
						var object = intersections[0].object;

						// Image
						if(Image.fileIsImage(file))
						{
							Editor.loadTexture(file, function(texture)
							{
								attachTexture(texture ,object);
							});
						}
						// Video
						else if(Video.fileIsVideo(file))
						{
							Editor.loadVideoTexture(file, function(texture)
							{
								attachTexture(texture ,object);
							});
						}
						// Font
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
					
					// Model
					if(Model.fileIsModel(file))
					{
						Editor.loadModel(file);
					}
				}
			}
			// Dragged resource
			else if(draggedObject !== null)
			{
				// Object intersected
				if(intersections.length > 0)
				{
					var object = intersections[0].object;

					// Material
					if(draggedObject instanceof THREE.Material)
					{
						// Sprite material
						if(draggedObject instanceof THREE.SpriteMaterial)
						{
							if(object instanceof THREE.Sprite)
							{
								Editor.addAction(new ChangeAction(object, "material", draggedObject));
							}
						}
						// Points material
						else if(draggedObject instanceof THREE.PointsMaterial)
						{
							if(object instanceof THREE.Points)
							{
								Editor.addAction(new ChangeAction(object, "material", draggedObject));
							}
							else if(object.geometry !== undefined)
							{
								var newObject = new THREE.Points(object.geometry, draggedObject);
								copyDetails(newObject, object);
								Editor.addAction(new SwapAction(object, newObject, true));
							}
						}
						// Line material
						else if(draggedObject instanceof THREE.LineBasicMaterial)
						{
							if(object instanceof THREE.Line)
							{
								Editor.addAction(new ChangeAction(object, "material", draggedObject));
							}
							else if(object.geometry !== undefined)
							{
								var newObject = new THREE.Line(object.geometry, draggedObject);
								copyDetails(newObject, object);
								Editor.addAction(new SwapAction(object, newObject, true));
							}
						}
						// Shader material
						else if(draggedObject instanceof THREE.ShaderMaterial)
						{
							if(object.material !== undefined)
							{
								Editor.addAction(new ChangeAction(object, "material", draggedObject));
							}
						}
						// Mesh material
						else
						{
							if(object instanceof THREE.Mesh)
							{
								Editor.addAction(new ChangeAction(object, "material", draggedObject));
							}
							else if(object.geometry !== undefined)
							{
								var newObject = new THREE.Mesh(object.geometry, draggedObject);
								copyDetails(newObject, object);
								Editor.addAction(new SwapAction(object, newObject, true));
							}
						}
					}
					// Cubemap
					else if(draggedObject.isCubeTexture === true)
					{
						if(object.material instanceof THREE.Material)
						{
							Editor.addAction(new ChangeAction(object.material, "envMap", draggedObject));
							self.canvas.reloadContext();
						}
					}
					// Texture
					else if(draggedObject instanceof THREE.Texture)
					{
						attachTexture(draggedObject, object);
					}
					// Image
					else if(draggedObject instanceof Image)
					{
						attachTexture(new Texture(draggedObject), object);
					}
					// Video
					else if(draggedObject instanceof Video)
					{
						attachTexture(new VideoTexture(draggedObject), object);
					}
					// Font
					else if(draggedObject instanceof Font)
					{
						if(object.font !== undefined)
						{
							object.setFont(draggedObject);
							Editor.updateObjectsViewsGUI();
						}
					}
					// Geometry
					else if(draggedObject instanceof THREE.Geometry || draggedObject instanceof THREE.BufferGeometry)
					{
						if(object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line)
						{
							Editor.addAction(new ChangeAction(object, "geometry", draggedObject));
						}
					}
				}

				// Create audio emitter
				if(draggedObject instanceof Audio)
				{
					var audio = new AudioEmitter(draggedObject);
					audio.name = draggedObject.name;
					Editor.addObject(audio);
				}
			}
		};
	};

	/**
	 * Keyboard input object.
	 *
	 * @attribute keyboard
	 * @type {Keyboard}
	 */
	this.keyboard = new Keyboard();

	/** 
	 * Mouse input object
	 *
	 * It is attached to the window object to capture movement outside of the tab division.
	 *
	 * @attribute mouse
	 * @type {Mouse}
	 */
	this.mouse = new Mouse(window, true);

	/** 
	 * Raycaster object used for object picking.
	 *
	 * @attribute raycaster
	 * @type {THREE.Raycaster}
	 */
	this.raycaster = new THREE.Raycaster();

	/**
	 * Normalized mouse coordinates for raycasting.
	 *
	 * @attribute normalized
	 * @type {THREE.Vector2}
	 */
	this.normalized = new THREE.Vector2();

	/**
	 * Scene being edited in this tab.
	 *
	 * Can also be a regular 3D object.
	 *
	 * @attribute scene
	 * @type {THREE.Object3D}
	 */
	this.scene = null;

	/** 
	 * The tool bar contains the selector for the transform tools and object placing icons.
	 *
	 * @attribute sideBar
	 * @type {SideBar}
	 */
	this.sideBar = new SideBar(this);
	
	/**
	 * Camera orientation cube.
	 *
	 * Used to preview the orientation of the editor camera.
	 *
	 * @attribute orientation
	 * @type {OrientationCube}
	 */
	this.orientation = new OrientationCube();

	/**
	 * Helper scene stored the object and editor preview objects.
	 *
	 * @attribute helperScene
	 * @type {THREE.Scene}
	 */
	this.helperScene = new THREE.Scene();
	this.helperScene.matrixAutoUpdate = false;

	/**
	 * Grid helper configured to match editor settings.
	 *
	 * @attribute gridHelper
	 * @type {GridHelper}
	 */
	this.gridHelper = new GridHelper(Editor.settings.editor.gridSize, Editor.settings.editor.gridSpacing, 0x888888);
	this.gridHelper.visible = Editor.settings.editor.gridEnabled;
	this.helperScene.add(this.gridHelper);

	/**
	 * Axes helper configured to match editor settings.
	 *
	 * @attribute axisHelper
	 * @type {THREE.AxesHelper}
	 */
	this.axisHelper = new THREE.AxesHelper(Editor.settings.editor.gridSize);
	this.axisHelper.material.depthWrite = false;
	this.axisHelper.material.transparent = true;
	this.axisHelper.material.opacity = 1.0;
	this.axisHelper.visible = Editor.settings.editor.axisEnabled;
	this.helperScene.add(this.axisHelper);

	/**
	 * Object helper container.
	 *
	 * @attribute objectHelper
	 * @type {THREE.Group}
	 */
	this.objectHelper = new THREE.Group();
	this.objectHelper.matrixAutoUpdate = true;
	this.helperScene.add(this.objectHelper);

	/**
	 * Group where the object manipulation tools are drawn
	 *
	 * @attribute toolScene
	 * @type {THREE.Scene}
	 */
	this.toolScene = new THREE.Scene();
	this.toolScene.matrixAutoUpdate = false;

	/**
	 * Editor manipulation mode.
	 *
	 * @attribute mode
	 * @type {number}
	 */
	this.mode = SceneEditor.SELECT;

	/** 
	 * Transform controls tool.
	 *
	 * @attribute transform
	 * @type {TransformControls}
	 */
	this.transform = new TransformControls(this.camera, null, this.mouse);
	this.transform.visible = false;
	this.toolScene.add(this.transform);

	/**
	 * Camera object used to visualize the scene.
	 *
	 * This object is attached to the scene as the defaultCamera, allowing it to be used for runtime when there is no default camera.
	 *
	 * Can be a an OrthographicCamera or PerspectiveCamera dependeing on the cameraMode value.
	 *
	 * @attribute camera
	 * @type {THREE.Camera}
	 */
	this.camera = null;
	
	/** 
	 * Camera controls object used to manipulate the camera position.
	 *
	 * Can be EditorFreeControls, EditorOrbitControls or EditorPlanarControls.
	 *
	 * @attribute controls
	 * @type {THREE.Group}
	 */
	this.controls = null;
	this.controlsMode = -1;
	this.setCameraMode(SceneEditor.PERSPECTIVE);

	/**
	 * Transformation controls mode can be local or world.
	 *
	 * @attribute transformationSpace
	 * @type {DropdownList}
	 */
	this.transformationSpace = new DropdownList(this);
	this.transformationSpace.size.set(60, 30);
	this.transformationSpace.position.set(145, 5);
	this.transformationSpace.updatePosition(Component.BOTTOM_RIGHT);
	this.transformationSpace.updateSize();
	this.transformationSpace.addValue(Locale.local, TransformControls.LOCAL);
	this.transformationSpace.addValue(Locale.world, TransformControls.WORLD);
	this.transformationSpace.element.style.opacity = 0.5;
	this.transformationSpace.setOnChange(function()
	{
		var space = self.transformationSpace.getValue();
		Editor.settings.editor.transformationSpace = space;
		self.transform.space = space;
	});
	this.transformationSpace.element.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};
	this.transformationSpace.element.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};

	/**
	 * Dropdown to select the world navigation mode to use.
	 *
	 * @attribute navigation
	 * @type {DropdownList}
	 */
	this.navigation = new DropdownList(this);
	this.navigation.setAltText(Locale.cameraNavigation);
	this.navigation.size.set(100, 30);
	this.navigation.position.set(40, 5);
	this.navigation.updatePosition(Component.BOTTOM_RIGHT);
	this.navigation.updateSize();
	this.navigation.addValue(Locale.firstPerson, Settings.FIRST_PERSON);
	this.navigation.addValue(Locale.orbit, Settings.ORBIT);
	this.navigation.addValue(Locale.left, Settings.PLANAR_LEFT);
	this.navigation.addValue(Locale.right, Settings.PLANAR_RIGHT);
	this.navigation.addValue(Locale.front, Settings.PLANAR_FRONT);
	this.navigation.addValue(Locale.back, Settings.PLANAR_BACK);
	this.navigation.addValue(Locale.top, Settings.PLANAR_TOP);
	this.navigation.addValue(Locale.bottom, Settings.PLANAR_BOTTOM);
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

	/**
	 * Button to toggle snap to grid functionality
	 *
	 * @method snapGridButton
	 * @type {ButtonImage}
	 */
	this.snapGridButton = new ButtonImage(this);
	this.snapGridButton.position.set(5, 40);
	this.snapGridButton.size.set(30, 30);
	this.snapGridButton.setImage(Global.FILE_PATH + "icons/misc/" + (Editor.settings.editor.snap ? "grid" : "freemove") + ".png");
	this.snapGridButton.setAltText(Locale.toggleSnapToGrid);
	this.snapGridButton.setImageScale(0.8, 0.8);
	this.snapGridButton.updateSize();
	this.snapGridButton.updatePosition(Component.BOTTOM_RIGHT);
	this.snapGridButton.element.style.backgroundColor = "#333333";
	this.snapGridButton.element.style.borderRadius = "5px";
	this.snapGridButton.element.style.opacity = 0.5;
	this.snapGridButton.element.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};
	this.snapGridButton.element.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};
	this.snapGridButton.setOnClick(function()
	{
		Editor.settings.editor.snap = !Editor.settings.editor.snap;
		self.transform.snap = Editor.settings.editor.snap;

		self.snapGridButton.setImage(Global.FILE_PATH + "icons/misc/" + (Editor.settings.editor.snap ? "grid" : "freemove") + ".png");
	});

	/**
	 * Button to toggle the camera mode between ORTHOGRAPHIC and PERSPECTIVE.
	 *
	 * @method cameraButton
	 * @type {ButtonImage}
	 */
	this.cameraButton = new ButtonImage(this);
	this.cameraButton.position.set(5, 5);
	this.cameraButton.size.set(30, 30);
	this.cameraButton.setImage(Global.FILE_PATH + "icons/misc/3d.png");
	this.cameraButton.setAltText(Locale.cameraMode);
	this.cameraButton.setImageScale(0.8, 0.8);
	this.cameraButton.updateSize();
	this.cameraButton.updatePosition(Component.BOTTOM_RIGHT);
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
			self.cameraButton.setImage(Global.FILE_PATH + "icons/misc/2d.png");
		}
		else if(self.cameraMode === SceneEditor.PERSPECTIVE)
		{
			self.cameraButton.setImage(Global.FILE_PATH + "icons/misc/3d.png");
		}
	});

	/**
	 * Event manager to handley keyboard shortcuts.
	 *
	 * @attribute manager
	 * @type {EventManager}
	 */
	this.manager = new EventManager();
	this.manager.add(document.body, "keydown", function(event)
	{
		var key = event.keyCode;

		if(event.ctrlKey)
		{
			if(self.container.focused)
			{
				if(key === Keyboard.NUM1)
				{
					self.sideBar.selectTool(SceneEditor.SELECT);
				}
				else if(key === Keyboard.NUM2)
				{
					self.sideBar.selectTool(SceneEditor.MOVE);
				}
				else if(key === Keyboard.NUM3)
				{
					self.sideBar.selectTool(SceneEditor.SCALE);
				}
				else if(key === Keyboard.NUM4)
				{
					self.sideBar.selectTool(SceneEditor.ROTATE);
				}
				else if(key === Keyboard.C)
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
	});

	this.canvas.resetCanvas();
}

SceneEditor.ORTHOGRAPHIC = 20;
SceneEditor.PERSPECTIVE = 21;

SceneEditor.SELECT = 0;
SceneEditor.MOVE = 100;
SceneEditor.SCALE = 101;
SceneEditor.ROTATE = 102;

SceneEditor.prototype = Object.create(TabComponent.prototype);

SceneEditor.prototype.createRenderer = RendererCanvas.prototype.createRenderer;
SceneEditor.prototype.reloadContext = RendererCanvas.prototype.reloadContext;
SceneEditor.prototype.forceContextLoss = RendererCanvas.prototype.forceContextLoss;

SceneEditor.prototype.updateMetadata = function()
{
	if(this.scene !== null)
	{
		this.setName(this.scene.name);

		// Check if object has a parent
		if(this.scene.parent === null)
		{
			this.close();
			return;
		}

		// Check if object exists in parent
		var children = this.scene.parent.children;
		for(var i = 0; i < children.length; i++)
		{
			if(this.scene.uuid === children[i].uuid)
			{
				return;
			}
		}

		// If not found close tab
		if(i >= children.length)
		{
			this.close();
		}
	}
};

SceneEditor.prototype.activate = function()
{
	TabComponent.prototype.activate.call(this);

	this.canvas.createRenderer();
	this.updateSettings();

	this.mouse.setLock(false);

	this.mouse.create();
	this.manager.create();

	this.sideBar.selectTool(SceneEditor.SELECT);
};

SceneEditor.prototype.deactivate = function()
{
	TabComponent.prototype.deactivate.call(this);

	this.mouse.dispose();
	this.manager.destroy();
};

/**
 * Update camera controller object.
 * 
 * Select a new controls object based on the mode passed as argument and attach the editor camera to it.
 *
 * @method updateCameraControls
 * @param {number} mode Camera mode.
 */
SceneEditor.prototype.updateCameraControls = function(mode)
{
	if(this.controlsMode === mode)
	{
		return;
	}
	
	this.controlsMode = mode;

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

SceneEditor.prototype.updateSettings = function()
{
	// Grid
	this.gridHelper.visible = Editor.settings.editor.gridEnabled;
	this.gridHelper.setSize(Editor.settings.editor.gridSize);
	this.gridHelper.setSpacing(Editor.settings.editor.gridSpacing);
	this.gridHelper.update();

	// Axis
	this.axisHelper.visible = Editor.settings.editor.axisEnabled;

	// Orientation
	var size = Editor.settings.editor.cameraRotationCubeSize;
	this.orientation.viewport.size.set(size, size);

	// Controls
	this.navigation.setValue(Editor.settings.editor.navigation);
	this.updateCameraControls(Editor.settings.editor.navigation);

	// Tool
	this.transformationSpace.setValue(Editor.settings.editor.transformationSpace);
	this.transform.space = Editor.settings.editor.transformationSpace;
	this.transform.snap = Editor.settings.editor.snap;
	this.transform.translationSnap = Editor.settings.editor.gridSpacing;
	this.transform.rotationSnap = Editor.settings.editor.snapAngle;
};

SceneEditor.prototype.destroy = function()
{
	TabComponent.prototype.destroy.call(this);

	this.mouse.dispose();
	this.keyboard.dispose();
	this.transform.dispose();

	this.mouse.setLock(false);

	this.canvas.forceContextLoss();
};

SceneEditor.prototype.attach = function(scene)
{
	this.scene = scene;
	this.updateMetadata();

	if(this.camera !== null)
	{
		this.scene.defaultCamera = this.camera;
	}
};

/**
 * Check if a scene or object is attached to the editor.
 *
 * @method isAttached
 * @param {THREE.Object3D} scene
 */
SceneEditor.prototype.isAttached = function(scene)
{
	return this.scene === scene;
};

/**
 * Update scene editor logic.
 *
 * @method update
 */
SceneEditor.prototype.update = function()
{
	this.mouse.update();
	this.keyboard.update();

	var isEditingObject = this.transform.update();

	// Check if mouse is inside canvas
	if(this.mouse.insideCanvas())
	{
		// Update selection
		if(this.mode === SceneEditor.SELECT)
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
			// If mouse double clicked select object
			if(this.mouse.buttonDoubleClicked(Mouse.LEFT))
			{
				this.selectObjectWithMouse();
			}	
		}

		// Lock mouse when camera is moving
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
			Editor.gui.inspector.updateValues();
		}
		else
		{
			// Update controls
			this.controls.update(this.mouse, this.keyboard);

			// Update grid helper position
			this.gridHelper.position.x = this.controls.position.x - (this.controls.position.x % Editor.settings.editor.gridSpacing);
			this.gridHelper.position.z = this.controls.position.z - (this.controls.position.z % Editor.settings.editor.gridSpacing);
		}
	}

	// If has objects selected
	if(Editor.hasObjectSelected())
	{
		// Update object transformation matrix
		for(var i = 0; i < Editor.selection.length; i++)
		{
			if(Editor.selection[i].matrixAutoUpdate === false)
			{
				Editor.selection[i].updateMatrix();
			}
		}
		
		// Update object helper
		this.objectHelper.traverse(function(children)
		{
			children.update();	
		});
	}

	this.render();

};

/**
 * Render all the editor scenes to the canvas using the renderer.
 *
 * Draws the attached scene/object after that it renders the helpers and tool scenes, the overlay orientation cube and then the camera previews.
 * 
 * @method render
 */
SceneEditor.prototype.render = function()
{
	if(this.canvas.renderer === null)
	{
		console.warn("nunuStudio: SceneEditor renderer is null.", this);
		return;
	}

	var width = this.canvas.resolution.x;
	var height = this.canvas.resolution.y;
	var canvas = this.canvas.canvas;
	var renderer = this.canvas.renderer;

	renderer.autoClear = false;
	renderer.setViewport(0, 0, width, height);
	renderer.setScissor(0, 0, width, height);

	// Clear with scene background
	renderer.setClearColor(this.scene.background);
	renderer.clear(true, true, true);

	// Render scene
	renderer.render(this.scene, this.camera);

	if(this.canvas.cssRenderer !== null)
	{
		this.canvas.cssRenderer.render(this.scene, this.camera);
	}

	renderer.render(this.helperScene, this.camera);
	renderer.render(this.toolScene, this.camera);

	// Draw camera cube
	if(Editor.settings.editor.cameraRotationCube)
	{
		var code = this.orientation.raycast(this.mouse, canvas);
		
		if(code !== null && (this.mouse.buttonDoubleClicked(Mouse.LEFT) || this.mouse.buttonJustPressed(Mouse.MIDDLE)))
		{
			this.controls.setOrientation(code);
		}

		renderer.clear(false, true, false);
		this.orientation.updateRotation(this.controls);
		this.orientation.render(renderer, canvas);
	}

	// Camera preview
	if(Editor.settings.editor.cameraPreviewEnabled)
	{
		renderer.setScissorTest(true);

		var previewRatio = 16.0 / 9.0;

		var viewport = new Viewport();
		viewport.width = width;
		viewport.height = height;
		viewport.offset = new THREE.Vector2(10, 10);
		viewport.size = new THREE.Vector2(Editor.settings.editor.cameraPreviewSize * previewRatio, Editor.settings.editor.cameraPreviewSize);
		viewport.anchor = Editor.settings.editor.cameraPreviewPosition;
		viewport.mode = Viewport.ABSOLUTE;
		viewport.update();
		viewport.enable(renderer);

		// Preview camera
		if(Editor.selection[0] instanceof PerspectiveCamera || Editor.selection[0] instanceof OrthographicCamera)
		{
			renderer.clear(true, true, true);

			var camera = Editor.selection[0];
			camera.resize(width, height, viewport);
			camera.setupRenderer(renderer);
			camera.render(renderer, this.scene);
		}
		// Preview cube camera
		else if(Editor.selection[0] instanceof CubeCamera)
		{
			var cameras = Editor.selection[0].cameras;
			var self = this;

			function renderCamera(index, x, y, w, h)
			{
				renderer.setViewport(x, y, w, h);
				renderer.setScissor(x, y, w, h);
				renderer.clear(true, true, true);

				cameras[index].updateMatrixWorld();
				cameras[index].render(renderer, self.scene);
			}

			// Change viewport to 4:3 ratio
			viewport.size = new THREE.Vector2(Editor.settings.editor.cameraPreviewSize * (4.0 / 3.0), Editor.settings.editor.cameraPreviewSize);;
			viewport.update();

			var size = viewport.viewport.w / 3;
			var x = viewport.viewport.x;
			var y = viewport.viewport.y;

			renderCamera(CubeTexture.LEFT, x, y + size, size, size);
			renderCamera(CubeTexture.FRONT, x + size, y + size, size, size);
			renderCamera(CubeTexture.RIGHT, x + size * 2, y + size, size, size);
			renderCamera(CubeTexture.BACK, x + size * 3, y + size, size, size);
			renderCamera(CubeTexture.TOP, x + size, y, size, size);
			renderCamera(CubeTexture.BOTTOM, x + size, y + size * 2, size, size);
		}
		// Preview all cameras in use
		else if(this.scene.cameras !== undefined && this.scene.cameras.length > 0)
		{
			renderer.clear(true, true, true);

			for(var i = 0; i < this.scene.cameras.length; i++)
			{
				var camera = this.scene.cameras[i];
				camera.resize(width, height, viewport);
				camera.setupRenderer(renderer);
				camera.render(renderer, this.scene);
			}
		}
	}

	renderer.setScissorTest(false);
};

/**
 * Update raycaster position from editor mouse position.
 *
 * @method updateRaycasterFromMouse
 */
SceneEditor.prototype.updateRaycasterFromMouse = function()
{
	this.normalized.set((this.mouse.position.x / this.canvas.size.x) * 2 - 1, -(this.mouse.position.y / this.canvas.size.y) * 2 + 1);
	this.raycaster.setFromCamera(this.normalized, this.camera);
};

/**
 * Select objects mouse based on the mouse position.
 *
 * @method selectObjectWithMouse
 */
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

/**
 * Update raycaster with new x and y positions (normalized -1 to 1).
 *
 * @method updateRaycaster
 * @param {number} x
 * @param {number} y
 */
SceneEditor.prototype.updateRaycaster = function(x, y)
{
	this.normalized.set(x, y);
	this.raycaster.setFromCamera(this.normalized, this.camera);
};

/**
 * Set the editor camera projection mode (ortographic or perspective).
 *
 * @method setCameraMode
 * @param {number} mode
 */
SceneEditor.prototype.setCameraMode = function(mode)
{
	if(mode === this.cameraMode)
	{
		return;
	}

	if(mode === undefined)
	{
		mode = (this.cameraMode === SceneEditor.PERSPECTIVE) ? SceneEditor.ORTHOGRAPHIC : SceneEditor.PERSPECTIVE;
	}
	
	this.cameraMode = mode;

	var aspect = (this.canvas !== null) ? (this.canvas.size.x / this.canvas.size.y) : 1.0;

	if(this.cameraMode === SceneEditor.ORTHOGRAPHIC)
	{
		this.camera = new OrthographicCamera(10, aspect, OrthographicCamera.RESIZE_HORIZONTAL);
	}
	else if(this.cameraMode === SceneEditor.PERSPECTIVE)
	{
		this.camera = new PerspectiveCamera(60, aspect);
	}

	if(this.scene !== null)
	{
		this.scene.defaultCamera = this.camera;
	}

	this.transform.camera = this.camera;

	if(this.controls !== null)
	{
		this.controls.attach(this.camera);
		this.controls.reset();
	}
};

/**
 * Select transform tool, possible values are:
 * - SceneEditor.MOVE
 * - SceneEditor.SCALE
 * - SceneEditor.ROTATE
 *
 * @param selectTool
 * @param {number} tool Tool to select.
 */
SceneEditor.prototype.selectTool = function(tool)
{	
	if(tool !== undefined)
	{
		this.mode = tool;
	}

	if(this.mode === SceneEditor.MOVE)
	{
		this.transform.setMode(TransformControls.TRANSLATE);
		this.transform.space = Editor.settings.editor.transformationSpace;
	}
	else if(this.mode === SceneEditor.SCALE)
	{
		this.transform.setMode(TransformControls.SCALE);
	}
	else if(this.mode === SceneEditor.ROTATE)
	{
		this.transform.setMode(TransformControls.ROTATE);
		this.transform.space = Editor.settings.editor.transformationSpace;
	}
	else if(this.mode === SceneEditor.SELECT)
	{
		this.transform.setMode(TransformControls.NONE);
	}
};

/**
 * Update the selection status of the tab.
 *
 * Select the adequate helper to debug selected objects and attach the objects to the transform tools.
 *
 * @method updateSelection
 */
SceneEditor.prototype.updateSelection = function()
{
	// Filter Object3D objects only (to exclude resources)
	var selectedObjects = [];
	for(var i = 0; i < Editor.selection.length; i++)
	{
		if(Editor.selection[i].isObject3D === true)
		{
			selectedObjects.push(Editor.selection[i]);
		}
	}

	this.transform.attach(selectedObjects);
	this.objectHelper.removeAll();

	for(var i = 0; i < selectedObjects.length; i++)
	{
		var object = selectedObjects[i];

		// Camera
		if(object instanceof THREE.Camera)
		{
			this.objectHelper.add(new THREE.CameraHelper(object));
			this.objectHelper.add(new ObjectIconHelper(object, Global.FILE_PATH + "icons/camera/camera.png"));
		}
		// Light
		else if(object instanceof THREE.Light)
		{
			// Directional light
			if(object instanceof THREE.DirectionalLight)
			{
				this.objectHelper.add(new THREE.DirectionalLightHelper(object, 1));
			}
			// Light probe
			else if(object instanceof THREE.LightProbe)
			{
				this.objectHelper.add(new LightProbeHelper(object, 2));
			}
			// Point light
			else if(object instanceof THREE.PointLight)
			{
				this.objectHelper.add(new THREE.PointLightHelper(object, 1));
			}
			// RectArea light
			else if(object instanceof THREE.RectAreaLight)
			{
				this.objectHelper.add(new RectAreaLightHelper(object));
			}
			// Spot light
			else if(object instanceof THREE.SpotLight)
			{
				this.objectHelper.add(new THREE.SpotLightHelper(object));
			}
			// Hemisphere light
			else if(object instanceof THREE.HemisphereLight)
			{
				this.objectHelper.add(new THREE.HemisphereLightHelper(object, 1));
			}
			// Ambient light
			else
			{
				this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
			}
		}
		// Physics
		else if(object instanceof PhysicsObject)
		{
			this.objectHelper.add(new PhysicsObjectHelper(object));
		}
		// LensFlare
		else if(object instanceof LensFlare)
		{
			this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
		}
		// Skinned Mesh
		else if(object instanceof THREE.SkinnedMesh)
		{
			this.objectHelper.add(new SkeletonHelper(object.parent));
			this.objectHelper.add(new WireframeHelper(object, 0xFFFF00));
		}
		// Bone
		else if(object instanceof THREE.Bone)
		{
			this.objectHelper.add(new SkeletonHelper(object.parent));
			this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
		}
		// Mesh
		else if(object instanceof THREE.Mesh)
		{
			this.objectHelper.add(new WireframeHelper(object, 0xFFFF00));
		}
		// Line
		else if(object instanceof THREE.Line)
		{
			this.objectHelper.add(new LineHelper(object, 0xFFFF00));
		}
		// Points
		else if(object instanceof THREE.Points)
		{
			this.objectHelper.add(new PointsHelper(object, 0xFFFF00));
		}
		// Spine animation
		else if(object instanceof SpineAnimation)
		{
			this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
		}
		// Container
		else if(object instanceof Container)
		{
			this.objectHelper.add(new THREE.BoxHelper(object, 0xFFFF00));
			this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
		}
		// Object 3D
		else
		{
			this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
		}
	}
};

SceneEditor.prototype.updateVisibility = function()
{
	TabComponent.prototype.updateVisibility.call(this);
};

SceneEditor.prototype.updateSize = function()
{
	TabComponent.prototype.updateSize.call(this);

	this.sideBar.position.set(0, 0);
	this.sideBar.size.set(40, this.size.y);
	this.sideBar.updateInterface();

	var width = this.size.x - this.sideBar.size.x;
	var height = this.size.y;

	this.canvas.position.set(this.sideBar.size.x, 0);
	this.canvas.size.set(width, height);
	this.canvas.updateInterface();

	if(this.camera !== null)
	{
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
	}
};
