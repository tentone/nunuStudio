function Container()
{
	THREE.Object3D.call(this);

	this.name = "container";
	this.type = "Group";
	
	this.rotationAutoUpdate = false;
	this.matrixAutoUpdate = false;
}

//Function Prototype
Container.prototype = Object.create(THREE.Object3D.prototype);
Container.prototype.icon = "editor/files/icons/script/script.png";

//Runtime functions
Container.prototype.update = update;
Container.prototype.initialize = initialize;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].initialize != undefined)
		{
			this.children[i].initialize();
		}
	}
}

//Update Container
function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update != undefined)
		{
			this.children[i].update();
		}
	}
}