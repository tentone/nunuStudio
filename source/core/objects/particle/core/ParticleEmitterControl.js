import {ParticleEmitter} from "../ParticleEmitter.js";
import {ShaderUtils} from "./ShaderUtils.js";
import {Key} from "../../../input/Key.js";

import {Vector3, Color, Math} from "three";

/**
 * A map of options to configure an ParticleEmitterControl instance.
 *
 * @class ParticleEmitterControlOptions
 * @property {distribution} [type=BOX] The default distribution this emitter should use to control its particle"s spawn position and force behaviour. Must be an ParticleDistributions.* value.
 * @property {number} [particleCount=100] The total number of particles this emitter will hold. NOTE: this is not the number of particles emitted in a second, or anything like that. The number of particles   emitted per-second is calculated by particleCount / maxAge (approximately!)
 * @property {Number|null} [duration=null] The duration in seconds that this emitter should live for. If not specified, the emitter will emit particles indefinitely. NOTE: When an emitter is older than a specified duration, the emitter is NOT removed from    it's group, but rather is just marked as dead, allowing it to be reanimated at a later time    using ParticleEmitterControl.prototype.enable().
 * @property {boolean} [isStatic=false] Whether this emitter should be not be simulated (true).
 * @property {boolean} [activeMultiplier=1] A value between 0 and 1 describing what percentage of this emitter"s particlesPerSecond should be emitted, where 0 is 0%, and 1 is 100%.     For example, having an emitter with 100 particles, a maxAge of 2, yields a particlesPerSecond     value of 50. Setting activeMultiplier to 0.5, then, will only emit 25 particles per second (0.5 = 50%).     Values greater than 1 will emulate a burst of particles, causing the emitter to run out of particles     before it's next activation cycle.
 * @property {boolean} [direction=1] The direction of the emitter. If value is 1, emitter will start at beginning of particle"s lifecycle. If value is -1, emitter will start at end of particle"s lifecycle and work it's way backwards.
 * @property {Object} [maxAge={}] An object describing the particle"s maximum age in seconds.
 * @property {number} [maxAge.value=2] A number between 0 and 1 describing the amount of maxAge to apply to all particles.
 * @property {number} [maxAge.spread=0] A number describing the maxAge variance on a per-particle basis.
 * @property {Object} [position={}] An object describing this emitter"s position.
 * @property {Object} [position.value=new Vector3()] A Vector3 instance describing this emitter"s base position.
 * @property {Object} [position.spread=new Vector3()] A Vector3 instance describing this emitter"s position variance on a per-particle basis. Note that when using a SPHERE or DISC distribution, only the x-component                of this vector is used.
 * @property {Object} [position.spreadClamp=new Vector3()] A Vector3 instance describing the numeric multiples the particle"s should be spread out over. Note that when using a SPHERE or DISC distribution, only the x-component                   of this vector is used.
 * @property {number} [position.radius=10] This emitter"s base radius.
 * @property {Object} [position.radiusScale=new Vector3()] A Vector3 instance describing the radius"s scale in all three axes. Allows a SPHERE or DISC to be squashed or stretched.
 * @property {distribution} [position.distribution=value of the type option.] A specific distribution to use when radiusing particles. Overrides the type option.
 * @property {boolean} [position.randomise=false] When a particle is re-spawned, whether it's position should be re-randomised or not. Can incur a performance hit.
 * @property {Object} [velocity={}] An object describing this particle velocity.
 * @property {Object} [velocity.value=new Vector3()] A Vector3 instance describing this emitter"s base velocity.
 * @property {Object} [velocity.spread=new Vector3()] A Vector3 instance describing this emitter"s velocity variance on a per-particle basis. Note that when using a SPHERE or DISC distribution, only the x-component                of this vector is used.
 * @property {distribution} [velocity.distribution=value of the type option.] A specific distribution to use when calculating a particle"s velocity. Overrides the type option.
 * @property {boolean} [velocity.randomise=false] When a particle is re-spawned, whether it's velocity should be re-randomised or not. Can incur a performance hit.
 * @property {Object} [acceleration={}] An object describing this particle"s acceleration.
 * @property {Object} [acceleration.value=new Vector3()] A Vector3 instance describing this emitter"s base acceleration.
 * @property {Object} [acceleration.spread=new Vector3()] A Vector3 instance describing this emitter"s acceleration variance on a per-particle basis.               Note that when using a SPHERE or DISC distribution, only the x-component               of this vector is used.
 * @property {distribution} [acceleration.distribution=value of the type option.] A specific distribution to use when calculating a particle"s acceleration. Overrides the type option.
 * @property {boolean} [acceleration.randomise=false] When a particle is re-spawned, whether it's acceleration should be re-randomised or not. Can incur a performance hit.
 * @property {Object} [drag={}] An object describing this particle drag. Drag is applied to both velocity and acceleration values.
 * @property {number} [drag.value=0] A number between 0 and 1 describing the amount of drag to apply to all particles.
 * @property {number} [drag.spread=0] A number describing the drag variance on a per-particle basis.
 * @property {boolean} [drag.randomise=false] When a particle is re-spawned, whether it's drag should be re-randomised or not. Can incur a performance hit.
 * @property {Object} [wiggle={}] This is quite a fun one! The values of this object will determine whether a particle will wiggle, or jiggle, or wave,  or shimmy, or waggle, or... Well you get the idea. The wiggle is calculated over-time, meaning that a particle will  start off with no wiggle, and end up wiggling about with the distance of the value specified by the time it dies.  It's quite handy to simulate fire embers, or similar effects where the particle"s position should slightly change over  time, and such change isn't easily controlled by rotation, velocity, or acceleration. The wiggle is a combination of sin and cos calculations, so is circular in nature.
 * @property {number} [wiggle.value=0] A number describing the amount of wiggle to apply to all particles. It's measured in distance.
 * @property {number} [wiggle.spread=0] A number describing the wiggle variance on a per-particle basis.
 * @property {Object} [rotation={}] An object describing this emitter"s rotation. It can either be static, or set to rotate from 0radians to the value of rotation.value   over a particle"s lifetime. Rotation values affect both a particle"s position and the forces applied to it.
 * @property {Object} [rotation.axis=new Vector3(0, 1, 0)] A Vector3 instance describing this emitter"s axis of rotation.
 * @property {Object} [rotation.axisSpread=new Vector3()] A Vector3 instance describing the amount of variance to apply to the axis of rotation on                  a per-particle basis.
 * @property {number} [rotation.angle=0] The angle of rotation, given in radians. If rotation.static is true, the emitter will start off rotated at this angle, and stay as such.   Otherwise, the particles will rotate from 0radians to this value over their lifetimes.
 * @property {number} [rotation.angleSpread=0] The amount of variance in each particle"s rotation angle.
 * @property {boolean} [rotation.static=false] Whether the rotation should be static or not.
 * @property {Object} [rotation.center=The value of position.value] A Vector3 instance describing the center point of rotation.
 * @property {boolean} [rotation.randomise=false] When a particle is re-spawned, whether it's rotation should be re-randomised or not. Can incur a performance hit.
 * @property {Object} [color={}] An object describing a particle"s color. This property is a "value-over-lifetime" property, meaning an array of values and spreads can be given to describe specific value changes over a particle"s lifetime. Depending on the value of valueOverLifetimeLength, if arrays of Color instances are given, then the array will be interpolated to have a length matching the value of valueOverLifetimeLength.
 * @property {Object} [color.value=new Color()] Either a single Color instance, or an array of Color instances to describe the color of a particle over it's lifetime.
 * @property {Object} [color.spread=new Vector3()] Either a single Vector3 instance, or an array of Vector3 instances to describe the color variance of a particle over it's lifetime.
 * @property {boolean} [color.randomise=false] When a particle is re-spawned, whether it's color should be re-randomised or not. Can incur a performance hit.
 * @property {Object} [opacity={}] An object describing a particle"s opacity. This property is a "value-over-lifetime" property, meaning an array of values and spreads can be given to describe specific value changes over a particle"s lifetime. Depending on the value of valueOverLifetimeLength, if arrays of numbers are given, then the array will be interpolated to have a length matching the value of valueOverLifetimeLength.
 * @property {number} [opacity.value=1] Either a single number, or an array of numbers to describe the opacity of a particle over it's lifetime.
 * @property {number} [opacity.spread=0] Either a single number, or an array of numbers to describe the opacity variance of a particle over it's lifetime.
 * @property {boolean} [opacity.randomise=false] When a particle is re-spawned, whether it's opacity should be re-randomised or not. Can incur a performance hit.
 * @property {Object} [size={}] An object describing a particle"s size. This property is a "value-over-lifetime" property, meaning an array of values and spreads can be given to describe specific value changes over a particle"s lifetime. Depending on the value of valueOverLifetimeLength, if arrays of numbers are given, then the array will be interpolated to have a length matching the value of valueOverLifetimeLength.
 * @property {number} [size.value=1] Either a single number, or an array of numbers to describe the size of a particle over it's lifetime.
 * @property {number} [size.spread=0] Either a single number, or an array of numbers to describe the size variance of a particle over it's lifetime.
 * @property {boolean} [size.randomise=false] When a particle is re-spawned, whether it's size should be re-randomised or not. Can incur a performance hit.
 * @property {Object} [angle={}] An object describing a particle"s angle. The angle is a 2d-rotation, measured in radians, applied to the particle"s texture. NOTE: if a particle"s texture is a sprite-sheet, this value IS IGNORED. This property is a "value-over-lifetime" property, meaning an array of values and spreads can be given to describe specific value changes over a particle"s lifetime. Depending on the value of valueOverLifetimeLength, if arrays of numbers are given, then the array will be interpolated to have a length matching the value of valueOverLifetimeLength.
 * @property {number} [angle.value=0] Either a single number, or an array of numbers to describe the angle of a particle over it's lifetime.
 * @property {number} [angle.spread=0] Either a single number, or an array of numbers to describe the angle variance of a particle over it's lifetime.
 * @property {boolean} [angle.randomise=false] When a particle is re-spawned, whether it's angle should be re-randomised or not. Can incur a performance hit.
 */

