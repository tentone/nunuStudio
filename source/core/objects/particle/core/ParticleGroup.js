import {Texture, Vector2, Math as TMath, AdditiveBlending, Vector4, ShaderMaterial, BufferGeometry, Points, Vector3} from "three";
import {ParticleShaders} from "../shaders/ParticleShaders.js";
import {ParticleEmitter} from "../ParticleEmitter.js";
import {ShaderAttribute} from "../helpers/ShaderAttribute.js";
import {ShaderUtils} from "./ShaderUtils.js";
import {ParticleEmitterControl} from "./ParticleEmitterControl.js";

/**
 * A map of options to configure an ParticleGroup instance.
 *
 * @class {Object} ParticleGroupOptions
 * @property {Object} texture An object describing the texture used by the group.
 * @property {Object} texture.value An instance of Texture.
 * @property {Object=} texture.frames A Vector2 instance describing the number of frames on the x- and y-axis of the given texture. If not provided, the texture will NOT be treated as a sprite-sheet and as such will NOT be animated.
 * @property {number} [texture.frameCount=texture.frames.x * texture.frames.y] The total number of frames in the sprite-sheet.                                Allows for sprite-sheets that don't fill the entire                                texture.
 * @property {number} texture.loop The number of loops through the sprite-sheet that should   be performed over the course of a single particle"s lifetime.
 * @property {number} fixedTimeStep If no dt (or deltaTime) value is passed to this group"s    tick() function, this number will be used to move the particle    simulation forward. Value in SECONDS.
 * @property {boolean} hasPerspective Whether the distance a particle is from the camera should affect the particle"s size.
 * @property {boolean} colorize Whether the particles in this group should be rendered with color, or whether the only color of particles will come from the provided texture.
 * @property {number} blending One of Three.js"s blending modes to apply to this group"s ShaderMaterial.
 * @property {boolean} transparent Whether these particle"s should be rendered with transparency.
 * @property {number} alphaTest Sets the alpha value to be used when running an alpha test on the texture.value property. Value between 0 and 1.
 * @property {boolean} depthWrite Whether rendering the group has any effect on the depth buffer.
 * @property {boolean} depthTest Whether to have depth test enabled when rendering this group.
 * @property {boolean} fog Whether this group"s particles should be affected by their scene"s fog.
 * @property {number} scale The scale factor to apply to this group"s particle sizes. Useful for setting particle sizes to be relative to renderer size.
 */

/**
 * The ParticleGroup class. Creates a new group, containing a material, geometry, and mesh.
 *
 * @constructor
 * @author Luke Moody
 * @class ParticleGroup
 * @param {ParticleGroupOptions} options A map of options to configure the group instance.
 */
