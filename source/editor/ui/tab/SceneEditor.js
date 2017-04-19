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

	//Tools
	this.toolMode = Editor.SELECT;
	this.tool = null;

	//Input
	this.keyboard = new Keyboard();
	this.mouse = new Mouse();
	this.mouse.setCanvas(this.canvas);

	//Performance meter
	this.stats = new Stats();
	this.stats.dom.style.position = "absolute";
	this.stats.dom.style.left = "0px";
	this.stats.dom.style.top = "0px";
	this.stats.dom.style.zIndex = "0";
	this.element.appendChild(this.stats.dom);

	//Tool scene
	this.toolScene = new THREE.Scene();
	this.toolSceneTop = new THREE.Scene();

	//Grid
	this.gridHelper = new GridHelper(Settings.editor.gridSize, Settings.editor.gridSpacing, 0x888888);
	this.gridHelper.visible = Settings.editor.gridEnabled;
	this.toolScene.add(this.gridHelper);

	//Axis
	this.axisHelper = new THREE.AxisHelper(Settings.editor.gridSize);
	this.axisHelper.material.depthWrite = false;
	this.axisHelper.material.transparent = true;
	this.axisHelper.material.opacity = 1;
	this.axisHelper.visible = Settings.editor.axisEnabled;
	this.toolScene.add(this.axisHelper);

	//Object helper container
	this.objectHelper = new THREE.Scene();
	this.toolScene.add(this.objectHelper);

	//Tool container
	this.toolContainer = new THREE.Scene();
	this.toolSceneTop.add(this.toolContainer);

	//Navigation
	this.cameraRotation = new THREE.Vector2(0, 0);
	this.cameraLookAt = new THREE.Vector3(0, 0, 0);
	this.cameraDistance = 10;

	//Camera
	this.cameras = null;
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

		if(self.scene !== null)
		{
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

			//Dragged file into object
			if(intersections.length > 0 && event.dataTransfer.files.length > 0)
			{
				var file = event.dataTransfer.files[0];
				var name = FileSystem.getFileName(file.name);
				var object = intersections[0].object;

				//Image
				if(Image.fileIsImage(file))
				{
					Editor.loadTexture(file, function(texture)
					{
						if(object instanceof THREE.Mesh)
						{
							var material = new THREE.MeshStandardMaterial({map:texture, color:0xffffff, roughness: 0.6, metalness: 0.2});
							material.name = texture.name;
							object.material = material;
						}
						else if(object instanceof THREE.Sprite)
						{
							var material = new THREE.SpriteMaterial({map: texture, color: 0xffffff});
							material.name = texture.name;
							object.material = material;
						}
					});
				}
				//Video
				else if(Video.fileIsVideo(file))
				{
					Editor.loadVideoTexture(file, function(texture)
					{
						if(object instanceof THREE.Mesh)
						{
							var material = new THREE.MeshStandardMaterial({map:texture, color:0xffffff, roughness: 0.6, metalness: 0.2});
							material.name = texture.name;
							object.material = material;
						}
						else if(object instanceof THREE.Sprite)
						{
							var material = new THREE.SpriteMaterial({map: texture, color: 0xffffff});
							material.name = texture.name;
							object.material = material;
						}
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
			//Dragged resource
			else if(draggedObject !== null)
			{
				//Object intersected
				if(intersections.length > 0)
				{
					var object = intersections[0].object;

					if(draggedObject instanceof THREE.SpriteMaterial)
					{
						if(object instanceof THREE.Sprite)
						{
							object.material = draggedObject;
							Editor.updateObjectViews();
						}
					}
					else if(draggedObject instanceof THREE.Material)
					{
						if(object instanceof THREE.Mesh)
						{
							object.material = draggedObject;
							Editor.updateObjectViews();
						}
					}
					else if(draggedObject instanceof CubeTexture)
					{
						if(object.material !== undefined && object.material.envMap !== undefined)
						{
							object.material.envMap = draggedObject;
						}
					}
					else if(draggedObject instanceof THREE.Texture)
					{
						if(object instanceof THREE.Mesh)
						{
							object.material = new THREE.MeshStandardMaterial({map:draggedObject, color:0xffffff, roughness: 0.6, metalness: 0.2});
							object.material.name = draggedObject.name;
							Editor.updateObjectViews();
						}
						else if(object instanceof THREE.Sprite)
						{
							object.material = new THREE.SpriteMaterial({map:draggedObject, color:0xffffff});
							object.material.name = draggedObject.name;
							Editor.updateObjectViews();
						}
					}
					else if(draggedObject instanceof Font)
					{
						if(object.font !== undefined)
						{
							object.setFont(draggedObject);
							Editor.updateObjectViews();
						}
					}
				}

				if(draggedObject instanceof Audio)
				{
					var audio = new AudioEmitter(draggedObject);
					audio.name = draggedObject.name;
					Editor.addToScene(audio);
				}
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
	this.fullscreenButton.size.set(25, 25);
	this.fullscreenButton.setImage(Editor.filePath + "icons/misc/fullscreen.png");
	this.fullscreenButton.visible = false;
	this.fullscreenButton.updateInterface();
	this.fullscreenButton.element.onmouseenter = function()
	{
		self.fullscreenButton.img.style.opacity = 0.5;
	};
	this.fullscreenButton.element.onmouseleave = function()
	{
		self.fullscreenButton.img.style.opacity = 1.0;
	};

	var fullscreen = true;
	this.fullscreenButton.setCallback(function()
	{
		self.setFullscreen(fullscreen);
		fullscreen = !fullscreen;
	});

	//VR button
	this.vrButton = new ButtonImage(this.element);
	this.vrButton.size.set(25, 25);
	this.vrButton.setImage(Editor.filePath + "icons/misc/vr.png");
	this.vrButton.visible = false;
	this.vrButton.updateInterface();
	this.vrButton.element.onmouseenter = function()
	{
		self.vrButton.img.style.opacity = 0.5;
	};
	this.vrButton.element.onmouseleave = function()
	{
		self.vrButton.img.style.opacity = 1.0;
	};

	//Camera mode button
	this.cameraButton = new ButtonImage(this.element);
	this.cameraButton.size.set(25, 25);
	this.cameraButton.setImage(Editor.filePath + "icons/misc/3d.png");
	this.cameraButton.setAltText("Change camera mode");
	this.cameraButton.visible = true;
	this.cameraButton.updateInterface();

	this.cameraButton.element.onmouseenter = function()
	{
		self.cameraButton.img.style.opacity = 0.5;
	};

	this.cameraButton.element.onmouseleave = function()
	{
		self.cameraButton.img.style.opacity = 1.0;
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

		//Check if scene exists in program
		var scenes = Editor.program.children;
		for(var i = 0; i < scenes.length; i++)
		{
			if(this.scene.uuid === scenes[i].uuid)
			{
				return;
			}
		}

		//If not found close tab
		if(i >= scenes.length)
		{
			this.close();
		}
	}
};

//Set fullscreen mode
SceneEditor.prototype.setFullscreen = function(value)
{
	//Apply fullscreen mode
	if(value)
	{
		//Set to fullscreen mode
		Editor.setFullscreen(true, this.element);

		this.element.style.zIndex = 10000;
		this.position.set(0, 0);	
		this.size.set(window.screen.width, window.screen.height);
		this.updateInterface();

		this.resizeCamera();
	}
	else
	{
		//Leave fullscreen mode
		Editor.setFullscreen(false);
	
		//Restore elements
		this.element.style.zIndex = 0;
		Interface.updateInterface();
	}
};

//Activate
SceneEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	if(this.scene !== null)
	{
		Editor.program.scene = this.scene;
	}

	this.initializeRenderer();
	this.updateSettings();
	this.setState(SceneEditor.EDITING);

	Interface.selectTool(Editor.SELECT);
	Editor.resize();
};

//Deactivate
SceneEditor.prototype.deactivate = function()
{
	TabElement.prototype.deactivate.call(this);

	//Hide run button
	Interface.run.visible = false;
	Interface.run.updateInterface();
};

//Update settings
SceneEditor.prototype.updateSettings = function()
{
	//TODO <RENDERER SETTINGS>

	//Grid
	this.gridHelper.visible = Settings.editor.gridEnabled;
	this.gridHelper.setSize(Settings.editor.gridSize);
	this.gridHelper.setSpacing(Settings.editor.gridSpacing);
	this.gridHelper.update();

	this.axisHelper.visible = Settings.editor.axisEnabled;

	//Tool
	if(this.tool !== null && Editor.toolMode !== Editor.SCALE)
	{
		this.tool.setSpace(Settings.editor.transformationSpace);
		this.tool.setSnap(Settings.editor.snap);
		this.tool.setTranslationSnap(Settings.editor.gridSpacing);
		this.tool.setRotationSnap(Settings.editor.snapAngle);
	}
};

//Destroy
SceneEditor.prototype.destroy = function()
{
	TabElement.prototype.destroy.call(this);

	this.mouse.dispose();
	this.keyboard.dispose();
}

//Set scene
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
		else if(this.keyboard.keyJustPressed(Keyboard.F2))
		{
			if(Editor.selectedObject !== null)
			{
				var name = prompt("Rename object", Editor.selectedObject.name);
				if(name !== null && name !== "")
				{
					Editor.selectedObject.name = name;
					Editor.updateObjectViews();
				}
			}
		}
		else if(this.keyboard.keyPressed(Keyboard.CTRL))
		{
			if(Interface.panel !== null && !Interface.panel.focused)
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
			if(Editor.selectedObject !== null)
			{
				if(this.tool !== null)
				{
					this.isEditingObject = this.tool.update();
					
					if(this.mouse.buttonJustPressed(Mouse.LEFT) && this.isEditingObject)
					{
						Editor.history.push(Editor.selectedObject, Action.CHANGED);
					}

					if(this.isEditingObject)
					{
						Editor.updateObjectPanel();
					}
				}
				else
				{
					this.isEditingObject = false;
				}
			}
		}
		
		//Update object transformation matrix
		if(Editor.selectedObject !== null)
		{	
			if(!Editor.selectedObject.matrixAutoUpdate)
			{
				Editor.selectedObject.updateMatrix();
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

					this.camera.position.x -= this.mouse.delta.x * ratio;
					this.camera.position.y += this.mouse.delta.y * ratio;
				}

				//Camera zoom
				if(this.mouse.wheel !== 0)
				{
					this.camera.size += this.mouse.wheel * this.camera.size / 1000;
					this.camera.updateProjectionMatrix();
				}
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
							this.cameraRotation.y += 0.002 * this.mouse.delta.y;
						}
						else
						{
							this.cameraRotation.y -= 0.002 * this.mouse.delta.y;
						}

						this.cameraRotation.x -= 0.002 * this.mouse.delta.x;
						

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
						var speed = this.camera.position.distanceTo(SceneEditor.ZERO) / 1000;
						if(speed < 0.02)
						{
							speed = 0.02;
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
						this.camera.position.y += this.mouse.delta.y * 0.1;
					}

					//Move in camera direction using mouse scroll
					if(this.mouse.wheel !== 0)
					{
						//Move speed
						var speed = this.camera.position.distanceTo(SceneEditor.ZERO) / 2000;
						speed *= this.mouse.wheel;

						//Limit zoom speed
						if(speed < 0 && speed > -0.03)
						{
							speed = -0.03;
						}
						else if(speed > 0 && speed < 0.03)
						{
							speed = 0.03;
						}

						//Move camera
						var direction = this.camera.getWorldDirection();
						direction.multiplyScalar(speed);
						this.camera.position.sub(direction);
					}

					//WASD movement
					if(Editor.keyboard.keyPressed(Keyboard.W))
					{
						var direction = this.camera.getWorldDirection();
						direction.multiplyScalar(0.5);
						this.camera.position.add(direction);
					}
					if(Editor.keyboard.keyPressed(Keyboard.S))
					{
						var direction = this.camera.getWorldDirection();
						direction.multiplyScalar(0.5);
						this.camera.position.sub(direction);
					}
					if(Editor.keyboard.keyPressed(Keyboard.A))
					{
						var direction = new THREE.Vector3(Math.sin(this.cameraRotation.x - 1.57), 0, Math.cos(this.cameraRotation.x - 1.57));
						direction.normalize();
						direction.multiplyScalar(0.5);
						this.camera.position.sub(direction);
					}
					if(Editor.keyboard.keyPressed(Keyboard.D))
					{
						var direction = new THREE.Vector3(Math.sin(this.cameraRotation.x + 1.57), 0, Math.cos(this.cameraRotation.x + 1.57));
						direction.normalize();
						direction.multiplyScalar(0.5);
						this.camera.position.sub(direction);
					}
				}
				else if(Settings.editor.navigation === Settings.ORBIT)
				{
					//Look around
					if(this.mouse.buttonPressed(Mouse.LEFT) && !this.isEditingObject)
					{
						if(Settings.editor.invertNavigation)
						{
							this.cameraRotation.y += 0.002 * this.mouse.delta.y;
						}
						else
						{
							this.cameraRotation.y -= 0.002 * this.mouse.delta.y;
						}

						this.cameraRotation.x -= 0.002 * this.mouse.delta.x;

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
						this.cameraDistance += this.camera.position.distanceTo(this.cameraLookAt) / 1500 * this.mouse.wheel;
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

					//Move target point
					if(this.mouse.buttonPressed(Mouse.RIGHT))
					{
						var direction = this.camera.getWorldDirection();
						direction.y = 0;
						direction.normalize();

						this.cameraLookAt.x += direction.x * this.mouse.delta.y * 0.1;
						this.cameraLookAt.z += direction.z * this.mouse.delta.y * 0.1;

						direction.applyAxisAngle(SceneEditor.UP, 1.57)

						this.cameraLookAt.x += direction.x * this.mouse.delta.x * 0.1;
						this.cameraLookAt.z += direction.z * this.mouse.delta.x * 0.1;
					}

					//Update camera position and direction
					var cosAngleY = Math.cos(this.cameraRotation.y);
					var position = new THREE.Vector3(this.cameraDistance * Math.cos(this.cameraRotation.x)*cosAngleY, this.cameraDistance * Math.sin(this.cameraRotation.y), this.cameraDistance * Math.sin(this.cameraRotation.x)*cosAngleY);
					this.camera.position.copy(position);
					this.camera.position.add(this.cameraLookAt);
					this.camera.lookAt(this.cameraLookAt);
				}
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
			alert("Error testing program\nState update caused an error\n" + e.stack);
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
	var renderer = this.renderer;

	if(this.state === SceneEditor.EDITING)
	{
		//Clear
		renderer.clear();

		//Render scene
		renderer.setViewport(0, 0, this.canvas.width, this.canvas.height);
		renderer.render(Editor.program.scene, this.camera);

		//Render tools
		renderer.render(this.toolScene, this.camera);
		renderer.clearDepth();
		renderer.render(this.toolSceneTop, this.camera);

		//Camera preview
		if(Settings.editor.cameraPreviewEnabled)
		{
			var width = Settings.editor.cameraPreviewPercentage * this.canvas.width;
			var height = Settings.editor.cameraPreviewPercentage * this.canvas.height;
			var offset = this.canvas.width - width - 10;

			renderer.setScissorTest(true);
			renderer.setViewport(offset, 10, width, height);
			renderer.setScissor(offset, 10, width, height);

			//Preview selected camera
			if(Editor.selectedObject instanceof PerspectiveCamera || Editor.selectedObject instanceof OrthographicCamera)
			{
				var camera = Editor.selectedObject;
				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				renderer.clear();
				renderer.setViewport(offset + width * camera.offset.x, 10 + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
				renderer.setScissor(offset + width * camera.offset.x, 10 + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
				renderer.render(Editor.program.scene, camera);
			}
			//Preview all cameras in use
			else if(Editor.program.scene.cameras.length > 0)
			{
				renderer.clear();

				var scene = Editor.program.scene;
				for(var i = 0; i < scene.cameras.length; i++)
				{
					var camera = scene.cameras[i];
					camera.aspect = width / height;
					camera.updateProjectionMatrix();
					
					if(camera.clearColor)
					{
						renderer.clearColor();
					}
					if(camera.clearDepth)
					{
						renderer.clearDepth();
					}

					renderer.setViewport(offset + width * camera.offset.x, 10 + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
					renderer.setScissor(offset + width * camera.offset.x, 10 + height * camera.offset.y, width * camera.viewport.x, height * camera.viewport.y);
					renderer.render(scene, camera);
				}
			}

			renderer.setScissorTest(false);
			renderer.setScissor(0, 0, this.canvas.width, this.canvas.height);
		}
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
			alert("Error testing program\nRender caused an error\n" + e.stack);
		}
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
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: antialiasing});
	this.renderer.setSize(this.canvas.width, this.canvas.height);
	this.renderer.shadowMap.enabled = shadows;
	this.renderer.shadowMap.type = shadowsType;
	this.renderer.toneMapping = toneMapping;
	this.renderer.toneMappingExposure = toneMappingExposure;
	this.renderer.toneMappingWhitePoint = toneMappingWhitePoint;
	this.renderer.autoClear = false;
}

//Update raycaster position from editor mouse position
SceneEditor.prototype.updateRaycasterFromMouse = function()
{
	var mouse = new THREE.Vector2((this.mouse.position.x / this.canvas.width) * 2 - 1, -(this.mouse.position.y / this.canvas.height) * 2 + 1);
	this.raycaster.setFromCamera(mouse, this.camera);
};

//Select objects with mouse
SceneEditor.prototype.selectObjectWithMouse = function()
{
	this.updateRaycasterFromMouse();

	var intersects = this.raycaster.intersectObjects(Editor.program.scene.children, true);
	if(intersects.length > 0)
	{
		Editor.selectObject(intersects[0].object);
	}
};

//Update editor raycaster with new x and y positions (normalized -1 to 1)
SceneEditor.prototype.updateRaycaster = function(x, y)
{
	this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
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
		this.camera = new OrthographicCamera(10, aspect, OrthographicCamera.RESIZE_HORIZONTAL);
		this.camera.position.set(0, 0, 20);
		
		this.gridHelper.rotation.x = Math.PI / 2;
	}
	else if(mode === SceneEditor.CAMERA_PERSPECTIVE)
	{
		this.camera = new PerspectiveCamera(60, aspect);
		this.camera.position.set(0, 3, 5);

		this.cameraRotation.set(3.14, 0);
		this.cameraLookAt.set(0, 0, 0);
		this.cameraDistance = 10;
		this.setCameraRotation(this.cameraRotation, this.camera);

		this.gridHelper.rotation.x = 0;
	}

	this.cameraMode = mode;
	this.selectTool(this.toolMode);
};

//Set camera rotation
SceneEditor.prototype.setCameraRotation = function(cameraRotation, camera)
{
	//Calculate direction vector
	var cosAngleY = Math.cos(cameraRotation.y);
	var direction = new THREE.Vector3(Math.sin(cameraRotation.x)*cosAngleY, Math.sin(cameraRotation.y), Math.cos(cameraRotation.x)*cosAngleY);

	//Add position offset and set camera direction
	direction.add(camera.position);
	camera.lookAt(direction);
};

//Set scene editor state
SceneEditor.prototype.setState = function(state)
{
	this.state = state;

	if(state === SceneEditor.EDITING)
	{
		//Set run button text
		Interface.run.setText("Run");
		Interface.run.visible = true;
		Interface.run.updateInterface();

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
			//Copy program
			this.programRunning = Editor.program.clone();

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

			//Set renderer size
			this.renderer.setViewport(0, 0, this.canvas.width, this.canvas.height);
			this.renderer.setScissor(0, 0, this.canvas.width, this.canvas.height);

			//Set run button text
			Interface.run.setText("Stop");
			Interface.run.visible = true;
			Interface.run.updateInterface();
		}
		catch(e)
		{
			this.setState(SceneEditor.EDITING);
			alert("Error testing program\nInitialization caused an error\n" + e.stack);
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

	this.toolContainer.removeAll();

	if(this.tool !== null)
	{
		this.tool.dispose();
	}

	if(Editor.selectedObject !== null && this.toolMode !== Editor.SELECT)
	{
		if(this.toolMode === Editor.MOVE)
		{
			this.tool = new TransformControls(this.camera, this.canvas, this.mouse);
			this.tool.setMode("translate");
		}
		else if(this.toolMode === Editor.SCALE)
		{
			this.tool = new TransformControls(this.camera, this.canvas, this.mouse);
			this.tool.setMode("scale");
		}
		else if(this.toolMode === Editor.ROTATE)
		{
			this.tool = new TransformControls(this.camera, this.canvas, this.mouse);
			this.tool.setMode("rotate");
		}
		
		this.tool.setSpace(Settings.editor.transformationSpace);
		this.tool.setSnap(Settings.editor.snap);
		this.tool.setTranslationSnap(Settings.editor.gridSpacing);
		this.tool.setRotationSnap(Settings.editor.snapAngle);

		this.tool.attach(Editor.selectedObject);
		this.toolContainer.add(this.tool);
	}
	else
	{
		this.tool = null;
	}
};

//Select helper to debug selected object data
SceneEditor.prototype.selectObjectHelper = function()
{
	this.objectHelper.removeAll();

	if(Editor.selectedObject !== null)
	{
		var object = Editor.selectedObject;

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
		}
		//Particle
		else if(object instanceof ParticleEmitter)
		{
			this.objectHelper.add(new ParticleEmitterHelper(object));
		}
		//Physics
		else if(object instanceof PhysicsObject)
		{
			this.objectHelper.add(new PhysicsObjectHelper(object));
		}
		//Script or Audio
		else if(object instanceof Script || object instanceof THREE.Audio)
		{
			this.objectHelper.add(new ObjectIconHelper(object, ObjectIcons.get(object.type)));
		}
		//Animated Mesh
		else if(object instanceof THREE.SkinnedMesh)
		{
			this.objectHelper.add(new WireframeHelper(object, 0xFFFF00));
			this.objectHelper.add(new THREE.SkeletonHelper(object));
		}
		//Mesh
		else if(object instanceof THREE.Mesh)
		{
			this.objectHelper.add(new WireframeHelper(object, 0xFFFF00));
		}
		//Object 3D
		else if(object instanceof Container)
		{
			this.objectHelper.add(new BoundingBoxHelper(object, 0xFFFF00));
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
		this.programRunning.dispose();
		this.programRunning = null;
	}

	//Unlock mouse
	this.mouse.setLock(false);
};

//Update scene editor interface
SceneEditor.prototype.updateInterface = function()
{
	//Set visibilty
	if(this.visible)
	{
		this.element.style.display = "block";

		if(Settings.general.showStats)
		{
			this.stats.dom.style.visibility = "visible";
		}
		else
		{
			this.stats.dom.style.visibility = "hidden";
		}

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