/**
 * The ParticleEmitterControl class.
 *
 * @constructor
 * @author Luke Moody
 * @class ParticleEmitterControl
 * @param {ParticleEmitterControlOptions} options A map of options to configure the emitter.
 */
function ParticleEmitterControl(options)
{
	// Ensure we have a map of options to play with, and that each option is in the correct format.
	options = ShaderUtils.ensureTypedArg(options, ShaderUtils.types.OBJECT, {});
	options.position = ShaderUtils.ensureTypedArg(options.position, ShaderUtils.types.OBJECT, {});
	options.velocity = ShaderUtils.ensureTypedArg(options.velocity, ShaderUtils.types.OBJECT, {});
	options.acceleration = ShaderUtils.ensureTypedArg(options.acceleration, ShaderUtils.types.OBJECT, {});
	options.radius = ShaderUtils.ensureTypedArg(options.radius, ShaderUtils.types.OBJECT, {});
	options.drag = ShaderUtils.ensureTypedArg(options.drag, ShaderUtils.types.OBJECT, {});
	options.rotation = ShaderUtils.ensureTypedArg(options.rotation, ShaderUtils.types.OBJECT, {});
	options.color = ShaderUtils.ensureTypedArg(options.color, ShaderUtils.types.OBJECT, {});
	options.opacity = ShaderUtils.ensureTypedArg(options.opacity, ShaderUtils.types.OBJECT, {});
	options.size = ShaderUtils.ensureTypedArg(options.size, ShaderUtils.types.OBJECT, {});
	options.angle = ShaderUtils.ensureTypedArg(options.angle, ShaderUtils.types.OBJECT, {});
	options.wiggle = ShaderUtils.ensureTypedArg(options.wiggle, ShaderUtils.types.OBJECT, {});
	options.maxAge = ShaderUtils.ensureTypedArg(options.maxAge, ShaderUtils.types.OBJECT, {});

	if(options.onParticleSpawn)
	{
		console.warn("nunuStudio: onParticleSpawn has been removed. Please set properties directly to alter values at runtime.");
	}

	this.uuid = Math.generateUUID();

	this.type = ShaderUtils.ensureTypedArg(options.type, ShaderUtils.types.NUMBER, ParticleDistributions.BOX);

	this.position =
	{
		_value: ShaderUtils.ensureInstanceOf(options.position.value, Vector3, new Vector3()),
		_spread: ShaderUtils.ensureInstanceOf(options.position.spread, Vector3, new Vector3()),
		_spreadClamp: ShaderUtils.ensureInstanceOf(options.position.spreadClamp, Vector3, new Vector3()),
		_distribution: ShaderUtils.ensureTypedArg(options.position.distribution, ShaderUtils.types.NUMBER, this.type),
		_randomise: ShaderUtils.ensureTypedArg(options.position.randomise, ShaderUtils.types.BOOLEAN, false),
		_radius: ShaderUtils.ensureTypedArg(options.position.radius, ShaderUtils.types.NUMBER, 10),
		_radiusScale: ShaderUtils.ensureInstanceOf(options.position.radiusScale, Vector3, new Vector3(1, 1, 1)),
		_distributionClamp: ShaderUtils.ensureTypedArg(options.position.distributionClamp, ShaderUtils.types.NUMBER, 0),
	};

	this.velocity =
	{
		_value: ShaderUtils.ensureInstanceOf(options.velocity.value, Vector3, new Vector3()),
		_spread: ShaderUtils.ensureInstanceOf(options.velocity.spread, Vector3, new Vector3()),
		_distribution: ShaderUtils.ensureTypedArg(options.velocity.distribution, ShaderUtils.types.NUMBER, this.type),
		_randomise: ShaderUtils.ensureTypedArg(options.position.randomise, ShaderUtils.types.BOOLEAN, false)
	};

	this.acceleration =
	{
		_value: ShaderUtils.ensureInstanceOf(options.acceleration.value, Vector3, new Vector3()),
		_spread: ShaderUtils.ensureInstanceOf(options.acceleration.spread, Vector3, new Vector3()),
		_distribution: ShaderUtils.ensureTypedArg(options.acceleration.distribution, ShaderUtils.types.NUMBER, this.type),
		_randomise: ShaderUtils.ensureTypedArg(options.position.randomise, ShaderUtils.types.BOOLEAN, false)
	};

	this.drag =
	{
		_value: ShaderUtils.ensureTypedArg(options.drag.value, ShaderUtils.types.NUMBER, 0),
		_spread: ShaderUtils.ensureTypedArg(options.drag.spread, ShaderUtils.types.NUMBER, 0),
		_randomise: ShaderUtils.ensureTypedArg(options.position.randomise, ShaderUtils.types.BOOLEAN, false)
	};

	this.wiggle =
	{
		_value: ShaderUtils.ensureTypedArg(options.wiggle.value, ShaderUtils.types.NUMBER, 0),
		_spread: ShaderUtils.ensureTypedArg(options.wiggle.spread, ShaderUtils.types.NUMBER, 0)
	};

	this.rotation =
	{
		_axis: ShaderUtils.ensureInstanceOf(options.rotation.axis, Vector3, new Vector3(0.0, 1.0, 0.0)),
		_axisSpread: ShaderUtils.ensureInstanceOf(options.rotation.axisSpread, Vector3, new Vector3()),
		_angle: ShaderUtils.ensureTypedArg(options.rotation.angle, ShaderUtils.types.NUMBER, 0),
		_angleSpread: ShaderUtils.ensureTypedArg(options.rotation.angleSpread, ShaderUtils.types.NUMBER, 0),
		_static: ShaderUtils.ensureTypedArg(options.rotation.static, ShaderUtils.types.BOOLEAN, false),
		_center: ShaderUtils.ensureInstanceOf(options.rotation.center, Vector3, this.position._value.clone()),
		_randomise: ShaderUtils.ensureTypedArg(options.position.randomise, ShaderUtils.types.BOOLEAN, false)
	};

	this.maxAge =
	{
		_value: ShaderUtils.ensureTypedArg(options.maxAge.value, ShaderUtils.types.NUMBER, 2),
		_spread: ShaderUtils.ensureTypedArg(options.maxAge.spread, ShaderUtils.types.NUMBER, 0)
	};

	// The following properties can support either single values, or an array of values that change the property over a particle"s lifetime (value over lifetime).
	this.color =
	{
		_value: ShaderUtils.ensureArrayInstanceOf(options.color.value, Color, new Color()),
		_spread: ShaderUtils.ensureArrayInstanceOf(options.color.spread, Vector3, new Vector3()),
		_randomise: ShaderUtils.ensureTypedArg(options.position.randomise, ShaderUtils.types.BOOLEAN, false)
	};

	this.opacity =
	{
		_value: ShaderUtils.ensureArrayTypedArg(options.opacity.value, ShaderUtils.types.NUMBER, 1),
		_spread: ShaderUtils.ensureArrayTypedArg(options.opacity.spread, ShaderUtils.types.NUMBER, 0),
		_randomise: ShaderUtils.ensureTypedArg(options.position.randomise, ShaderUtils.types.BOOLEAN, false)
	};

	this.size =
	{
		_value: ShaderUtils.ensureArrayTypedArg(options.size.value, ShaderUtils.types.NUMBER, 1),
		_spread: ShaderUtils.ensureArrayTypedArg(options.size.spread, ShaderUtils.types.NUMBER, 0),
		_randomise: ShaderUtils.ensureTypedArg(options.position.randomise, ShaderUtils.types.BOOLEAN, false)
	};

	this.angle =
	{
		_value: ShaderUtils.ensureArrayTypedArg(options.angle.value, ShaderUtils.types.NUMBER, 0),
		_spread: ShaderUtils.ensureArrayTypedArg(options.angle.spread, ShaderUtils.types.NUMBER, 0),
		_randomise: ShaderUtils.ensureTypedArg(options.position.randomise, ShaderUtils.types.BOOLEAN, false)
	};

	// Assign renaining option values.
	this.particleCount = ShaderUtils.ensureTypedArg(options.particleCount, ShaderUtils.types.NUMBER, 100);
	this.duration = ShaderUtils.ensureTypedArg(options.duration, ShaderUtils.types.NUMBER, null);
	this.isStatic = ShaderUtils.ensureTypedArg(options.isStatic, ShaderUtils.types.BOOLEAN, false);
	this.activeMultiplier = ShaderUtils.ensureTypedArg(options.activeMultiplier, ShaderUtils.types.NUMBER, 1);
	this.direction = ShaderUtils.ensureTypedArg(options.direction, ShaderUtils.types.NUMBER, 1);

	// Whether this emitter is alive or not.
	this.alive = ShaderUtils.ensureTypedArg(options.alive, ShaderUtils.types.BOOLEAN, true);

	// The following properties are set internally and are not user-controllable.
	this.particlesPerSecond = 0;

	// The current particle index for which particles should be marked as active on the next update cycle.
	this.activationIndex = 0;

	// The offset in the typed arrays this emitter"s particle"s values will start at
	this.attributeOffset = 0;

	// The end of the range in the attribute buffers
	this.attributeEnd = 0;

	// Holds the time the emitter has been alive for.
	this.age = 0.0;

	// Holds the number of currently-alive particles
	this.activeParticleCount = 0.0;

	// Holds a reference to this emitter"s group once
	// it's added to one.
	this.group = null;

	// Holds a reference to this emitter"s group"s attributes object
	// for easier access.
	this.attributes = null;

	// Holds a reference to the params attribute"s typed array
	// for quicker access.
	this.paramsArray = null;

	// A set of flags to determine whether particular properties should be re-randomised when a particle is reset.
	//
	// If a randomise property is given, this is preferred. Otherwise, it looks at whether a spread value has been given.
	//
	// It allows randomization to be turned off as desired. If all randomization is turned off, then I'd expect a performance boost as no attribute buffers (excluding the params) would have to be re-passed to the GPU each frame (since nothing except the params attribute would have changed).
	this.resetFlags =
	{
		position: ShaderUtils.ensureTypedArg(options.position.randomise, ShaderUtils.types.BOOLEAN, false) || ShaderUtils.ensureTypedArg(options.radius.randomise, ShaderUtils.types.BOOLEAN, false),
		velocity: ShaderUtils.ensureTypedArg(options.velocity.randomise, ShaderUtils.types.BOOLEAN, false),
		acceleration: ShaderUtils.ensureTypedArg(options.acceleration.randomise, ShaderUtils.types.BOOLEAN, false) || ShaderUtils.ensureTypedArg(options.drag.randomise, ShaderUtils.types.BOOLEAN, false),
		rotation: ShaderUtils.ensureTypedArg(options.rotation.randomise, ShaderUtils.types.BOOLEAN, false),
		rotationCenter: ShaderUtils.ensureTypedArg(options.rotation.randomise, ShaderUtils.types.BOOLEAN, false),
		size: ShaderUtils.ensureTypedArg(options.size.randomise, ShaderUtils.types.BOOLEAN, false),
		color: ShaderUtils.ensureTypedArg(options.color.randomise, ShaderUtils.types.BOOLEAN, false),
		opacity: ShaderUtils.ensureTypedArg(options.opacity.randomise, ShaderUtils.types.BOOLEAN, false),
		angle: ShaderUtils.ensureTypedArg(options.angle.randomise, ShaderUtils.types.BOOLEAN, false)
	};

	this.updateFlags = {};
	this.updateCounts = {};

	// A map to indicate which emitter parameters should update which attribute.
	this.updateMap =
	{
		maxAge: "params",
		position: "position",
		velocity: "velocity",
		acceleration: "acceleration",
		drag: "acceleration",
		wiggle: "params",
		rotation: "rotation",
		size: "size",
		color: "color",
		opacity: "opacity",
		angle: "angle"
	};

	for(var i in this.updateMap)
	{
		if(this.updateMap.hasOwnProperty(i))
		{
		  this.updateCounts[this.updateMap[i]] = 0.0;
		  this.updateFlags[this.updateMap[i]] = false;
		  this._createGetterSetters(this[i], i);
		}
	}

	this.bufferUpdateRanges = {};
	this.attributeKeys = null;
	this.attributeCount = 0;


	// Ensure that the value-over-lifetime property objects above have value and spread properties that are of the same length.
	//
	// Also, for now, make sure they have a length of 3 (min/max arguments here).
	ShaderUtils.ensureValueOverLifetimeCompliance(this.color, ParticleEmitter.valueOverLifetimeLength, ParticleEmitter.valueOverLifetimeLength);
	ShaderUtils.ensureValueOverLifetimeCompliance(this.opacity, ParticleEmitter.valueOverLifetimeLength, ParticleEmitter.valueOverLifetimeLength);
	ShaderUtils.ensureValueOverLifetimeCompliance(this.size, ParticleEmitter.valueOverLifetimeLength, ParticleEmitter.valueOverLifetimeLength);
	ShaderUtils.ensureValueOverLifetimeCompliance(this.angle, ParticleEmitter.valueOverLifetimeLength, ParticleEmitter.valueOverLifetimeLength);
}