function ParticleGroup(options)
{
	// Ensure we have a map of options to play with
	options = ShaderUtils.ensureTypedArg(options, ShaderUtils.types.OBJECT, {});
	options.texture = ShaderUtils.ensureTypedArg(options.texture, ShaderUtils.types.OBJECT, {});

	// Assign a UUID to this instance
	this.uuid = TMath.generateUUID();

	// If no deltaTime value is passed to the ParticleGroup.tick function, the value of this property will be used to advance the simulation.
	this.fixedTimeStep = ShaderUtils.ensureTypedArg(options.fixedTimeStep, ShaderUtils.types.NUMBER, 0.016);

	// Set properties used in the uniforms map, starting with the texture stuff.
	this.texture = ShaderUtils.ensureInstanceOf(options.texture.value, Texture, null);
	this.textureFrames = ShaderUtils.ensureInstanceOf(options.texture.frames, Vector2, new Vector2(1, 1));
	this.textureFrameCount = ShaderUtils.ensureTypedArg(options.texture.frameCount, ShaderUtils.types.NUMBER, this.textureFrames.x * this.textureFrames.y);
	this.textureLoop = ShaderUtils.ensureTypedArg(options.texture.loop, ShaderUtils.types.NUMBER, 1);
	this.textureFrames.max(new Vector2(1, 1));

	this.hasPerspective = ShaderUtils.ensureTypedArg(options.hasPerspective, ShaderUtils.types.BOOLEAN, true);
	this.colorize = ShaderUtils.ensureTypedArg(options.colorize, ShaderUtils.types.BOOLEAN, true);
	this.maxParticleCount = ShaderUtils.ensureTypedArg(options.maxParticleCount, ShaderUtils.types.NUMBER, null);

	// Set properties used to define the ShaderMaterial"s appearance.
	this.blending = ShaderUtils.ensureTypedArg(options.blending, ShaderUtils.types.NUMBER, AdditiveBlending);
	this.transparent = ShaderUtils.ensureTypedArg(options.transparent, ShaderUtils.types.BOOLEAN, true);
	this.alphaTest = parseFloat(ShaderUtils.ensureTypedArg(options.alphaTest, ShaderUtils.types.NUMBER, 0.0));
	this.depthWrite = ShaderUtils.ensureTypedArg(options.depthWrite, ShaderUtils.types.BOOLEAN, false);
	this.depthTest = ShaderUtils.ensureTypedArg(options.depthTest, ShaderUtils.types.BOOLEAN, true);
	this.fog = ShaderUtils.ensureTypedArg(options.fog, ShaderUtils.types.BOOLEAN, true);
	this.scale = ShaderUtils.ensureTypedArg(options.scale, ShaderUtils.types.NUMBER, 300);

	this.emitters = [];
	this.emitterIDs = [];

	// Create properties for use by the emitter pooling functions.
	this.pool = [];
	this.poolCreationSettings = null;
	this._createNewWhenPoolEmpty = 0;

	// Whether all attributes should be forced to updated their entire buffer contents on the next tick.
	//
	// Used when an emitter is removed.
	this._attributesNeedRefresh = false;
	this._attributesNeedDynamicReset = false;

	this.particleCount = 0;

	/**
	 * Map of uniforms to be applied to the ShaderMaterial instance.
	 *
	 * @attribute uniforms
	 * @type {Object}
	 */
	this.uniforms =
	{
		textureSampler: {
			type: "t",
			value: this.texture
		},
		textureAnimation: {
			type: "v4",
			value: new Vector4(
				this.textureFrames.x,
				this.textureFrames.y,
				this.textureFrameCount,
				Math.max(Math.abs(this.textureLoop), 1.0)
		   )
		},
		fogColor: {
			type: "c",
			value: null
		},
		fogNear: {
			type: "f",
			value: 10
		},
		fogFar: {
			type: "f",
			value: 200
		},
		fogDensity: {
			type: "f",
			value: 0.5
		},
		deltaTime: {
			type: "f",
			value: 0
		},
		runTime: {
			type: "f",
			value: 0
		},
		scale: {
			type: "f",
			value: this.scale
		}
	};

	this.defines =
	{
		HAS_PERSPECTIVE: this.hasPerspective,
		COLORIZE: this.colorize,
		VALUE_OVER_LIFETIME_LENGTH: ParticleEmitter.valueOverLifetimeLength,
		SHOULD_ROTATE_TEXTURE: false,
		SHOULD_ROTATE_PARTICLES: false,
		SHOULD_WIGGLE_PARTICLES: false,
		SHOULD_CALCULATE_SPRITE: this.textureFrames.x > 1 || this.textureFrames.y > 1
	};

	/**
	 * Map of all attributes to be applied to the particles.
	 *
	 * See ShaderAttribute for a bit more info on this bit.
	 *
	 * @attribute attributes
	 * @type {Object}
	 */
	this.attributes =
	{
		position: new ShaderAttribute("v3", true),
		acceleration: new ShaderAttribute("v4", true), // w component is drag
		velocity: new ShaderAttribute("v3", true),
		rotation: new ShaderAttribute("v4", true),
		rotationCenter: new ShaderAttribute("v3", true),
		params: new ShaderAttribute("v4", true), // Holds (alive, age, delay, wiggle)
		size: new ShaderAttribute("v4", true),
		angle: new ShaderAttribute("v4", true),
		color: new ShaderAttribute("v4", true),
		opacity: new ShaderAttribute("v4", true)
	};

	this.attributeKeys = Object.keys(this.attributes);
	this.attributeCount = this.attributeKeys.length;

	this.material = new ShaderMaterial(
		{
			uniforms: this.uniforms,
			vertexShader: ParticleShaders.vertex,
			fragmentShader: ParticleShaders.fragment,
			blending: this.blending,
			transparent: this.transparent,
			alphaTest: this.alphaTest,
			depthWrite: this.depthWrite,
			depthTest: this.depthTest,
			defines: this.defines,
			fog: this.fog
		});

	this.geometry = new BufferGeometry();
	this.mesh = new Points(this.geometry, this.material);

	if (this.maxParticleCount === null)
	{
		console.warn("nunuStudio: No maxParticleCount specified. Adding emitters after rendering will probably cause errors.");
	}
}

