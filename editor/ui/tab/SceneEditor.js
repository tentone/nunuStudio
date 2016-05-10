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
	this.element = document.createElement("canvas");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.top = "0px";
	this.element.style.left = "0px";

	//Self pointer
	var self = this;

	//Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();

		if(self.scene !== null)
		{
			//Canvas element
			var canvas = self.element;
			var rect = canvas.getBoundingClientRect();

			//Update raycaster direction
			var position = new THREE.Vector2(event.clientX - rect.left, event.clientY - rect.top);
			var position_normalized = new THREE.Vector2((position.x/self.element.width)*2 - 1, -(position.y/self.element.height)*2 + 1);
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
						object.material = material;
					}
				}
			}
		}
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
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

//SceneEditor conter
SceneEditor.id = 0;

//Functions Prototype
SceneEditor.prototype.update = update;
SceneEditor.prototype.updateInterface = updateInterface;
SceneEditor.prototype.destroy = destroy;
SceneEditor.prototype.activate = activate;
SceneEditor.prototype.setScene = setScene;

//Activate scene editor
function activate()
{
	Editor.program.scene = this.scene;
	Editor.setRenderCanvas(this.element);
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
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update SceneEditor
function update(){}

//Update division Size
function updateInterface()
{
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	this.element.width = this.size.x;
	this.element.height = this.size.y;

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}