ParticleEmitterControl.constructor = ParticleEmitterControl;

ParticleEmitterControl.prototype._createGetterSetters = function(propObj, propName)
{
	var self = this;

	for(var i in propObj)
	{
		if(propObj.hasOwnProperty(i))
		{
		  var name = i.replace("_", "");

		  Object.defineProperty(propObj, name,
		  {
			  get: (function(prop)
			  {
				return function()
				{
					return this[prop];
				};
			  }(i)),

			  set: (function(prop)
			  {
				  return function(value)
				  {
					 var mapName = self.updateMap[propName],
						 prevValue = this[prop],
						 length = ParticleEmitter.valueOverLifetimeLength;

					 if(prop === "_rotationCenter")
					 {
						self.updateFlags.rotationCenter = true;
						self.updateCounts.rotationCenter = 0.0;
					 }
					 else if(prop === "_randomise")
					 {
						self.resetFlags[mapName] = value;
					 }
					 else
					 {
						self.updateFlags[mapName] = true;
						self.updateCounts[mapName] = 0.0;
					 }

					 self.group._updateDefines();

					 this[prop] = value;

					 // If the previous value was an array, then make sure the provided value is interpolated correctly.
					 if(Array.isArray(prevValue))
					 {
						 ShaderUtils.ensureValueOverLifetimeCompliance(self[propName], length, length);
					 }
				  };
			  }(i))
		  });
		}
	}
};