ParticleGroup.constructor = ParticleGroup;

ParticleGroup.prototype._updateDefines = function()
{
	var emitters = this.emitters;
	var emitter;
	var defines = this.defines;

	for (var i = emitters.length - 1; i >= 0; --i) 
	{
		emitter = emitters[i];

		// Only do angle calculation if there"s no spritesheet defined.
		//
		// Saves calculations being done and then overwritten in the shaders.
		if (!defines.SHOULD_CALCULATE_SPRITE) 
		{
			defines.SHOULD_ROTATE_TEXTURE = defines.SHOULD_ROTATE_TEXTURE || Boolean(Math.max(
				Math.max.apply(null, emitter.angle.value),
				Math.max.apply(null, emitter.angle.spread)
		   ));
		}

		defines.SHOULD_ROTATE_PARTICLES = defines.SHOULD_ROTATE_PARTICLES || Boolean(Math.max(
			emitter.rotation.angle,
			emitter.rotation.angleSpread
	   ));

		defines.SHOULD_WIGGLE_PARTICLES = defines.SHOULD_WIGGLE_PARTICLES || Boolean(Math.max(
			emitter.wiggle.value,
			emitter.wiggle.spread
	   ));
	}

	this.material.needsUpdate = true;
};

ParticleGroup.prototype._applyAttributesToGeometry = function()
{
	var attributes = this.attributes;
	var geometry = this.geometry;
	var geometryAttributes = geometry.attributes;
	var attribute;
	var geometryAttribute;

	// Loop through all the shader attributes and assign (or re-assign) typed array buffers to each one.
	for (var attr in attributes)
	{
		if (attributes.hasOwnProperty(attr))
		{
			attribute = attributes[attr];
			geometryAttribute = geometryAttributes[attr];

			// Update the array if this attribute exists on the geometry.
			//
			// This needs to be done because the attribute"s typed array might have been resized and reinstantiated, and might now be looking at a different ArrayBuffer, so reference needs updating.
			if (geometryAttribute)
			{
				geometryAttribute.array = attribute.typedArray.array;
			}

			// Add the attribute to the geometry if it doesn't already exist.
			else
			{
				geometry.setAttribute(attr, attribute.bufferAttribute);
			}

			// Mark the attribute as needing an update the next time a frame is rendered.
			attribute.bufferAttribute.needsUpdate = true;
		}
	}

	// Mark the draw range on the geometry. This will ensure only the values in the attribute buffers that are associated with a particle will be used in render cycle.
	this.geometry.setDrawRange(0, this.particleCount);
};

/**
 * Adds an ParticleEmitterControl instance to this group, creating particle values and assigning them to this group"s shader attributes.
 *
 * @method addEmitter
 * @param {ParticleEmitterControl} emitter The emitter to add to this group.
 */
