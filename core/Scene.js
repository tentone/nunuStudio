function Scene()
{
	THREE.Scene.call(this);
	this.name = "scene";

	//Disable auto updates
	this.rotationAutoUpdate = false;
	this.matrixAutoUpdate = false;

	//Create cannon world
	this.world = new CANNON.World();
	this.world.broadphase = new CANNON.NaiveBroadphase();
	this.world.gravity.set(0,-10,0);
	this.world.solver.tolerance = 0.05;
}

//Functions prototypes
Scene.prototype = Object.create(THREE.Scene.prototype);
Scene.prototype.icon = "editor/files/icons/models/models.png";

Scene.prototype.initialize = initialize;
Scene.prototype.update = update;
Scene.prototype.resize = resize;

//Initialize
function initialize()
{
	//TODO <ADD CODE HERE>
}

//Update scene
function update()
{
	this.world.step(1/60);
	
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update != undefined)
		{
			this.children[i].update();
		}
	}
}

//Resize
function resize()
{
	//TODO <ADD CODE HERE>
}