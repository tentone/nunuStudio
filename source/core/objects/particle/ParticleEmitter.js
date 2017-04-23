"use strict";

/**
 * Particle emitter is a wrapper for SPE particle systems
 * 
 * Documentation for SPE particle engine can be found here https://squarefeet.github.io/ShaderParticleEngine/docs/api/index.html
 * 
 * @class ParticleEmitter
 * @constructor
 * @extends {Points}
 * @module Particles
 */

/**
 * SPE Group
 * 
 * https://squarefeet.github.io/ShaderParticleEngine/docs/api/SPE.Group.html
 * 
 * @property group
 * @type {SPE.Group}
 */

/**
 * SPE Emitter
 * 
 * Emitter has attributes that can be used to controll the particle system
 * 
 * https://squarefeet.github.io/ShaderParticleEngine/docs/api/SPE.Emitter.html
 * 
 * @property emitter
 * @type {SPE.Emitter}
 */

function ParticleEmitter(group, emitter)
{
	//Group
	if(group !== undefined)
	{
		this.group = new SPE.Group(group);
	}
	else
	{
		this.group = new SPE.Group(ParticleEmitter.defaultGroup);
	}

	//Super constructor
	THREE.Points.call(this, this.group.geometry, this.group.material);

	this.type = "ParticleEmiter";
	this.name = "particle";
	this.frustumCulled = false;

	//Group
	var group = this.group;
	Object.defineProperties(this,
	{
		texture:
		{
			get: function()
			{
				return group.texture;
			},
			set: function(texture)
			{
				group.texture = texture;
			}
		}
	});

	//Emitter
	if(emitter !== undefined)
	{
		this.emitter = new SPE.Emitter(emitter);
		this.group.addEmitter(this.emitter);
	}
	else
	{
		this.emitter = new SPE.Emitter(ParticleEmitter.defaultEmitter);
		this.group.addEmitter(this.emitter);
	}

	//Clock
	this.clock = new THREE.Clock();

	//Override raycast
	this.raycast = function()
	{
		return null;
	};
}

ParticleEmitter.prototype = Object.create(THREE.Points.prototype);

ParticleEmitter.defaultEmitter =
{		
	particleCount: 2000,
	velocity:
	{
		value: new THREE.Vector3(0, 25, 0),
		spread: new THREE.Vector3(10, 10, 10)
	},
	acceleration:
	{
		value: new THREE.Vector3(0, -10, 0),
		spread: new THREE.Vector3(10, 0, 10)
	}
};

ParticleEmitter.defaultGroup = 
{
	texture:
	{
		value: null
	},
	maxParticleCount: 2000,
	blending: THREE.AdditiveBlending,
	fog: false,
	depthWrite: false,
	depthTest: true,
	transparent: true,
	hasPerspective: true
};

/**
 * Initialize particle system.
 * 
 * Called automatically by the runtime.
 * 
 * @method initialize
 */
ParticleEmitter.prototype.initialize = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}

	this.clock.start();
};

/**
 * Update particle emitter state.
 * 
 * Called automatically by the runtime.
 * 
 * @method update
 */
ParticleEmitter.prototype.update = function()
{
	this.group.tick(this.clock.getDelta());

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
};

/**
 * Dispose particle emitter.
 * 
 * @method dispose
 */
ParticleEmitter.prototype.dispose = function()
{
	this.group.texture.dispose();

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
};

/**
 * Serialize object as JSON.
 *
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
ParticleEmitter.prototype.toJSON = function(meta)
{
	var material = this.material;
	var geometry = this.geometry;
	this.material = undefined;
	this.geometry = undefined;

	var texture = this.group.texture;
	var data = THREE.Object3D.prototype.toJSON.call(this, meta, function(meta, object)
	{	
		texture = texture.toJSON(meta);
	});

	this.material = material;
	this.geometry = geometry;

	//Group 
	data.object.group = {};
	data.object.group.texture = {};
	data.object.group.texture.value = texture.uuid;
	data.object.group.texture.frames = this.group.textureFrames.toArray();
	data.object.group.texture.frameCount = this.group.textureFrameCount
	data.object.group.texture.loop = this.group.textureLoop;
	data.object.group.fixedTimeStep = this.group.fixedTimeStep;
	data.object.group.hasPerspective = this.group.hasPerspective;
	data.object.group.colorize = this.group.colorize;
	data.object.group.maxParticleCount = this.group.maxParticleCount;
	data.object.group.transparent = this.group.transparent;
	data.object.group.blending = this.group.blending;
	data.object.group.alphaTest = this.group.alphaTest;
	data.object.group.depthWrite = this.group.depthWrite;
	data.object.group.depthTest = this.group.depthTest;
	data.object.group.fog = this.group.fog;
	data.object.group.scale = this.group.scale;

	//Emitter
	data.object.emitter = {};
	data.object.emitter.uuid = this.emitter.uuid;
	data.object.emitter.type = this.emitter.type;
	data.object.emitter.direction = this.emitter.direction;
	data.object.emitter.particleCount = this.emitter.particleCount;
	data.object.emitter.duration = this.emitter.duration;
	data.object.emitter.isStatic = this.emitter.isStatic;

	//Max age
	data.object.emitter.maxAge = {};
	data.object.emitter.maxAge.value = this.emitter.maxAge.value;
	data.object.emitter.maxAge.spread = this.emitter.maxAge.spread;

	//Position
	data.object.emitter.position = {};
	data.object.emitter.position.value = this.emitter.position.value.toArray();
	data.object.emitter.position.spread = this.emitter.position.spread.toArray();
	//data.object.emitter.position.radius = this.emitter.position.radius;
	//data.object.emitter.position.radiusScale = this.emitter.position.radiusScale.toArray();

	//Velocity
	data.object.emitter.velocity = {};
	data.object.emitter.velocity.value = this.emitter.velocity.value.toArray();
	data.object.emitter.velocity.spread = this.emitter.velocity.spread.toArray();

	//Acceleration
	data.object.emitter.acceleration = {};
	data.object.emitter.acceleration.value = this.emitter.acceleration.value.toArray();
	data.object.emitter.acceleration.spread = this.emitter.acceleration.spread.toArray();

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
	data.object.emitter.color.spread = [];
	for(var i = 0; i < this.emitter.color.spread.length; i++)
	{
		data.object.emitter.color.spread.push(this.emitter.color.spread[i].toArray());
	}

	return data;
};