ParticleGroup.prototype.addEmitter = function(emitter)
{
	// Ensure an actual emitter instance is passed here.
	if (emitter instanceof ParticleEmitterControl === false)
	{
		console.error("nunuStudio: emitter argument must be instance of ParticleEmitterControl.", emitter);
		return;
	}
	// If the emitter already exists as a member of this group, then stop here, we don't want to add it again.
	else if (this.emitterIDs.indexOf(emitter.uuid) > -1)
	{
		console.error("nunuStudio: ParticleEmitterControl already exists in this group.");
		return;
	}
	// And finally, if the emitter is a member of another group, don't add it to this group.
	else if (emitter.group !== null)
	{
		console.error("nunuStudio: ParticleEmitterControl already belongs to another group.");
		return;
	}

	var attributes = this.attributes;
	var start = this.particleCount;
	var end = start + emitter.particleCount;

	// Update this group"s particle count.
	this.particleCount = end;

	// Emit a warning if the emitter being added will exceed the buffer sizes specified.
	if (this.maxParticleCount !== null && this.particleCount > this.maxParticleCount)
	{
		console.warn("nunuStudio: ParticleGroup maxParticleCount exceeded. Requesting", this.particleCount, "particles, can support only", this.maxParticleCount);
	}

	// Set the particlesPerSecond value (PPS) on the emitter. It's used to determine how many particles to release on a per-frame basis.
	emitter._calculatePPSValue(emitter.maxAge._value + emitter.maxAge._spread);
	emitter._setBufferUpdateRanges(this.attributeKeys);

	// Store the offset value in the TypedArray attributes for this emitter.
	emitter._setAttributeOffset(start);

	// Save a reference to this group on the emitter so it knows where it belongs.
	emitter.group = this;

	// Store reference to the attributes on the emitter for easier access during the emitter"s tick function.
	emitter.attributes = this.attributes;

	// Ensure the attributes and their BufferAttributes exist, and their TypedArrays are of the correct size.
	for (var attr in attributes)
	{
		if (attributes.hasOwnProperty(attr))
		{
			// When creating a buffer, pass through the maxParticle count if one is specified.
			attributes[attr]._createBufferAttribute(
				this.maxParticleCount !== null ?
					this.maxParticleCount :
					this.particleCount
		   );
		}
	}

	// Loop through each particle this emitter wants to have, and create the attributes values, storing them in the TypedArrays that each attribute holds.
	for (var i = start; i < end; ++i)
	{
		emitter._assignPositionValue(i);
		emitter._assignForceValue(i, "velocity");
		emitter._assignForceValue(i, "acceleration");
		emitter._assignAbsLifetimeValue(i, "opacity");
		emitter._assignAbsLifetimeValue(i, "size");
		emitter._assignAngleValue(i);
		emitter._assignRotationValue(i);
		emitter._assignParamsValue(i);
		emitter._assignColorValue(i);
	}

	// Update the geometry and make sure the attributes are referencing the typed arrays properly.
	this._applyAttributesToGeometry();

	// Store this emitter in this group"s emitter"s store.
	this.emitters.push(emitter);
	this.emitterIDs.push(emitter.uuid);

	// Update certain flags to enable shader calculations only if they"re necessary.
	this._updateDefines(emitter);

	// Update the material since defines might have changed
	this.material.needsUpdate = true;
	this.geometry.needsUpdate = true;
	this._attributesNeedRefresh = true;

	// Return the group to enable chaining.
	return this;
};

/**
 * Removes an ParticleEmitterControl instance from this group.
 *
 * When called, all particle"s belonging to the given emitter will be instantly removed from the scene.
 *
 * @method removeEmitter
 * @param {ParticleEmitterControl} emitter The emitter to add to this group.
 */