ParticleEmitterControl.prototype._setBufferUpdateRanges = function(keys)
{
	this.attributeKeys = keys;
	this.attributeCount = keys.length;

	for(var i = this.attributeCount - 1; i >= 0; --i)
	{
		this.bufferUpdateRanges[keys[i]] =
		{
		  min: Number.POSITIVE_INFINITY,
		  max: Number.NEGATIVE_INFINITY
		};
	}
};

ParticleEmitterControl.prototype._calculatePPSValue = function(groupMaxAge)
{
	var particleCount = this.particleCount;

	// Calculate the particlesPerSecond value for this emitter.
	// It's used when determining which particles should die and which should live.
	if(this.duration)
	{
		this.particlesPerSecond = particleCount / (groupMaxAge < this.duration ? groupMaxAge : this.duration);
	}
	else
	{
		this.particlesPerSecond = particleCount / groupMaxAge;
	}
};

ParticleEmitterControl.prototype._setAttributeOffset = function(startIndex)
{
	this.attributeOffset = startIndex;
	this.activationIndex = startIndex;
	this.activationEnd = startIndex + this.particleCount;
};


ParticleEmitterControl.prototype._assignValue = function(prop, index)
{
	switch (prop)
	{
		case "position":
			this._assignPositionValue(index);
			break;

		case "velocity":
		case "acceleration":
			this._assignForceValue(index, prop);
			break;

		case "size":
		case "opacity":
			this._assignAbsLifetimeValue(index, prop);
			break;

		case "angle":
			this._assignAngleValue(index);
			break;

		case "params":
			this._assignParamsValue(index);
			break;

		case "rotation":
			this._assignRotationValue(index);
			break;

		case "color":
			this._assignColorValue(index);
			break;
	}
};

