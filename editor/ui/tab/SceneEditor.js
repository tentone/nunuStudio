function SceneEditor(parent)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}
	
	//ID
	var id = "scene_editor" + SceneEditor.id;
	SceneEditor.id++;

	//Create Element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

	//Canvas
	this.canvas = document.createElement("canvas");
	this.canvas.style.position = "absolute";
	this.canvas.style.top = "0px";
	this.canvas.style.left = "0px";
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
			var position_normalized = new THREE.Vector2((position.x/self.canvas.width)*2 - 1, -(position.y/self.canvas.height)*2 + 1);
			Editor.updateRaycaster(position_normalized.x, position_normalized.y);

			//Check intersected objects
			var intersections = Editor.raycaster.intersectObjects(self.scene.children, true);

			//Get object from drag buffer
			var uuid = event.dataTransfer.getData("uuid");
			var dragged_object = DragBuffer.popDragElement(uuid);

			//If its a file drop
			if(event.dataTransfer.files.length > 0)
			{
				//Get first file from event
				var file = event.dataTransfer.files[0];

				if(file.type.startsWith("image") && intersections.length > 0)
				{
					var object = intersections[0].object;

					if(object instanceof THREE.Mesh)
					{
						//Create new material with selected image
						var texture = new Texture(file.path);
						var material = new THREE.MeshPhongMaterial({map:texture, color:0xffffff, specular:0x333333, shininess:30});
						material.name = file.name;
						object.material = material;

						//Update asset explorer
						Editor.updateObjectViews();
					}
					else if(object instanceof THREE.Sprite)
					{
						//Create new material with selected image
						var texture = new Texture(file.path);
						var material = new THREE.SpriteMaterial({map: texture, color: 0xffffff});
						material.name = file.name;
						object.material = material;

						//Update asset explorer
						Editor.updateObjectViews();
					}
				}
				else if(file.name.endsWith(".isp"))
				{
					if(confirm("All unsaved changes to the project will be lost! Load file?"))
					{
						Editor.loadProgram(file.path);
					}
				}
			}
			//If its a dragged object
			else if(dragged_object !== null && intersections.length > 0)
			{
				var object = intersections[0].object;
				
				if(dragged_object instanceof THREE.SpriteMaterial)
				{
					if(object instanceof THREE.Sprite)
					{
						object.material = dragged_object;
						Editor.updateObjectViews();
					}
				}
				else if(dragged_object instanceof THREE.Material)
				{
					if(object instanceof THREE.Mesh)
					{
						object.material = dragged_object;
						Editor.updateObjectViews();
					}
				}
			}
		}
	};

	//Prevent deafault when object dragged over
	this.canvas.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Button
	this.show_buttons_vr = false;
	this.show_buttons_fullscreen = false;

	//Fullscreen button
	this.fullscreen_button = new ButtonImage(this.element);
	this.fullscreen_button.size.set(25, 25);
	this.fullscreen_button.setImage("editor/files/icons/misc/fullscreen.png");
	this.fullscreen_button.visible = false;
	this.fullscreen_button.setClass("");
	this.fullscreen_button.updateInterface();
	this.fullscreen_button.element.onmouseenter = function()
	{
		self.fullscreen_button.img.style.opacity = 0.5;
	};
	this.fullscreen_button.element.onmouseleave = function()
	{
		self.fullscreen_button.img.style.opacity = 1.0;
	};

	var fullscreen = true;
	this.fullscreen_button.setCallback(function()
	{
		self.setFullscreen(fullscreen);
		fullscreen = !fullscreen;
	});

	//VR button
	this.vr_button = new ButtonImage(this.element);
	this.vr_button.size.set(25, 25);
	this.vr_button.setImage("editor/files/icons/misc/vr.png");
	this.vr_button.visible = false;
	this.vr_button.setClass("");
	this.vr_button.updateInterface();
	this.vr_button.element.onmouseenter = function()
	{
		self.vr_button.img.style.opacity = 0.5;
	};
	this.vr_button.element.onmouseleave = function()
	{
		self.vr_button.img.style.opacity = 1.0;
	};

	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Scene
	this.scene = null;

	//Add element to document
	this.parent.appendChild(this.element);
}

//SceneEditor counter
SceneEditor.id = 0;

//Functions Prototype
SceneEditor.prototype.update = update;
SceneEditor.prototype.updateInterface = updateInterface;
SceneEditor.prototype.destroy = destroy;
SceneEditor.prototype.activate = activate;
SceneEditor.prototype.setScene = setScene;
SceneEditor.prototype.setFullscreen = setFullscreen;
SceneEditor.prototype.updateMetadata = updateMetadata;

//Update container object data
function updateMetadata(container)
{
	if(this.scene !== null)
	{
		container.setName(this.scene.name);
	}
}

//Set fullscreen mode
function setFullscreen(value)
{
	//Apply fullscreen mode
	if(value)
	{
		//Set to fullscreen mode
		App.enterFullscreen(this.element);

		this.element.style.zIndex = 10000;
		this.position.set(0, 0);	
		this.size.set(window.screen.width, window.screen.height);
		this.updateInterface();

		Editor.resizeCamera();
	}
	else
	{
		//Leave fullscreen mode
		App.leaveFullscreen();
	
		//Restore elements
		this.element.style.zIndex = 0;
		Interface.updateInterface();
	}
}

//Activate scene editor
function activate()
{
	Editor.program.scene = this.scene;
	Editor.setPerformanceMeter(this.stats);
	Editor.setRenderCanvas(this.canvas);
	Editor.setState(Editor.STATE_EDITING);
	Editor.resetEditingFlags();
	Editor.resize();
}

//Set scene
function setScene(scene)
{
	this.scene = scene;
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.canvas);
	}
	catch(e){}
}

//Update SceneEditor
function update(){}

//Update division Size
function updateInterface()
{
	//Fit parent
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	//Set visibilty
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.canvas.style.visibility = "visible";
		if(Settings.show_stats)
		{
			this.stats.dom.style.visibility = "visible";
		}
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.canvas.style.visibility = "hidden";
		this.stats.dom.style.visibility = "hidden";
	}

	//Fullscreen button
	this.fullscreen_button.position.x = this.position.x + this.size.x - this.fullscreen_button.size.x - 5;
	this.fullscreen_button.position.y = this.position.y + this.size.y - this.fullscreen_button.size.y - 5;
	this.fullscreen_button.visible = this.visible && this.show_buttons_fullscreen;
	this.fullscreen_button.updateInterface();

	//VR button
	this.vr_button.position.x = this.fullscreen_button.position.x - this.vr_button.size.x - 10;
	this.vr_button.position.y = this.fullscreen_button.position.y;
	this.vr_button.visible = this.visible && this.show_buttons_vr;
	this.vr_button.updateInterface();

	//Update canvas
	this.canvas.width = this.size.x;
	this.canvas.height = this.size.y;
	this.canvas.style.width = this.size.x + "px";
	this.canvas.style.height = this.size.y + "px";

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
