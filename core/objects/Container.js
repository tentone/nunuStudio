function Container()
{
	THREE.Object3D.call(this);

	this.name = "container";
	this.type = "Group";
}

//Function Prototype
Container.prototype = Object.create(THREE.Object3D.prototype);
Container.prototype.icon = "editor/files/icons/effects/container.png";

//Runtime functions
Container.prototype.update = update;
Container.prototype.initialize = initialize;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update State
function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}