ParticleEmitterControl.prototype._assignPositionValue = function(index)
{
	var utils = utils;
	var prop = this.position;
	var attr = this.attributes.position;
	var value = prop._value;
	var spread = prop._spread;
	var distribution = prop._distribution;

	switch (distribution)
	{
		case ParticleDistributions.BOX:
			ShaderUtils.randomVector3(attr, index, value, spread, prop._spreadClamp);
			break;
		case ParticleDistributions.SPHERE:
			ShaderUtils.randomVector3OnSphere(attr, index, value, prop._radius, prop._spread.x, prop._radiusScale, prop._spreadClamp.x, prop._distributionClamp || this.particleCount);
			break;
		case ParticleDistributions.DISC:
			ShaderUtils.randomVector3OnDisc(attr, index, value, prop._radius, prop._spread.x, prop._radiusScale, prop._spreadClamp.x);
			break;
	}
};

ParticleEmitterControl.prototype._assignForceValue = function(index, attrName)
{
	var utils = utils;
	var prop = this[attrName];
	var value = prop._value;
	var spread = prop._spread;
	var distribution = prop._distribution;
	var pos;
	var positionX;
	var positionY;
	var positionZ;
	var i;

	switch (distribution)
	{
		case ParticleDistributions.BOX:
			ShaderUtils.randomVector3(this.attributes[attrName], index, value, spread);
			break;

		case ParticleDistributions.SPHERE:
			pos = this.attributes.position.typedArray.array;
			i = index * 3;

			// Ensure position values aren't zero, otherwise no force will be applied.
			positionX = pos[i];
			positionY = pos[i + 1];
			positionZ = pos[i + 2];

			ShaderUtils.randomDirectionVector3OnSphere(
				this.attributes[attrName], index,
				positionX, positionY, positionZ,
				this.position._value,
				prop._value.x,
				prop._spread.x
			);
			break;

		case ParticleDistributions.DISC:
			pos = this.attributes.position.typedArray.array;
			i = index * 3;

			// Ensure position values aren't zero, otherwise no force will be applied.
			positionX = pos[i];
			positionY = pos[i + 1];
			positionZ = pos[i + 2];

			ShaderUtils.randomDirectionVector3OnDisc(
				this.attributes[attrName], index,
				positionX, positionY, positionZ,
				this.position._value,
				prop._value.x,
				prop._spread.x
			);
			break;
	}

	if(attrName === "acceleration")
	{
		var drag = ShaderUtils.clamp(ShaderUtils.randomFloat(this.drag._value, this.drag._spread), 0, 1);
		this.attributes.acceleration.typedArray.array[index * 4 + 3] = drag;
	}
};

