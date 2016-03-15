function Scene()
{
	//Objects composing the scene
	this.objects = [];
	
	//Create three scene
	this.scene = new THREE.Scene();
	
	//Create world with default settings
	this.world = new CANNON.World();
	this.world.broadphase = new CANNON.NaiveBroadphase();
	this.world.gravity.set(0,-10,0);
	this.world.solver.tolerance = 0.05;
}

Scene.prototype.update = update;

function update()
{
	this.world.step(1/60);
}