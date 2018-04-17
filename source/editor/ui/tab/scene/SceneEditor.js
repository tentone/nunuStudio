"use strict";

function SceneEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Scene", Editor.filePath + "icons/misc/scene.png");

	//Canvas
	this.canvas = document.createElement("canvas");
	this.canvas.style.position = "absolute";
	this.element.appendChild(this.canvas);

	//Renderer
	this.renderer = null;

	//Raycaster
	this.raycaster = new THREE.Raycaster(); 

	//State
	this.state = null;

	//Test program
	this.programRunning = null;

	//Scene
	this.scene = null;

	//Input
	this.keyboard = new Keyboard();
	this.mouse = new Mouse();
	this.mouse.setCanvas(this.canvas);

	//Temporary variables
	this.tempVector2 = new THREE.Vector2();
	this.tempVector3 = new THREE.Vector3();

	//Performance meter
	this.stats = new Stats();
	this.stats.dom.style.position = "absolute";
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
	this.gridHelper = new GridHelper(Settings.editor.gridSize, Settings.editor.gridSpacing, 0x888888);
	this.gridHelper.visible = Settings.editor.gridEnabled;
	this.helperScene.add(this.gridHelper);

	//Axis
	this.axisHelper = new THREE.AxesHelper(Settings.editor.gridSize);
	this.axisHelper.material.depthWrite = false;
	this.axisHelper.material.transparent = true;
	this.axisHelper.material.opacity = 1;
	this.axisHelper.visible = Settings.editor.axisEnabled;
	this.helperScene.add(this.axisHelper);

	//Object helper container
	this.objectHelper = new THREE.Object3D();
	this.helperScene.add(this.objectHelper);

	//Tool
	this.toolMode = Editor.SELECT;
	this.tool = new TransformControls(this.camera, this.canvas, this.mouse);
	this.toolScene.add(this.tool);

	//Navigation
	this.cameraRotation = new THREE.Vector2(0, 0);
	this.cameraLookAt = new THREE.Vector3(0, 0, 0);
	this.cameraDistance = 10;

	//Camera
	this.camera = null;
	this.cameraMode = SceneEditor.CAMERA_PERSPECTIVE;
	this.setCameraMode(SceneEditor.CAMERA_PERSPECTIVE);

	//Editing object flag
	this.isEditingObject = false;

	//Self pointer
	var self = this;

	//Drop event
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
		var draggedObject = DragBuffer.popDragElement(uuid);

		//Check intersected objects
		var intersections = self.raycaster.intersectObjects(self.scene.children, true);

		//Auxiliar method to attach textures to objects
		function attachTexture(texture, object)
		{
			if(object instanceof THREE.Mesh || object instanceof THREE.SkinnedMesh)
			{
				object.material = new THREE.MeshStandardMaterial({map:texture, color:0xffffff, roughness: 0.6, metalness: 0.2});
				object.material.name = texture.name;
				Editor.updateViewsGUI();
			}
			else if(object instanceof THREE.Sprite)
			{
				object.material = new THREE.SpriteMaterial({map:texture, color:0xffffff});
				object.material.name = texture.name;
				Editor.updateViewsGUI();
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

				//Sprite Material
				if(draggedObject instanceof THREE.SpriteMaterial)
				{
					if(object instanceof THREE.Sprite)
					{
						object.material = draggedObject;
						Editor.updateViewsGUI();
					}
				}
				//Mesh Material
				else if(draggedObject instanceof THREE.Material)
				{
					if(object instanceof THREE.Mesh || object instanceof THREE.SkinnedMesh)
					{
						object.material = draggedObject;
						Editor.updateViewsGUI();
					}
				}
				//Cubemap
				else if(draggedObject.isCubeTexture)
				{
					if(object.material instanceof THREE.Material)
					{
						object.material.envMap = draggedObject;
						self.reloadContext();
						Editor.updateViewsGUI();
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
						Editor.updateViewsGUI();
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

	//Prevent deafault when object dragged over
	this.canvas.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Buttons visibility
	this.showButtonsVr = false;
	this.showButtonsFullscreen = false;
	this.showButtonsCameraMode = true;

	//Fullscreen button
	this.fullscreenButton = new ButtonImage(this.element);
	this.fullscreenButton.size.set(30, 30);
	this.fullscreenButton.setImage(Editor.filePath + "icons/misc/fullscreen.png");
	this.fullscreenButton.setAltText("Toggle fullscreen");
	this.fullscreenButton.setImageScale(0.8, 0.8);
	this.fullscreenButton.visible = false;
	this.fullscreenButton.element.style.backgroundColor = "#333333";
	this.fullscreenButton.element.style.borderRadius = "5px";
	this.fullscreenButton.element.style.opacity = 0.5;

	this.fullscreenButton.element.onmouseenter = function()
	{
		self.fullscreenButton.element.style.opacity = 1.0;
	};
	this.fullscreenButton.element.onmouseleave = function()
	{
		self.fullscreenButton.element.style.opacity = 0.5;
	};

	var fullscreen = true;
	this.fullscreenButton.setCallback(function()
	{
		self.setFullscreen(fullscreen);
		fullscreen = !fullscreen;
	});

	//VR button
	this.vrButton = new ButtonImage(this.element);
	this.vrButton.size.set(30, 30);
	this.vrButton.setImage(Editor.filePath + "icons/misc/vr.png");
	this.vrButton.setAltText("Toggle VR mode");
	this.vrButton.setImageScale(0.8, 0.8);
	this.vrButton.visible = false;
	this.vrButton.element.style.backgroundColor = "#333333";
	this.vrButton.element.style.borderRadius = "5px";
	this.vrButton.element.style.opacity = 0.5;

	this.vrButton.element.onmouseenter = function()
	{
		self.vrButton.element.style.opacity = 1.0;
	};
	this.vrButton.element.onmouseleave = function()
	{
		self.vrButton.element.style.opacity = 0.5;
	};

	//Camera mode button
	this.cameraButton = new ButtonImage(this.element);
	this.cameraButton.size.set(30, 30);
	this.cameraButton.setImage(Editor.filePath + "icons/misc/3d.png");
	this.cameraButton.setAltText("Change camera mode");
	this.cameraButton.setImageScale(0.8, 0.8);
	this.cameraButton.element.style.backgroundColor = "#333333";
	this.cameraButton.element.style.borderRadius = "5px";
	this.cameraButton.element.style.opacity = 0.5;

	this.cameraButton.element.onmouseenter = function()
	{
		self.cameraButton.element.style.opacity = 1.0;
	};

	this.cameraButton.element.onmouseleave = function()
	{
		self.cameraButton.element.style.opacity = 0.5;
	};

	this.cameraButton.setCallback(function()
	{
		self.setCameraMode();

		if(self.cameraMode === SceneEditor.CAMERA_ORTHOGRAPHIC)
		{
			self.cameraButton.setImage(Editor.filePath + "icons/misc/2d.png");
		}
		else if(self.cameraMode === SceneEditor.CAMERA_PERSPECTIVE)
		{
			self.cameraButton.setImage(Editor.filePath + "icons/misc/3d.png");
		}
	});
}

//State
SceneEditor.EDITING = 9;
SceneEditor.TESTING = 11;

//Camera mode
SceneEditor.CAMERA_ORTHOGRAPHIC = 20;
SceneEditor.CAMERA_PERSPECTIVE = 21;

//Constants
SceneEditor.UP = new THREE.Vector3(0, 1, 0);
SceneEditor.ZERO = new THREE.Vector3(0, 0, 0);
SceneEditor.prototype = Object.create(TabElement.prototype);

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

	this.initializeRenderer();
	this.updateSettings();
	this.setState(SceneEditor.EDITING);
	
	Editor.gui.toolBar.selectTool(Editor.SELECT);
	Editor.resize();
};

//Deactivate
SceneEditor.prototype.deactivate = function()
{
	TabElement.prototype.deactivate.call(this);

	//Hide run button
	Editor.gui.menuBar.run.visible = false;
	Editor.gui.menuBar.run.updateInterface();
};

//Update settings
SceneEditor.prototype.updateSettings = function()
{
	//Grid
	this.gridHelper.visible = Settings.editor.gridEnabled;
	this.gridHelper.setSize(Settings.editor.gridSize);
	this.gridHelper.setSpacing(Settings.editor.gridSpacing);
	this.gridHelper.update();

	//Axis
	this.axisHelper.visible = Settings.editor.axisEnabled;

	//Orientation cube
	var size = Settings.editor.cameraRotationCubeSize;
	this.orientation.size.set(size, size);

	//Tool
	if(this.tool !== null && Editor.toolMode !== Editor.SCALE)
	{
		this.tool.setSpace(Settings.editor.transformationSpace);
		this.tool.setSnap(Settings.editor.snap);
		this.tool.setTranslationSnap(Settings.editor.gridSpacing);
		this.tool.setRotationSnap(Settings.editor.snapAngle);
	}
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
}

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

	this.isEditingObject = false;

	if(this.state === SceneEditor.EDITING)
	{
		if(this.keyboard.keyJustPressed(Keyboard.F5))
		{
			this.setState(SceneEditor.TESTING);
		}
		else if(this.keyboard.keyJustPressed(Keyboard.DEL))
		{
			Editor.deleteObject();
		}
		else if(this.keyboard.keyPressed(Keyboard.CTRL))
		{
			if(this.focused)
			{
				if(this.keyboard.keyJustPressed(Keyboard.C))
				{
					Editor.copyObject();
				}
				else if(this.keyboard.keyJustPressed(Keyboard.V))
				{
					Editor.pasteObject();
				}
				else if(this.keyboard.keyJustPressed(Keyboard.X))
				{
					Editor.cutObject();
				}
			}
			
			if(this.keyboard.keyJustPressed(Keyboard.Z))
			{
				Editor.undo();
			}
			else if(this.keyboard.keyJustPressed(Keyboard.Y))
			{
				Editor.redo();
			}
		}

		//Select objects
		if(this.toolMode === Editor.SELECT)
		{
			if(this.mouse.buttonJustPressed(Mouse.LEFT) && this.mouse.insideCanvas())
			{
				this.selectObjectWithMouse();
			}

			this.isEditingObject = false;
		}
		else
		{
			//If mouse double clicked select object
			if(this.mouse.buttonDoubleClicked() && this.mouse.insideCanvas())
			{
				this.selectObjectWithMouse();
			}

			//If no object selected update tool
			if(Editor.hasObjectSelected())
			{
				if(this.tool !== null)
				{
					this.isEditingObject = this.tool.update();

					if(this.isEditingObject)
					{
						Editor.updateValuesGUI();
					}
				}
				else
				{
					this.isEditingObject = false;
				}
			}
		}
		
		//Update object transformation matrix
		if(Editor.hasObjectSelected())
		{	
			for(var i = 0; i < Editor.selectedObjects.length; i++)
			{
				if(!Editor.selectedObjects[i].matrixAutoUpdate)
				{
					Editor.selectedObjects[i].updateMatrix();
				}
			}
		}

		//Update object helper
		this.objectHelper.update();

		//Check if mouse is inside canvas
		if(this.mouse.insideCanvas())
		{
			//Lock mouse when camera is moving
			if(Settings.editor.lockMouse && Nunu.runningOnDesktop())
			{
				if(!this.isEditingObject && (this.mouse.buttonJustPressed(Mouse.LEFT) || this.mouse.buttonJustPressed(Mouse.RIGHT) || this.mouse.buttonJustPressed(Mouse.MIDDLE)))
				{
					this.mouse.setLock(true);
				}
				else if(this.mouse.buttonJustReleased(Mouse.LEFT) || this.mouse.buttonJustReleased(Mouse.RIGHT) || this.mouse.buttonJustReleased(Mouse.MIDDLE))
				{
					this.mouse.setLock(false);
				}
			}

			//Orthographic camera (2D mode)
			if(this.cameraMode === SceneEditor.CAMERA_ORTHOGRAPHIC)
			{
				//Move camera on y / x
				if(this.mouse.buttonPressed(Mouse.RIGHT))
				{
					var ratio = this.camera.size / this.canvas.width * 2;
					var x = this.mouse.delta.x * ratio;

					this.camera.position.x -= this.mouse.delta.x * ratio;
					this.camera.position.y += this.mouse.delta.y * ratio;
				}

				//Rotate camera
				if(this.mouse.buttonPressed(Mouse.MIDDLE))
				{
					this.updateOrthographicCameraRotation();
				}

				//Camera zoom
				if(this.mouse.wheel !== 0)
				{
					this.camera.size += this.mouse.wheel * this.camera.size / 1000;
					this.camera.updateProjectionMatrix();
				}

				//Update grid helper position
				this.gridHelper.position.x = this.camera.position.x - (this.camera.position.x % Settings.editor.gridSpacing);
				this.gridHelper.position.y = this.camera.position.y - (this.camera.position.y % Settings.editor.gridSpacing);
			}
			//Perspective camera
			else
			{
				if(Settings.editor.navigation === Settings.FREE)
				{
					//Look camera
					if(this.mouse.buttonPressed(Mouse.LEFT) && !this.isEditingObject)
					{
						if(Settings.editor.invertNavigation)
						{
							this.cameraRotation.y += Settings.editor.mouseLookSensitivity * this.mouse.delta.y;
						}
						else
						{
							this.cameraRotation.y -= Settings.editor.mouseLookSensitivity * this.mouse.delta.y;
						}

						this.cameraRotation.x -= Settings.editor.mouseLookSensitivity * this.mouse.delta.x;
						

						//Limit Vertical Rotation to 90 degrees
						if(this.cameraRotation.y < -1.57)
						{
							this.cameraRotation.y = -1.57;
						}
						else if(this.cameraRotation.y > 1.57)
						{
							this.cameraRotation.y = 1.57;
						}

						this.setCameraRotation(this.cameraRotation, this.camera);
					}

					//Move Camera on X and Z
					if(this.mouse.buttonPressed(Mouse.RIGHT))
					{
						//Move speed
						var speed = this.camera.position.distanceTo(SceneEditor.ZERO) * Settings.editor.mouseMoveSpeed;
						
						if(speed < 0.01)
						{
							speed = 0.01;
						}

						//Move Camera Front and Back
						var angleCos = Math.cos(this.cameraRotation.x);
						var angleSin = Math.sin(this.cameraRotation.x);
						this.camera.position.z += this.mouse.delta.y * speed * angleCos;
						this.camera.position.x += this.mouse.delta.y * speed * angleSin;

						//Move Camera Lateral
						var angleCos = Math.cos(this.cameraRotation.x + MathUtils.pid2);
						var angleSin = Math.sin(this.cameraRotation.x + MathUtils.pid2);
						this.camera.position.z += this.mouse.delta.x * speed * angleCos;
						this.camera.position.x += this.mouse.delta.x * speed * angleSin;
					}
					
					//Move Camera on Y
					if(this.mouse.buttonPressed(Mouse.MIDDLE))
					{
						this.camera.position.y += this.mouse.delta.y * Settings.editor.mouseMoveSpeed * 100;
					}

					//Move in camera direction using mouse scroll
					if(this.mouse.wheel !== 0)
					{
						//Move speed
						var speed = this.mouse.wheel * this.camera.position.distanceTo(SceneEditor.ZERO) * Settings.editor.mouseWheelSensitivity;

						//Limit zoom speed
						if(speed < 0 && speed > -0.02)
						{
							speed = -0.02;
						}
						else if(speed > 0 && speed < 0.02)
						{
							speed = 0.02;
						}

						//Move camera
						var direction = this.camera.getWorldDirection(this.tempVector3);
						direction.multiplyScalar(speed);
						this.camera.position.sub(direction);
					}

					//WASD movement
					if(Settings.editor.keyboardNavigation)
					{
						if(Editor.keyboard.keyPressed(Keyboard.W))
						{
							var direction = this.camera.getWorldDirection(this.tempVector3);
							direction.multiplyScalar(Settings.editor.keyboardNavigationSpeed);
							this.camera.position.add(direction);
						}
						if(Editor.keyboard.keyPressed(Keyboard.S))
						{
							var direction = this.camera.getWorldDirection(this.tempVector3);
							direction.multiplyScalar(Settings.editor.keyboardNavigationSpeed);
							this.camera.position.sub(direction);
						}
						if(Editor.keyboard.keyPressed(Keyboard.A))
						{
							this.tempVector3.set(Math.sin(this.cameraRotation.x - 1.57), 0, Math.cos(this.cameraRotation.x - 1.57));
							this.tempVector3.normalize();
							this.tempVector3.multiplyScalar(Settings.editor.keyboardNavigationSpeed);
							this.camera.position.sub(this.tempVector3);
						}
						if(Editor.keyboard.keyPressed(Keyboard.D))
						{
							this.tempVector3.set(Math.sin(this.cameraRotation.x + 1.57), 0, Math.cos(this.cameraRotation.x + 1.57));
							this.tempVector3.normalize();
							this.tempVector3.multiplyScalar(Settings.editor.keyboardNavigationSpeed);
							this.camera.position.sub(this.tempVector3);
						}
					}
				}
				else if(Settings.editor.navigation === Settings.ORBIT)
				{
					//Look around
					if(this.mouse.buttonPressed(Mouse.LEFT) && !this.isEditingObject)
					{
						if(Settings.editor.invertNavigation)
						{
							this.cameraRotation.y += Settings.editor.mouseLookSensitivity * this.mouse.delta.y;
						}
						else
						{
							this.cameraRotation.y -= Settings.editor.mouseLookSensitivity * this.mouse.delta.y;
						}

						this.cameraRotation.x -= Settings.editor.mouseLookSensitivity * this.mouse.delta.x;

						if(this.cameraRotation.y < -1.57)
						{
							this.cameraRotation.y = -1.57;
						}
						else if(this.cameraRotation.y > 1.57)
						{
							this.cameraRotation.y = 1.57;
						}
					}

					//Zoom
					if(this.mouse.wheel !== 0)
					{
						this.cameraDistance += this.camera.position.distanceTo(this.cameraLookAt) * Settings.editor.mouseWheelSensitivity * this.mouse.wheel;
						if(this.cameraDistance < 0)
						{
							this.cameraDistance = 0;
						}
					}

					if(this.mouse.buttonPressed(Mouse.MIDDLE))
					{
						this.cameraDistance += this.mouse.delta.y * 0.1;
						if(this.cameraDistance < 0)
						{
							this.cameraDistance = 0;
						}
					}

					//WASD movement
					if(Settings.editor.keyboardNavigation)
					{
						if(Editor.keyboard.keyPressed(Keyboard.W))
						{
							var direction = this.camera.getWorldDirection(this.tempVector3);
							direction.y = 0;
							direction.normalize();

							this.cameraLookAt.x += direction.x * Settings.editor.keyboardNavigationSpeed;
							this.cameraLookAt.z += direction.z * Settings.editor.keyboardNavigationSpeed;
						}
						if(Editor.keyboard.keyPressed(Keyboard.S))
						{
							var direction = this.camera.getWorldDirection(this.tempVector3);
							direction.y = 0;
							direction.normalize();

							this.cameraLookAt.x -= direction.x * Settings.editor.keyboardNavigationSpeed;
							this.cameraLookAt.z -= direction.z * Settings.editor.keyboardNavigationSpeed;
						}
						if(Editor.keyboard.keyPressed(Keyboard.D))
						{
							var direction = this.camera.getWorldDirection(this.tempVector3);
							direction.y = 0;
							direction.normalize();
							direction.applyAxisAngle(SceneEditor.UP, 1.57);

							this.cameraLookAt.x -= direction.x * Settings.editor.keyboardNavigationSpeed;
							this.cameraLookAt.z -= direction.z * Settings.editor.keyboardNavigationSpeed;
						}
						if(Editor.keyboard.keyPressed(Keyboard.A))
						{
							var direction = this.camera.getWorldDirection(this.tempVector3);
							direction.y = 0;
							direction.normalize();
							direction.applyAxisAngle(SceneEditor.UP, 1.57);

							this.cameraLookAt.x += direction.x * Settings.editor.keyboardNavigationSpeed;
							this.cameraLookAt.z += direction.z * Settings.editor.keyboardNavigationSpeed;
						}
					}

					//Move target point
					if(this.mouse.buttonPressed(Mouse.RIGHT))
					{
						var direction = this.camera.getWorldDirection(this.tempVector3);
						direction.y = 0;
						direction.normalize();

						var speed = Settings.editor.mouseMoveSpeed * 10;

						this.cameraLookAt.x += direction.x * this.mouse.delta.y * speed;
						this.cameraLookAt.z += direction.z * this.mouse.delta.y * speed;

						direction.applyAxisAngle(SceneEditor.UP, 1.57);

						this.cameraLookAt.x += direction.x * this.mouse.delta.x * speed;
						this.cameraLookAt.z += direction.z * this.mouse.delta.x * speed;
					}

					this.setCameraRotationOrbit(this.cameraRotation, this.cameraLookAt, this.cameraDistance, this.camera);
				}

				//Update grid helper position
				this.gridHelper.position.x = this.camera.position.x - (this.camera.position.x % Settings.editor.gridSpacing);
				this.gridHelper.position.z = this.camera.position.z - (this.camera.position.z % Settings.editor.gridSpacing);
			}
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
		

		if(this.keyboard.keyJustPressed(Keyboard.F5))
		{
			this.setState(SceneEditor.EDITING);
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
	renderer.autoClear = true;
	renderer.autoClearColor = true;
	renderer.autoClearDepth = true;
	renderer.autoClearStencil = true;

	if(this.state === SceneEditor.EDITING)
	{
		//Render scene
		renderer.setViewport(0, 0, this.canvas.width, this.canvas.height);
		renderer.render(this.scene, this.camera);

		//Auto clear false
		renderer.autoClearColor = false;
		renderer.autoClearStencil = false;
		renderer.autoClearDepth = false;

		//Render tools
		renderer.render(this.helperScene, this.camera);
		renderer.render(this.toolScene, this.camera);

		//Clear depth
		renderer.autoClearDepth = true;

		//Draw camera cube
		if(Settings.editor.cameraRotationCube)
		{
			var code = this.orientation.raycast(this.mouse, this.canvas);
			
			if(code !== null && (this.mouse.buttonDoubleClicked() || this.mouse.buttonJustPressed(Mouse.MIDDLE)))
			{
				if(Settings.editor.navigation === Settings.ORBIT || this.camera instanceof OrthographicCamera)
				{
					if(code === OrientationCube.Z_POS)
					{
						this.cameraRotation.set(Math.PI / 2, 0);
					}
					else if(code === OrientationCube.Z_NEG)
					{
						this.cameraRotation.set(-Math.PI / 2, 0);
					}
					else if(code === OrientationCube.X_POS)
					{
						this.cameraRotation.set(0, 0);
					}
					else if(code === OrientationCube.X_NEG)
					{
						this.cameraRotation.set(Math.PI, 0);
					}
					else if(code === OrientationCube.Y_POS)
					{
						this.cameraRotation.set(Math.PI, 1.57);
					}
					else if(code === OrientationCube.Y_NEG)
					{
						this.cameraRotation.set(Math.PI, -1.57);
					}

					this.setCameraRotationOrbit(this.cameraRotation, this.cameraLookAt, this.cameraDistance, this.camera);
				}
				else
				{
					if(code === OrientationCube.Z_POS)
					{
						this.cameraRotation.set(Math.PI, 0);
					}
					else if(code === OrientationCube.Z_NEG)
					{
						this.cameraRotation.set(0, 0);
					}
					else if(code === OrientationCube.X_POS)
					{
						this.cameraRotation.set(-Math.PI / 2, 0);
					}
					else if(code === OrientationCube.X_NEG)
					{
						this.cameraRotation.set(Math.PI / 2, 0);
					}
					else if(code === OrientationCube.Y_POS)
					{
						this.cameraRotation.set(Math.PI, -1.57);
					}
					else if(code === OrientationCube.Y_NEG)
					{
						this.cameraRotation.set(Math.PI, 1.57);
					}

					this.setCameraRotation(this.cameraRotation, this.camera);
				}
			}

			if(this.mouse.buttonPressed(Mouse.LEFT))
			{
				if(this.cameraMode === SceneEditor.CAMERA_ORTHOGRAPHIC)
				{
					this.updateOrthographicCameraRotation();
				}
			}

			this.orientation.updateRotation(this.camera);
			this.orientation.render(renderer, this.canvas);
		}

		//Camera preview
		if(Settings.editor.cameraPreviewEnabled)
		{
			var width = Settings.editor.cameraPreviewPercentage * this.canvas.width;
			var height = Settings.editor.cameraPreviewPercentage * this.canvas.height;
			var scene = this.scene;
			
			var position = Settings.editor.cameraPreviewPosition;
			var x = (position === Settings.BOTTOM_RIGHT || position === Settings.TOP_RIGHT) ? this.canvas.width - width - 10 : 10;
			var y = (position === Settings.BOTTOM_RIGHT || position === Settings.BOTTOM_LEFT) ? this.canvas.height - height - 10 : 10;

			renderer.setScissorTest(true);
			renderer.setViewport(x, y, width, height);
			renderer.setScissor(x, y, width, height);

			//Preview selected camera
			if(Editor.selectedObjects[0] instanceof PerspectiveCamera || Editor.selectedObjects[0] instanceof OrthographicCamera)
			{
				var camera = Editor.selectedObjects[0];
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				camera.resize(width, height);

				renderer.setViewport(x + width * camera.offset.x, y + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
				renderer.setScissor(x + width * camera.offset.x, y + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
				
				camera.render(renderer, scene);
			}
			//Cube camera
			else if(Editor.selectedObjects[0] instanceof CubeCamera)
			{
				var cameras = Editor.selectedObjects[0].cameras;

				function renderCamera(index, x, y, w, h)
				{
					renderer.setViewport(x, y, w, h);
					renderer.setScissor(x, y, w, h);
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

					renderer.autoClearColor = camera.clearColor;
					renderer.autoClearDepth = camera.clearDepth;
					renderer.autoClearStencil = camera.clearStencil;

					renderer.setViewport(x + width * camera.offset.x, y + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
					renderer.setScissor(x + width * camera.offset.x, y + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
					
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

//Create new fresh webgl context, delete old canvas and create a new one
SceneEditor.prototype.reloadContext = function()
{
	if(this.element.contains(this.canvas))
	{
		this.element.removeChild(this.canvas);
	}

	this.canvas = document.createElement("canvas");
	this.canvas.style.position = "absolute";
	this.element.appendChild(this.canvas);
	this.mouse.setCanvas(this.canvas);
	
	if(this.visible)
	{
		this.canvas.width = this.size.x;
		this.canvas.height = this.size.y;
		this.canvas.style.width = this.size.x + "px";
		this.canvas.style.height = this.size.y + "px";
	}

	if(this.renderer !== null)
	{
		this.renderer.dispose();
		try
		{
			this.renderer.forceContextLoss();
		}
		catch(e){}
		this.renderer = null;

		this.initializeRenderer();
	}
};

//Initialize renderer
SceneEditor.prototype.initializeRenderer = function()
{
	//Rendering quality settings
	if(Settings.render.followProject)
	{
		var antialiasing = Editor.program.antialiasing;
		var shadows = Editor.program.shadows;
		var shadowsType = Editor.program.shadowsType;
		var toneMapping = Editor.program.toneMapping;
		var toneMappingExposure = Editor.program.toneMappingExposure;
		var toneMappingWhitePoint = Editor.program.toneMappingWhitePoint;
	}
	else
	{
		var antialiasing = Settings.render.antialiasing;
		var shadows = Settings.render.shadows;
		var shadowsType = Settings.render.shadowsType;
		var toneMapping = Settings.render.toneMapping;
		var toneMappingExposure = Settings.render.toneMappingExposure;
		var toneMappingWhitePoint = Settings.render.toneMappingWhitePoint;
	}

	//Dispose old renderer
	if(this.renderer !== null)
	{
		this.renderer.dispose();
	}

	//Create renderer
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true, antialias: antialiasing});
	this.renderer.setSize(this.canvas.width, this.canvas.height);
	this.renderer.shadowMap.enabled = shadows;
	this.renderer.shadowMap.type = shadowsType;
	this.renderer.toneMapping = toneMapping;
	this.renderer.toneMappingExposure = toneMappingExposure;
	this.renderer.toneMappingWhitePoint = toneMappingWhitePoint;
};

//Update raycaster position from editor mouse position
SceneEditor.prototype.updateRaycasterFromMouse = function()
{
	this.tempVector2.set((this.mouse.position.x / this.canvas.width) * 2 - 1, -(this.mouse.position.y / this.canvas.height) * 2 + 1);
	this.raycaster.setFromCamera(this.tempVector2, this.camera);
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
			if(Editor.isObjectSelected(intersects[0].object))
			{
				Editor.removeFromSelection(intersects[0].object);
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
	this.tempVector2.set(x, y);
	this.raycaster.setFromCamera(this.tempVector2, this.camera);
};

//Set camera mode (ortho or perspective)
SceneEditor.prototype.setCameraMode = function(mode)
{
	if(mode === undefined)
	{
		mode = (this.cameraMode === SceneEditor.CAMERA_PERSPECTIVE) ? SceneEditor.CAMERA_ORTHOGRAPHIC : SceneEditor.CAMERA_PERSPECTIVE;
	}
	
	var aspect = (this.canvas !== null) ? this.canvas.width / this.canvas.height : 1.0;

	if(mode === SceneEditor.CAMERA_ORTHOGRAPHIC)
	{
		this.camera = new OrthographicCamera(10, aspect, OrthographicCamera.RESIZE_HORIZONTAL, 0.001, 100000);
		
		this.cameraRotation.set(Math.PI / 2, 0);
		this.cameraLookAt.set(0, 0, 0);
		this.cameraDistance = 100;

		this.setCameraRotationOrbit(this.cameraRotation, this.cameraLookAt, this.cameraDistance, this.camera);

		this.gridHelper.rotation.set(Math.PI / 2, 0, 0);
		this.gridHelper.position.set(0, 0, 0);
	}
	else if(mode === SceneEditor.CAMERA_PERSPECTIVE)
	{
		this.camera = new PerspectiveCamera(60, aspect);
		this.camera.position.set(0, 3, 5);

		this.cameraRotation.set(Math.PI, 0);
		this.cameraLookAt.set(0, 0, 0);
		this.cameraDistance = 10;
		this.setCameraRotation(this.cameraRotation, this.camera);

		this.gridHelper.rotation.set(0, 0, 0);
		this.gridHelper.position.set(0, 0, 0);
	}

	this.cameraMode = mode;
	this.tool.setCamera(this.camera);
};

//Update orthographic camera rotation
SceneEditor.prototype.updateOrthographicCameraRotation = function()
{
	this.cameraRotation.y -= Settings.editor.mouseLookSensitivity * this.mouse.delta.y;
	this.cameraRotation.x -= Settings.editor.mouseLookSensitivity * this.mouse.delta.x;

	//Limit Vertical Rotation to 90 degrees
	if(this.cameraRotation.y < -1.57)
	{
		this.cameraRotation.y = -1.57;
	}
	else if(this.cameraRotation.y > 1.57)
	{
		this.cameraRotation.y = 1.57;
	}

	this.setCameraRotationOrbit(this.cameraRotation, this.cameraLookAt, this.cameraDistance, this.camera);
}

//Set camera rotation (camera movement as an fps camera)
SceneEditor.prototype.setCameraRotation = function(cameraRotation, camera)
{
	var cos = Math.cos(cameraRotation.y);
	this.tempVector3.set(Math.sin(cameraRotation.x)*cos, Math.sin(cameraRotation.y), Math.cos(cameraRotation.x)*cos);
	this.tempVector3.add(camera.position);
	camera.lookAt(this.tempVector3);
};

//Set camera rotation and position in orbit mode
SceneEditor.prototype.setCameraRotationOrbit = function(cameraRotation, cameraLookAt, cameraDistance, camera)
{
	var cos = Math.cos(cameraRotation.y);
	camera.position.set(cameraDistance * Math.cos(cameraRotation.x) * cos, cameraDistance * Math.sin(cameraRotation.y), cameraDistance * Math.sin(cameraRotation.x) * cos);
	camera.position.add(cameraLookAt);
	camera.lookAt(cameraLookAt);
};

//Set scene editor state
SceneEditor.prototype.setState = function(state)
{
	this.state = state;

	if(state === SceneEditor.EDITING)
	{
		//Set run button text
		Editor.gui.menuBar.run.setText("Run");
		Editor.gui.menuBar.run.visible = true;
		Editor.gui.menuBar.run.updateInterface();

		//Dispose running program
		this.disposeRunningProgram();

		//Set buttons
		this.showButtonsFullscreen = false;
		this.showButtonsVr = false;
		this.showButtonsCameraMode = true;

		//Update interface
		this.updateInterface();
	}
	else if(state === SceneEditor.TESTING)
	{
		try
		{
			//Run the program directly all changed made with code are kept
			if(Settings.general.immediateMode)
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
			this.showButtonsFullscreen = true;
			this.showButtonsCameraMode = false;

			//If program uses VR set button
			if(this.programRunning.vr)
			{
				if(Nunu.webvrAvailable())
				{
					//Show VR button
					this.showButtonsVr = true;

					//Create VR switch callback
					var vr = true;
					this.vrButton.setCallback(function()
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
	}
	else if(this.toolMode === Editor.SCALE)
	{
		this.tool.setMode("scale");
	}
	else if(this.toolMode === Editor.ROTATE)
	{
		this.tool.setMode("rotate");
	}
	
	this.tool.setSpace(Settings.editor.transformationSpace);
	this.tool.setSnap(Settings.editor.snap);
	this.tool.setTranslationSnap(Settings.editor.gridSpacing);
	this.tool.setRotationSnap(Settings.editor.snapAngle);
	this.tool.attach(Editor.selectedObjects);
	
	if(this.toolMode === Editor.SELECT)
	{
		this.tool.visible = false;
	}
};

//Select helper to debug selected object data
SceneEditor.prototype.updateSelection = function()
{
	this.tool.attach(Editor.selectedObjects);

	this.objectHelper.removeAll();

	for(var i = 0; i < Editor.selectedObjects.length; i++)
	{
		var object = Editor.selectedObjects[i];

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
			this.objectHelper.add(new SkinnedWireframeHelper(object, 0xFFFF00));
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

//Resize scene editor camera
SceneEditor.prototype.resizeCamera = function()
{
	if(this.canvas !== null && this.renderer !== null)
	{
		this.renderer.setSize(this.canvas.width, this.canvas.height);
		this.camera.aspect = this.canvas.width / this.canvas.height;
		this.camera.updateProjectionMatrix();

		if(this.state === SceneEditor.TESTING)
		{
			this.programRunning.resize(this.canvas.width, this.canvas.height);
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

//Update scene editor interface
SceneEditor.prototype.updateInterface = function()
{
	if(this.visible)
	{
		//Stats
		this.stats.dom.style.visibility = Settings.general.showStats ? "visible" : "hidden";

		//Fullscreen button
		this.fullscreenButton.position.x = this.position.x + this.size.x - this.fullscreenButton.size.x - 5;
		this.fullscreenButton.position.y = this.position.y + this.size.y - this.fullscreenButton.size.y - 5;
		this.fullscreenButton.visible = this.showButtonsFullscreen;
		this.fullscreenButton.updateInterface();

		//VR button
		this.vrButton.position.x = this.fullscreenButton.position.x - this.vrButton.size.x - 10;
		this.vrButton.position.y = this.fullscreenButton.position.y;
		this.vrButton.visible = this.showButtonsVr;
		this.vrButton.updateInterface();

		//Camera mode button
		this.cameraButton.position.x = this.position.x + this.size.x - this.cameraButton.size.x - 5;
		this.cameraButton.position.y = 5;
		this.cameraButton.visible = this.showButtonsCameraMode;
		this.cameraButton.updateInterface();

		//Canvas
		this.canvas.width = this.size.x;
		this.canvas.height = this.size.y;
		this.canvas.style.width = this.size.x + "px";
		this.canvas.style.height = this.size.y + "px";

		//Renderer
		this.resizeCamera();

		//Element
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