ParticleEmitterControl.prototype._assignAbsLifetimeValue = function(index, propName)
{
	var array = this.attributes[propName].typedArray;
	var prop = this[propName];
	var utils = utils;
	var value;

	if(ShaderUtils.arrayValuesAreEqual(prop._value) && ShaderUtils.arrayValuesAreEqual(prop._spread))
	{
		value = Math.abs(ShaderUtils.randomFloat(prop._value[0], prop._spread[0]));
		array.setVec4Components(index, value, value, value, value);
	}
	else
	{
		array.setVec4Components(index,
		  Math.abs(ShaderUtils.randomFloat(prop._value[0], prop._spread[0])),
		  Math.abs(ShaderUtils.randomFloat(prop._value[1], prop._spread[1])),
		  Math.abs(ShaderUtils.randomFloat(prop._value[2], prop._spread[2])),
		  Math.abs(ShaderUtils.randomFloat(prop._value[3], prop._spread[3]))
	  );
	}
};

ParticleEmitterControl.prototype._assignAngleValue = function(index)
{
	var array = this.attributes.angle.typedArray;
	var prop = this.angle;
	var utils = utils;
	var value;

	if(ShaderUtils.arrayValuesAreEqual(prop._value) && ShaderUtils.arrayValuesAreEqual(prop._spread))
	{
		value = ShaderUtils.randomFloat(prop._value[0], prop._spread[0]);
		array.setVec4Components(index, value, value, value, value);
	}
	else
	{
		array.setVec4Components(index,
		  ShaderUtils.randomFloat(prop._value[0], prop._spread[0]),
		  ShaderUtils.randomFloat(prop._value[1], prop._spread[1]),
		  ShaderUtils.randomFloat(prop._value[2], prop._spread[2]),
		  ShaderUtils.randomFloat(prop._value[3], prop._spread[3])
	  );
	}
};

ParticleEmitterControl.prototype._assignParamsValue = function(index)
{
	this.attributes.params.typedArray.setVec4Components(index,
		this.isStatic ? 1 : 0,
		0.0,
		Math.abs(ShaderUtils.randomFloat(this.maxAge._value, this.maxAge._spread)),
		ShaderUtils.randomFloat(this.wiggle._value, this.wiggle._spread)
	);
};

