function SceneContainer(parent)
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
	var id = "scene_container" + SceneContainer.id;
	SceneContainer.id++;

	//Create Element
	this.element = document.createElement("canvas");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.top = "0px";
	this.element.style.left = "0px";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Scene
	this.scene = null;

	//Add element to document
	this.parent.appendChild(this.element);
}

//SceneContainer conter
SceneContainer.id = 0;

//Functions Prototype
SceneContainer.prototype.update = update;
SceneContainer.prototype.updateInterface = updateInterface;
SceneContainer.prototype.destroy = destroy;
SceneContainer.prototype.setScene = setScene;

//Set scene
function setScene(scene)
{
	this.scene = scene;
}

//Remove element
function destroy()
{
	this.parent.removeChild(this.element);
}

//Update SceneContainer
function update(){}

//Update division Size
function updateInterface()
{
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