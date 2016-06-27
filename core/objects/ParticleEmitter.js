"use strict";

//Particle emitter constructor
function ParticleEmitter(texture, group, emitter)
{
	THREE.Object3D.call(this);

	this.type = "ParticleEmiter";
	this.name = "particle";

	this.clock = new THREE.Clock();

	//Create group
	if(group !== undefined)
	{
		//TODO <ADD CODE HERE>
	}
	else
	{
		this.group = new SPE.Group(
		{
			texture:
			{
				value: (texture !== undefined) ? texture : new Texture("data/particle.png")
			},
			blending: THREE.AdditiveBlending,
			maxParticleCount: 10000
		});
	}

	//Disable frustum culling on group mesh
	this.group.mesh.frustumCulled = false;

	//Create emitter
	if(emitter !== undefined)
	{
		//TODO <ADD CODE HERE>
	}
	else
	{
		this.emitter = new SPE.Emitter(
		{		
			particleCount: 2000,
			direction: 1,
			duration: null, //seconds
			type: SPE.distributions.BOX,

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

			drag:
			{
				value: 0,
				spread: 0
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
	}

	//Add emitter to group
	this.group.addEmitter(this.emitter);
}

//Function Prototype
ParticleEmitter.prototype = Object.create(THREE.Object3D.prototype);

//Runtime functions
ParticleEmitter.prototype.updateValues = updateValues;
ParticleEmitter.prototype.initialize = initialize;
ParticleEmitter.prototype.update = update;
ParticleEmitter.prototype.dispose = dispose;
ParticleEmitter.prototype.toJSON = toJSON;

//Update particle group and emitter runtime values
function updateValues()
{
	this.group.material.uniforms.texture.value = this.group.texture;
	this.group.material.blending = this.group.blending;
	this.group.material.needsUpdate = true;
}

//Initialize
function initialize()
{
	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}

	//Add group mesh to particle emitter object
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

//Dipose particle emitter
function dispose()
{
	//Dispose particle group
	this.group.dispose();

	//Dipose children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}

//Create JSON for particle emitter
function toJSON(meta)
{
	//Self pointer
	var self = this;

	//Call default toJSON
	var data = THREE.Object3D.prototype.toJSON.call(this, meta, function(meta, object)
	{
		self.group.texture.toJSON(meta);
	});

	//Group attributes
	data.object.group = {};
	data.object.group.texture = this.group.texture.uuid;
	data.object.group.textureFrames = this.group.textureFrames;
	data.object.group.textureFrameCount = this.group.textureFrameCount
	data.object.group.textureLoop = this.group.textureLoop;
	data.object.group.hasPerspective = this.group.hasPerspective;
	data.object.group.colorize = this.group.colorize;
	data.object.group.maxParticleCount = this.group.maxParticleCount;
	data.object.group.blending = this.group.blending;

	//Emitter attributes
	data.object.emitter = {};
	data.object.emitter.uuid = this.emitter.uuid;
	data.object.emitter.direction = this.emitter.direction;
	data.object.emitter.particleCount = this.emitter.particleCount;
	data.object.emitter.duration = this.emitter.duration;
	data.object.emitter.type = this.emitter.type;

	//Max age
	data.object.emitter.maxAge = {};
	data.object.emitter.maxAge.value = this.emitter.maxAge.value;
	data.object.emitter.maxAge.spread = this.emitter.maxAge.spread;

	//Position
	data.object.emitter.position = {};
	data.object.emitter.position.value = this.emitter.position.value;
	data.object.emitter.position.spread = this.emitter.position.spread;

	//Velocity
	data.object.emitter.velocity = {};
	data.object.emitter.velocity.value = this.emitter.velocity.value;
	data.object.emitter.velocity.spread = this.emitter.velocity.spread;

	//Acceleration
	data.object.emitter.acceleration = {};
	data.object.emitter.acceleration.value = this.emitter.acceleration.value;
	data.object.emitter.acceleration.spread = this.emitter.acceleration.spread;

	//Wiggle
	data.object.emitter.wiggle = {};
	data.object.emitter.wiggle.value = this.emitter.wiggle.value;
	data.object.emitter.wiggle.spread = this.emitter.wiggle.spread;

	//Opacity
	data.object.emitter.opacity = {};
	data.object.emitter.opacity.value = this.emitter.opacity.value;
	data.object.emitter.opacity.spread = this.emitter.opacity.spread;

	//Size
	data.object.emitter.size = {};
	data.object.emitter.size.value = this.emitter.size.value;
	data.object.emitter.size.spread = this.emitter.size.spread;

	//Angle
	data.object.emitter.angle = {};
	data.object.emitter.angle.value = this.emitter.angle.value;
	data.object.emitter.angle.spread = this.emitter.angle.spread;

	//Color
	data.object.emitter.color = {};
	data.object.emitter.color.value = this.emitter.color.value;
	data.object.emitter.color.spread = this.emitter.color.spread;

	return data;
}