ParticleEmitterControl.prototype._assignRotationValue = function(index)
{
	this.attributes.rotation.typedArray.setVec3Components(index,
		ShaderUtils.getPackedRotationAxis(this.rotation._axis, this.rotation._axisSpread),
		ShaderUtils.randomFloat(this.rotation._angle, this.rotation._angleSpread),
		this.rotation._static ? 0 : 1
	);

	this.attributes.rotationCenter.typedArray.setVec3(index, this.rotation._center);
};

ParticleEmitterControl.prototype._assignColorValue = function(index)
{
	ShaderUtils.randomColorAsHex(this.attributes.color, index, this.color._value, this.color._spread);
};

ParticleEmitterControl.prototype._resetParticle = function(index)
{
	var resetFlags = this.resetFlags;
	var updateFlags = this.updateFlags;
	var updateCounts = this.updateCounts;
	var keys = this.attributeKeys;
	var key;
	var updateFlag;

	for(var i = this.attributeCount - 1; i >= 0; --i)
	{
		key = keys[i];
		updateFlag = updateFlags[key];

		if(resetFlags[key] === true || updateFlag === true)
		{
		  this._assignValue(key, index);
		  this._updateAttributeUpdateRange(key, index);

		  if(updateFlag === true && updateCounts[key] === this.particleCount)
		  {
			  updateFlags[key] = false;
			  updateCounts[key] = 0.0;
		  }
		  else if(updateFlag == true)
		  {
			  ++updateCounts[key];
		  }
		}
	}
};

ParticleEmitterControl.prototype._updateAttributeUpdateRange = function(attr, i) {
	var ranges = this.bufferUpdateRanges[attr];

	ranges.min = Math.min(i, ranges.min);
	ranges.max = Math.max(i, ranges.max);
};

ParticleEmitterControl.prototype._resetBufferRanges = function()
{
	var ranges = this.bufferUpdateRanges;
	var keys = this.bufferUpdateKeys;

	for(var i = this.bufferUpdateCount - 1; i >= 0; --i)
	{
		var key = keys[i];
		ranges[key].min = Number.POSITIVE_INFINITY;
		ranges[key].max = Number.NEGATIVE_INFINITY;
	}
};

ParticleEmitterControl.prototype._onRemove = function()
{
	// Reset any properties of the emitter that were set by a group when it was added.
	this.particlesPerSecond = 0;
	this.attributeOffset = 0;
	this.activationIndex = 0;
	this.activeParticleCount = 0;
	this.group = null;
	this.attributes = null;
	this.paramsArray = null;
	this.age = 0.0;
};

ParticleEmitterControl.prototype._decrementParticleCount = function()
{
	--this.activeParticleCount;
};

ParticleEmitterControl.prototype._incrementParticleCount = function()
{
	++this.activeParticleCount;
};

ParticleEmitterControl.prototype._checkParticleAges = function(start, end, params, dt)
{
	for(var i = end - 1, index, maxAge, age, alive; i >= start; --i)
	{
		index = i * 4;
		alive = params[index];

		if(alive === 0.0)
		{
		  continue;
		}

		// Increment age
		age = params[index + 1];
		maxAge = params[index + 2];

		if(this.direction === 1)
		{
			age += dt;

			if(age >= maxAge)
			{
				age = 0.0;
				alive = 0.0;
				this._decrementParticleCount();
			}
		}
		else
		{
			age -= dt;

			if(age <= 0.0)
			{
				age = maxAge;
				alive = 0.0;
				this._decrementParticleCount();
			}
		}

		params[index] = alive;
		params[index + 1] = age;

		this._updateAttributeUpdateRange("params", i);
	}
};

ParticleEmitterControl.prototype._activateParticles = function(activationStart, activationEnd, params, dtPerParticle)
{
	var direction = this.direction;

	for(var i = activationStart, index, dtValue; i < activationEnd; ++i) {
		index = i * 4;

		// Don't re-activate particles that aren't dead yet.
		if(params[index] != 0.0 && this.particleCount !== 1) {
		  continue;
		}

		// Increment the active particle count.
		this._incrementParticleCount();

		// Mark the particle as alive.
		params[index] = 1.0;

		// Reset the particle
		this._resetParticle(i);

		// Move each particle being activated to its actual position in time.
		//
		// This stops particles being "clumped" together when frame rates are on the lower side of 60fps or not constant (a very real possibility!)
		dtValue = dtPerParticle * (i - activationStart)
		params[index + 1] = direction === -1 ? params[index + 2] - dtValue : dtValue;

		this._updateAttributeUpdateRange("params", i);
	}
};

/**
 * Simulates one frame worth of particles, updating particles that are already alive, and marking ones that are currently dead but should be alive as alive.
 *
 * If the emitter is marked as static, then this function will do nothing.
 *
 * @method tick
 * @param {number} dt The number of seconds to simulate (deltaTime)
 */
