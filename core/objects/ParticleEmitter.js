function ParticleEmitter()
{
	THREE.Object3D.call(this);

	this.type = "ParticleEmiter";
	this.name = "particle";

	this.clock = clock = new THREE.Clock();

	this.group = new SPE.Group({
	texture: {
	value: THREE.ImageUtils.loadTexture('./data/particle.png')
	}
	});

	this.emitter = new SPE.Emitter({
	maxAge: {
	value: 2
	},
	position: {
	value: new THREE.Vector3(0, 0, 0),
	spread: new THREE.Vector3( 0, 0, 0 )
	},

	acceleration: {
	value: new THREE.Vector3(0, -10, 0),
	spread: new THREE.Vector3( 10, 0, 10 )
	},

	velocity: {
	value: new THREE.Vector3(0, 25, 0),
	spread: new THREE.Vector3(10, 7.5, 10)
	},

	color: {
	value: [ new THREE.Color('white'), new THREE.Color('red') ]
	},

	size: {
	value: 1
	},

	particleCount: 2000
	});

	this.group.addEmitter(this.emitter);
}

//Function Prototype
ParticleEmitter.prototype = Object.create(THREE.Object3D.prototype);
ParticleEmitter.prototype.icon = "editor/files/icons/effects/particles.png";

//Runtime functions
ParticleEmitter.prototype.update = update;
ParticleEmitter.prototype.initialize = initialize;

//Initialize
function initialize()
{
	//Add particle group to self
	this.add(this.group.mesh);

	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update State
function update()
{
	//Update group
	this.group.tick(this.clock.getDelta());

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}
