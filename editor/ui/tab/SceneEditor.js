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
	this.element.style.position = "absolute";

	//Canvas
	this.canvas = document.createElement("canvas");
	this.canvas.style.position = "absolute";
	this.canvas.style.top = "0px";
	this.canvas.style.left = "0px";
	this.element.appendChild(this.canvas);

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

			if(intersections.length > 0)
			{
				var object = intersections[0].object;

				if(object instanceof THREE.Mesh)
				{
					//Get first file from event
					var file = event.dataTransfer.files[0];

					if(file.type.startsWith("image"))
					{
						//Create new material with selected image
						var texture = new Texture(file.path);
						var material = new THREE.MeshPhongMaterial({map:texture, color:0xffffff, specular:0x333333, shininess:30});
						material.name = file.name;
						object.material = material;

						//Update asset explorer
						Editor.updateAssetExplorer();
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

	/*
	//Fullscreen button
	this.fullscreen_button = new ButtonImage(this.element);
	this.fullscreen_button.size.set(30, 30);
	this.fullscreen_button.setImage("editor/files/icons/misc/fullscreen.png");
	this.fullscreen_button.updateInterface();
	*/

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
SceneEditor.prototype.deactivate = deactivate;

//Deactivate
function deactivate()
{
	console.log("deactivated");
}

//Activate scene editor
function activate()
{
	Editor.program.scene = this.scene;
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
		this.element.style.visible = "visible";
		this.canvas.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.canvas.style.visibility = "hidden";
	}

	/*
	//Fullscreen button
	this.fullscreen_button.position.x = this.position.x + this.size.x - this.fullscreen_button.size.x - 5;
	this.fullscreen_button.position.y = this.position.y + this.size.y - this.fullscreen_button.size.y - 5;
	this.fullscreen_button.updateInterface();
	*/

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
