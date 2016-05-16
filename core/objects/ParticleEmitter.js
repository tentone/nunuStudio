function ParticleEmitter()
{
	THREE.Object3D.call(this);

	this.type = "ParticleEmiter";
	this.name = "particle";

	this.clock = clock = new THREE.Clock();

	this.group = new SPE.Group(
	{
		texture:
		{
			value: new Texture("./data/particle.png")
		}
	});

	this.emitter = new SPE.Emitter(
	{		
		particleCount: 2000,
		direction: 1,
		duration: null, //seconds

		maxAge:
		{
			value: 2,
			spread: 0
		},

		position:
		{
			value: new THREE.Vector3(0, 0, 0),
			spread: new THREE.Vector3(0, 0, 0)
		},

		velocity:
		{
			value: new THREE.Vector3(0, 25, 0),
			spread: new THREE.Vector3(10, 7.5, 10)
		},

		acceleration:
		{
			value: new THREE.Vector3(0, -10, 0),
			spread: new THREE.Vector3(10, 0, 10)
		},

		wiggle:
		{
			value: 0,
			spread: 0
		},

		color:
		{
			value: [new THREE.Color(1, 1, 1), new THREE.Color(1, 0, 0)],
			spread: [new THREE.Color(0, 0, 0), new THREE.Color(0.1, 0.1, 0.1)]
		},

		opacity:
		{
			value: 1,
			spread: 0
		},

		size:
		{
			value: 1,
			spread: 0
		},

		angle:
		{
			value: 0,
			spread: 0
		}
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
	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}

	//Add particle group to self
	this.add(this.group.mesh);
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
