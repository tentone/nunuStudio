"use strict";

/**
 * Particle emitter is a wrapper for SPE particle system.
 *
 * SPE is a threejs based particle emitter engine.
 * 
 * Documentation for SPE particle engine can be found here https://squarefeet.github.io/ShaderParticleEngine/docs/api/index.html
 * 
 * @class ParticleEmitter
 * @extends {Points}
 * @module Particles
 */
function ParticleEmitter(group, emitter)
{
	/**
	 * SPE Group instance.
	 * 
	 * https://squarefeet.github.io/ShaderParticleEngine/docs/api/SPE.Group.html
	 * 
	 * @property group
	 * @type {SPE.Group}
	 */
	this.group = new SPE.Group(group !== undefined ? group : ParticleEmitter.defaultGroup);

	/**
	 * SPE Emitter instance.
	 * 
	 * Emitter has attributes that can be used to controll the particle system
	 * 
	 * https://squarefeet.github.io/ShaderParticleEngine/docs/api/SPE.Emitter.html
	 * 
	 * @property emitter
	 * @type {SPE.Emitter}
	 */
	this.emitter = new SPE.Emitter(emitter !== undefined ? emitter : ParticleEmitter.defaultEmitter);
	this.group.addEmitter(this.emitter);

	THREE.Points.call(this, this.group.geometry, this.group.material);

	this.type = "ParticleEmiter";
	this.name = "particle";
	this.frustumCulled = false;

	this.dynamicEmitter = false;

	var self = this;
	Object.defineProperties(this,
	{
		texture:
		{
			get: function()
			{
				return self.group.texture;
			},
			set: function(value)
			{
				self.group.texture = value;
			}
		}
	});

	this.clock = new THREE.Clock();
}

ParticleEmitter.prototype = Object.create(THREE.Points.prototype);

/**
 * Default particle emitter configuration.
 *
 * @attribute defaultEmitter
 * @type {Object}
 */
ParticleEmitter.defaultEmitter =
{		
	particleCount: 200,
	velocity:
	{
		value: new THREE.Vector3(0, 0, 0),
		spread: new THREE.Vector3(3, 3, 3)
	},
	acceleration:
	{
		value: new THREE.Vector3(0, 0, 0),
		spread: new THREE.Vector3(0, 0, 0)
	}
};

/**
 * Default particle emitter group configuration.
 *
 * @attribute defaultGroup
 * @type {Object}
 */
ParticleEmitter.defaultGroup = 
{
	texture:
	{
		value: null
	},
	maxParticleCount: 200,
	blending: THREE.AdditiveBlending,
	fog: false,
	depthWrite: false,
	depthTest: true,
	transparent: true,
	hasPerspective: true
};

/**
 * Reload internal material and geometry.
 *
 * May be required after changing material related parameters.
 * 
 * @method reload
 */
ParticleEmitter.prototype.reload = function()
{
	this.dispose();

	var children = this.children;
	this.children = [];
	
	var particle = new ObjectLoader().parse(this.toJSON());

	this.children = children;
	this.group = particle.group;
	this.emitter = particle.emitter;
	this.geometry = this.group.geometry;
	this.material = this.group.material;
};

/**
 * Update particle object matrix.
 *
 * Ignores the particle position if the moveEmitter attribute is set true.
 * 
 * @method updateMatrix
 */
ParticleEmitter.prototype.updateMatrix = function()
{
	if(this.dynamicEmitter)
	{
		this.matrix.makeRotationFromQuaternion(this.quaternion);
		this.matrix.scale(this.scale);
	}
	else
	{
		this.matrix.compose(this.position, this.quaternion, this.scale);
	}

	this.matrixWorldNeedsUpdate = true;
};

/**
 * Particle emitter state is automatically updated before rendering.
 * 
 * @method onBeforeRender
 */
ParticleEmitter.prototype.onBeforeRender = function(renderer, scene, camera, renderTarget)
{
	this.group.uniforms.scale.value = renderer.getCurrentViewport().w;
	this.group.tick(this.clock.getDelta());

	if(this.dynamicEmitter)
	{
		this.emitter.position.value = this.position;	
	}
};

/**
 * Dispose particle emitter.
 *
 * Should be called when destroying particle emitter.
 * 
 * @method dispose
 */
ParticleEmitter.prototype.dispose = function()
{
	this.group.dispose();

	THREE.Object3D.prototype.dispose.call(this);
};

/**
 * Serialize object to JSON.
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
	data.object.group = this.group.toJSON(meta);
	
	//Emitter
	data.object.emitter = this.emitter.toJSON(meta);

	return data;
};

SPE.Group.prototype.toJSON = function(meta)
{
	var data = {};

	data.texture = {};
	data.texture.value = this.texture.uuid;
	data.texture.frames = this.textureFrames.toArray();
	data.texture.frameCount = this.textureFrameCount
	data.texture.loop = this.textureLoop;
	data.fixedTimeStep = this.fixedTimeStep;
	data.hasPerspective = this.hasPerspective;
	data.colorize = this.colorize;
	data.maxParticleCount = this.maxParticleCount;
	data.transparent = this.transparent;
	data.blending = this.blending;
	data.alphaTest = this.alphaTest;
	data.depthWrite = this.depthWrite;
	data.depthTest = this.depthTest;
	data.fog = this.fog;
	data.scale = this.scale;

	return data;
};

SPE.Emitter.prototype.toJSON = function(meta)
{
	var data = {};

	data.uuid = this.uuid;
	data.type = this.type;
	data.direction = this.direction;
	data.particleCount = this.particleCount;
	data.duration = this.duration;
	data.isStatic = this.isStatic;

	//Max age
	data.maxAge = {};
	data.maxAge.value = this.maxAge.value;
	data.maxAge.spread = this.maxAge.spread;

	//Position
	data.position = {};
	data.position.value = this.position.value.toArray();
	data.position.spread = this.position.spread.toArray();
	data.position.radius = this.position.radius;
	data.position.radiusScale = this.position.radiusScale.toArray();

	//Velocity
	data.velocity = {};
	data.velocity.value = this.velocity.value.toArray();
	data.velocity.spread = this.velocity.spread.toArray();

	//Acceleration
	data.acceleration = {};
	data.acceleration.value = this.acceleration.value.toArray();
	data.acceleration.spread = this.acceleration.spread.toArray();

	//Wiggle
	data.wiggle = {};
	data.wiggle.value = this.wiggle.value;
	data.wiggle.spread = this.wiggle.spread;

	//Opacity
	data.opacity = {};
	data.opacity.value = this.opacity.value.slice(0);
	data.opacity.spread = this.opacity.spread;

	//Size
	data.size = {};
	data.size.value = this.size.value.slice(0);
	data.size.spread = this.size.spread;

	//Angle
	data.angle = {};
	data.angle.value = this.angle.value.slice(0);
	data.angle.spread = this.angle.spread;

	//Color
	data.color = {};
	data.color.value = [];
	for(var i = 0; i < this.color.value.length; i++)
	{
		data.color.value.push(this.color.value[i].getHex());
	}

	data.color.spread = [];
	for(var i = 0; i < this.color.spread.length; i++)
	{
		data.color.spread.push(this.color.spread[i].toArray());
	}

	return data;
};