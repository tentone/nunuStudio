function Scene()
{
	//Objects that compose the scene
	this.objects = [];
	
	//Create three scene
	this.scene = new THREE.Scene();
	
	//Create world with default settings
	this.world = new CANNON.World();
	this.world.broadphase = new CANNON.NaiveBroadphase();
	this.world.gravity.set(0,-10,0);
	this.world.solver.tolerance = 0.05;

	//Runtime variables
	this.camera = null;
}

//Functions prototypes
Scene.prototype.update = update;
Scene.prototype.add = add;

//Add object to scene
function add(object)
{
	this.object.parent = this;
	this.scene.add(object.mesh);
	if(object.body != null)
	{
		this.world.add(object.world);
	}
}

//Update scene
function update()
{
	this.world.step(1/60);
	
	for(var i = 0; i < this.objects.length; i++)
	{
		this.objects[i].update();
	}
}