ParticleGroup.prototype.removeEmitter = function(emitter)
{
	var emitterIndex = this.emitterIDs.indexOf(emitter.uuid);

	// Ensure an actual emitter instance is passed here.
	if (emitter instanceof ParticleEmitterControl === false)
	{
		console.error("nunuStudio: emitter argument must be instance of ParticleEmitterControl. Was provided with:", emitter);
		return;
	}

	// Issue an error if the emitter isn't a member of this group.
	else if (emitterIndex === -1)
	{
		console.error("nunuStudio: ParticleEmitterControl does not exist in this group. Will not remove.");
		return;
	}

	// Kill all particles by marking them as dead and their age as 0.
	var start = emitter.attributeOffset;
	var end = start + emitter.particleCount;
	var params = this.attributes.params.typedArray;

	// Set alive and age to zero.
	for (var i = start; i < end; ++i)
	{
		params.array[i * 4] = 0.0;
		params.array[i * 4 + 1] = 0.0;
	}

	// Remove the emitter from this group"s "store".
	this.emitters.splice(emitterIndex, 1);
	this.emitterIDs.splice(emitterIndex, 1);

	// Remove this emitter"s attribute values from all shader attributes.
	// The .splice() call here also marks each attribute"s buffer as needing to update it's entire contents.
	for (var attr in this.attributes)
	{
		if (this.attributes.hasOwnProperty(attr))
		{
			this.attributes[attr].splice(start, end);
		}
	}

	// Ensure this group"s particle count is correct.
	this.particleCount -= emitter.particleCount;

	// Call the emitter"s remove method.
	emitter._onRemove();

	// Set a flag to indicate that the attribute buffers should be updated in their entirety on the next frame.
	this._attributesNeedRefresh = true;
};

/**
 * Fetch a single emitter instance from the pool.
 *
 * If there are no objects in the pool, a new emitter will becreated if specified.
 *
 * @method getFromPool
 * @return {ParticleEmitterControl|null}
 */
ParticleGroup.prototype.getFromPool = function()
{
	var pool = this.pool;
	var createNew = this._createNewWhenPoolEmpty;

	if (pool.length)
	{
		return pool.pop();
	}
	else if (createNew)
	{
		var emitter = new ParticleEmitterControl(this.poolCreationSettings);
		
		this.addEmitter(emitter);
		
		return emitter;
	}

	return null;
};

/**
 * Release an emitter into the pool.
 *
 * @method releaseIntoPool
 * @param {ShaderParticleParticleEmitterControl} emitter
 * @return {ParticleGroup} This group instance.
 */
ParticleGroup.prototype.releaseIntoPool = function(emitter)
{
	if (emitter instanceof ParticleEmitterControl === false)
	{
		console.error("nunuStudio: Argument is not instanceof ParticleEmitterControl:", emitter);
		return;
	}

	emitter.reset();
	this.pool.unshift(emitter);

	return this;
};

/**
 * Get the pool array
 *
 * @method getPool
 * @return {Array}
 */
ParticleGroup.prototype.getPool = function()
{
	return this.pool;
};

/**
 * Add a pool of emitters to this particle group
 *
 * @method addPool
 * @param {number} numEmitters The number of emitters to add to the pool.
 * @param {ParticleEmitterControlOptions|Array} emitterOptions  An object, or array of objects, describing the options to pass to each emitter.
 * @param {boolean} createNew Should a new emitter be created if the pool runs out?
 * @return {ParticleGroup} This group instance.
 */
ParticleGroup.prototype.addPool = function(numEmitters, emitterOptions, createNew)
{
	var emitter;

	// Save relevant settings and flags.
	this.poolCreationSettings = emitterOptions;
	this._createNewWhenPoolEmpty = Boolean(createNew);

	// Create the emitters, add them to this group and the pool.
	for (var i = 0; i < numEmitters; ++i)
	{
		if (Array.isArray(emitterOptions))
		{
			emitter = new ParticleEmitterControl(emitterOptions[i]);
		}
		else
		{
			emitter = new ParticleEmitterControl(emitterOptions);
		}
		this.addEmitter(emitter);
		this.releaseIntoPool(emitter);
	}

	return this;
};

ParticleGroup.prototype._triggerSingleEmitter = function(pos)
{
	var emitter = this.getFromPool();
	var self = this;

	if (emitter === null)
	{
		console.log("nunuStudio: ParticleGroup pool ran out.");
		return;
	}

	if (pos instanceof Vector3)
	{
		emitter.position.value.copy(pos);
		emitter.position.value = emitter.position.value;
	}

	emitter.enable();

	setTimeout(function()
	{
		emitter.disable();
		self.releaseIntoPool(emitter);
	}, Math.max(emitter.duration, emitter.maxAge.value + emitter.maxAge.spread) * 1000);

	return this;
};