ParticleEmitterControl.prototype.tick = function(dt)
{
	if(this.isStatic)
	{
		return;
	}

	if(this.paramsArray === null)
	{
		this.paramsArray = this.attributes.params.typedArray.array;
	}

	var start = this.attributeOffset,
		end = start + this.particleCount,
		params = this.paramsArray, // vec3(alive, age, maxAge, wiggle)
		ppsDt = this.particlesPerSecond * this.activeMultiplier * dt,
		activationIndex = this.activationIndex;

	// Reset the buffer update indices.
	this._resetBufferRanges();

	// Increment age for those particles that are alive, and kill off any particles whose age is over the limit.
	this._checkParticleAges(start, end, params, dt);

	// If the emitter is dead, reset the age of the emitter to zero, ready to go again if required
	if(this.alive === false)
	{
		this.age = 0.0;
		return;
	}

	// If the emitter has a specified lifetime and we"ve exceeded it, mark the emitter as dead.
	if(this.duration !== null && this.age > this.duration)
	{
		this.alive = false;
		this.age = 0.0;
		return;
	}


	var activationStart = this.particleCount === 1 ? activationIndex : (activationIndex | 0),
		activationEnd = Math.min(activationStart + ppsDt, this.activationEnd),
		activationCount = activationEnd - this.activationIndex | 0,
		dtPerParticle = activationCount > 0 ? dt / activationCount : 0;

	this._activateParticles(activationStart, activationEnd, params, dtPerParticle);

	// Move the activation window forward, soldier.
	this.activationIndex += ppsDt;

	if(this.activationIndex > end)
	{
		this.activationIndex = start;
	}

	// Increment the age of the emitter.
	this.age += dt;
};

/**
 * Resets all the emitter"s particles to their start positions and marks the particles as dead if the force argument is true.
 *
 * @method reset
 * @param {boolean} [force=undefined] If true, all particles will be marked as dead instantly.
 * @return {ParticleEmitterControl} This emitter instance.
 */
ParticleEmitterControl.prototype.reset = function(force)
{
	this.age = 0.0;
	this.alive = false;

	if(force === true)
	{
		var start = this.attributeOffset,
		  end = start + this.particleCount,
		  array = this.paramsArray,
		  attr = this.attributes.params.bufferAttribute;

		for(var i = end - 1, index; i >= start; --i)
		{
		  index = i * 4;

		  array[index] = 0.0;
		  array[index + 1] = 0.0;
		}

		attr.updateRange.offset = 0;
		attr.updateRange.count = -1;
		attr.needsUpdate = true;
	}

	return this;
};

/**
 * Enables the emitter. If not already enabled, the emitter will start emitting particles.
 *
 * @method enable
 * @return {ParticleEmitterControl} This emitter instance.
 */
ParticleEmitterControl.prototype.enable = function()
{
	this.alive = true;
	return this;
};

/**
 * Disables th emitter, but does not instantly remove it's particles fromt the scene. When called, the emitter will be "switched off" and just stop emitting.
 *
 * Any particle"s alive will be allowed to finish their lifecycle.
 *
 * @method disable
 * @return {ParticleEmitterControl} This emitter instance.
 */
ParticleEmitterControl.prototype.disable = function()
{
	this.alive = false;
	return this;
};

/**
 * Remove this emitter from it's parent group (if it has been added to one).
 *
 * Delgates to group.prototype.removeEmitter().
 *
 * When called, all particle"s belonging to this emitter will be instantly removed from the scene.
 *
 * @method remove
 * @return {ParticleEmitterControl} This emitter instance.
 */
ParticleEmitterControl.prototype.remove = function()
{
	if(this.group !== null)
	{
		this.group.removeEmitter(this);
	}
	else
	{
		console.error("nunuStudio: ParticleEmitterControl does not belong to a group, cannot remove.");
	}

	return this;
};

ParticleEmitterControl.prototype.toJSON = function(meta)
{
	var data = {};

	data.uuid = this.uuid;
	data.type = this.type;
	data.direction = this.direction;
	data.particleCount = this.particleCount;
	data.duration = this.duration;
	data.isStatic = this.isStatic;

	// Max age
	data.maxAge = {};
	data.maxAge.value = this.maxAge.value;
	data.maxAge.spread = this.maxAge.spread;

	// Position
	data.position = {};
	data.position.value = this.position.value.toArray();
	data.position.spread = this.position.spread.toArray();
	data.position.radius = this.position.radius;
	data.position.radiusScale = this.position.radiusScale.toArray();

	// Velocity
	data.velocity = {};
	data.velocity.value = this.velocity.value.toArray();
	data.velocity.spread = this.velocity.spread.toArray();

	// Acceleration
	data.acceleration = {};
	data.acceleration.value = this.acceleration.value.toArray();
	data.acceleration.spread = this.acceleration.spread.toArray();

	// Wiggle
	data.wiggle = {};
	data.wiggle.value = this.wiggle.value;
	data.wiggle.spread = this.wiggle.spread;

	// Opacity
	data.opacity = {};
	data.opacity.value = this.opacity.value.slice(0);
	data.opacity.spread = this.opacity.spread;

	// Size
	data.size = {};
	data.size.value = this.size.value.slice(0);
	data.size.spread = this.size.spread;

	// Angle
	data.angle = {};
	data.angle.value = this.angle.value.slice(0);
	data.angle.spread = this.angle.spread;

	// Color
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
export {ParticleEmitterControl};