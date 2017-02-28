"use strict";

function SceneEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Scene", "editor/files/icons/misc/scene.png");

	//Canvas
	this.canvas = document.createElement("canvas");
	this.canvas.style.position = "absolute";
	this.element.appendChild(this.canvas);

	//Performance meter
	this.stats = new Stats();
	this.stats.dom.style.position = "absolute";
	this.stats.dom.style.left = "0px";
	this.stats.dom.style.top = "0px";
	this.stats.dom.style.zIndex = "0";
	this.element.appendChild(this.stats.dom);

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
			Editor.updateRaycaster(position.x / self.canvas.width * 2 - 1, -2 * position.y / self.canvas.height + 1);

			//Get object from drag buffer
			var uuid = event.dataTransfer.getData("uuid");
			var draggedObject = DragBuffer.popDragElement(uuid);

			//Check intersected objects
			var intersections = Editor.raycaster.intersectObjects(self.scene.children, true);

			//Dragged file into object
			if(intersections.length > 0 && event.dataTransfer.files.length > 0)
			{
				var file = event.dataTransfer.files[0];
				var name = FileSystem.getFileName(file.name);
				var object = intersections[0].object;

				//Image
				if(file.type.startsWith("image"))
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
				else if(file.type.startsWith("video"))
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
	this.fullscreenButton.setImage("editor/files/icons/misc/fullscreen.png");
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
	this.vrButton.setImage("editor/files/icons/misc/vr.png");
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
	this.cameraButton.setImage("editor/files/icons/misc/3d.png");
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
		Editor.setCameraMode();

		if(Editor.cameraMode === Editor.CAMERA_ORTHOGRAPHIC)
		{
			self.cameraButton.setImage("editor/files/icons/misc/2d.png");
		}
		else if(Editor.cameraMode === Editor.CAMERA_PERSPECTIVE)
		{
			self.cameraButton.setImage("editor/files/icons/misc/3d.png");
		}
	});

	//Scene
	this.scene = null;
}

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
}

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

		Editor.resizeCamera();
	}
	else
	{
		//Leave fullscreen mode
		Editor.setFullscreen(false);
	
		//Restore elements
		this.element.style.zIndex = 0;
		Interface.updateInterface();
	}
}

//Activate scene editor
SceneEditor.prototype.activate = function()
{
	this.active = true;
	
	if(this.scene !== null)
	{
		Editor.program.scene = this.scene;
	}

	Editor.setPerformanceMeter(this.stats);
	Editor.setRenderCanvas(this.canvas);
	Editor.setState(Editor.STATE_EDITING);
	Editor.resetEditingFlags();
	Editor.resize();
}

//Set scene
SceneEditor.prototype.attach = function(scene)
{
	this.scene = scene;
	this.updateMetadata();
}

//Check if scene is attached
SceneEditor.prototype.isAttached = function(scene)
{
	return this.scene === scene;
}

//Update division Size
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
		this.fullscreenButton.visible = this.visible && this.showButtonsFullscreen;
		this.fullscreenButton.updateInterface();

		//VR button
		this.vrButton.position.x = this.fullscreenButton.position.x - this.vrButton.size.x - 10;
		this.vrButton.position.y = this.fullscreenButton.position.y;
		this.vrButton.visible = this.visible && this.showButtonsVr;
		this.vrButton.updateInterface();

		//Camera mode button
		this.cameraButton.position.x = this.position.x + this.size.x - this.cameraButton.size.x - 5;
		this.cameraButton.position.y = 5;
		this.cameraButton.visible = this.visible && this.showButtonsCameraMode;
		this.cameraButton.updateInterface();

		//Canvas
		this.canvas.width = this.size.x;
		this.canvas.height = this.size.y;
		this.canvas.style.width = this.size.x + "px";
		this.canvas.style.height = this.size.y + "px";

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
}