/**
 * Set a given number of emitters as alive, with an optional position vector3 to move them to.
 *
 * @method triggerEmitter
 * @param {number} numEmitters The number of emitters to activate
 * @param {Object} [position=undefined] A Vector3 instance describing the position to activate the emitter(s) at.
 * @return {ParticleGroup} This group instance.
 */
ParticleGroup.prototype.triggerEmitter = function(numEmitters, position)
{
	if (typeof numEmitters === "number" && numEmitters > 1)
	{
		for (var i = 0; i < numEmitters; ++i)
		{
			this._triggerSingleEmitter(position);
		}
	}
	else
	{
		this._triggerSingleEmitter(position);
	}

	return this;
};

ParticleGroup.prototype._updateUniforms = function(dt)
{
	this.uniforms.runTime.value += dt;
	this.uniforms.deltaTime.value = dt;
};

ParticleGroup.prototype._resetBufferRanges = function()
{
	var keys = this.attributeKeys;

	for (var i = this.attributeCount - 1; i >= 0; --i)
	{
		this.attributes[keys[i]].resetUpdateRange();
	}
};


ParticleGroup.prototype._updateBuffers = function(emitter)
{
	var keys = this.attributeKeys;
	var attrs = this.attributes;
	var emitterRanges = emitter.bufferUpdateRanges;
	var key;
	var emitterAttr;
	var attr;

	for (var i = this.attributeCount - 1; i >= 0; --i)
	{
		key = keys[i];
		emitterAttr = emitterRanges[key];
		attr = attrs[key];
		attr.setUpdateRange(emitterAttr.min, emitterAttr.max);
		attr.flagUpdate();
	}
};


/**
 * Simulate all the emitter"s belonging to this group, updating attribute values along the way.
 *
 * @method tick
 * @param {number} [dt=ParticleGroup"s fixedTimeStep value] The number of seconds to simulate the group"s emitters for(deltaTime)
 */
ParticleGroup.prototype.tick = function(dt)
{
	var emitters = this.emitters;
	var numEmitters = emitters.length;
	var deltaTime = dt || this.fixedTimeStep;
	var keys = this.attributeKeys;
	var i;
	var attrs = this.attributes;

	// Update uniform values.
	this._updateUniforms(deltaTime);

	// Reset buffer update ranges on the shader attributes.
	this._resetBufferRanges();

	// If nothing needs updating, then stop here.
	if (numEmitters === 0 && this._attributesNeedRefresh === false && this._attributesNeedDynamicReset === false)
	{
		return;
	}

	// Loop through each emitter in this group and simulate it, then update the shader attribute buffers.
	for (var i = 0, emitter; i < numEmitters; ++i)
	{
		emitter = emitters[i];
		emitter.tick(deltaTime);
		this._updateBuffers(emitter);
	}

	// If the shader attributes have been refreshed, then the dynamic properties of each buffer attribute will need to be reset.
	if (this._attributesNeedDynamicReset === true)
	{
		i = this.attributeCount - 1;

		for (i; i >= 0; --i)
		{
			attrs[keys[i]].resetDynamic();
		}

		this._attributesNeedDynamicReset = false;
	}

	if (this._attributesNeedRefresh === true)
	{
		i = this.attributeCount - 1;

		for (i; i >= 0; --i)
		{
			attrs[keys[i]].forceUpdateAll();
		}

		this._attributesNeedRefresh = false;
		this._attributesNeedDynamicReset = true;
	}
};


/**
 * Dipose the geometry and material for the group.
 *
 * @method dispose
 * @return {ParticleGroup} ParticleGroup instance.
 */
ParticleGroup.prototype.dispose = function()
{
	this.geometry.dispose();
	this.material.dispose();
	return this;
};

ParticleGroup.prototype.toJSON = function(meta)
{
	var data = {};

	data.texture = {};
	data.texture.value = this.texture.uuid;
	data.texture.frames = this.textureFrames.toArray();
	data.texture.frameCount = this.textureFrameCount;
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

export {ParticleGroup};
