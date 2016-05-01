function Scene()
{
	THREE.Scene.call(this);

	this.name = "scene";

	//Disable auto matrix updates
	this.rotationAutoUpdate = false;
	this.matrixAutoUpdate = false;

	//Fog
	this.fog = null;//new THREE.Fog(0x0000ff, 1, 100);

	//Create cannon world
	this.world = new CANNON.World();
	this.world.broadphase = new CANNON.NaiveBroadphase();
	this.world.gravity.set(0, -9.8, 0);
	this.world.solver.iterations = 10;

	//Initialization variables
	this.initial_camera = null;

	//Runtime variables
	this.data = function(){};
	this.camera = null;
	this.listener = new THREE.AudioListener();
}

//Function Prototype
Scene.prototype = Object.create(THREE.Scene.prototype);
Scene.prototype.icon = "editor/files/icons/models/models.png";

//Runtime functions
Scene.prototype.initialize = initialize;
Scene.prototype.update = update;
Scene.prototype.toJSON = toJSON;

//Initialize
function initialize()
{
	//Initialize children and select camera
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.initial_camera === this.children[i].uuid)
		{
			this.camera = this.children[i];
		}

		this.children[i].initialize();
	}
}

//Update scene
function update()
{
	//this.world.step(1/60);
	
	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Create JSON for object
function toJSON(meta)
{
	var data = THREE.Scene.prototype.toJSON.call(this, meta);

	if(this.initial_camera !== null)
	{
		data.object.initial_camera = this.initial_camera;
	}

	return data;
}