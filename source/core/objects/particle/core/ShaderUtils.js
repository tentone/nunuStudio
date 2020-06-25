import {ParticleEmitter} from "../ParticleEmitter.js";
import {ShaderAttribute} from "../helpers/ShaderAttribute.js";
import {ParticleEmitterControl} from "./ParticleEmitterControl.js";
import {Component} from "../../../../editor/components/Component.js";
import {Vector2, Vector3, Vector4, Color} from "three";

/**
 * A bunch of utility functions used throughout the library.
 *
 * @static
 * @class ShaderUtils
 * @author Luke Moody
 */
var ShaderUtils =
{
	/**
	 * A map of types used by ShaderUtils.ensureTypedArg and ShaderUtils.ensureArrayTypedArg to compare types against.
	 *
	 * @static
	 * @attribute types
	 * @type {Object}
	 */
	types:
	{
		BOOLEAN: "boolean",
		STRING: "string",
		NUMBER: "number",
		OBJECT: "object"
	},

	/**
	 * Given a value, a type, and a default value to fallback to, ensure the given argument adheres to the type requesting, returning the default value if type check is false.
	 *
	 * @method ensureTypedArg
	 * @param {(boolean|string|number|object)} arg The value to perform a type-check on.
	 * @param {string} type The type the arg argument should adhere to.
	 * @param {(boolean|string|number|object)} defaultValue A default value to fallback on if the type check fails.
	 * @return {(boolean|string|number|object)} The given value if type check passes, or the default value if it fails.
	 */
	ensureTypedArg: function(arg, type, defaultValue)
	{
		if(typeof arg === type)
		{
			return arg;
		}
		else
		{
			return defaultValue;
		}
	},

	/**
	 * Given an array of values, a type, and a default value, ensure the given array"s contents ALL adhere to the provided type, returning the default value if type check fails.
	 *
	 * If the given value to check isn't an Array, delegates to ShaderUtils.ensureTypedArg.
	 *
	 * @static
	 * @attribute ensureArrayTypedArg
	 * @param {Array|boolean|string|number|object} arg The array of values to check type of.
	 * @param {string} type The type that should be adhered to.
	 * @param {(boolean|string|number|object)} defaultValue A default fallback value.
	 * @return {(boolean|string|number|object)} The given value if type check passes, or the default value if it fails.
	 */
	ensureArrayTypedArg: function(arg, type, defaultValue)
	{
		// If the argument being checked is an array, loop through it and ensure all the values are of the correct type, falling back to the defaultValue if any aren"t.
		if(Array.isArray(arg))
		{
			for(var i = arg.length - 1; i >= 0; --i)
			{
				if(typeof arg[i] !== type)
				{
					return defaultValue;
				}
			}

			return arg;
		}

		// If the arg isn't an array then just fallback to checking the type.
		return this.ensureTypedArg(arg, type, defaultValue);
	},

	/**
	 * Ensures the given value is an instance of a constructor function.
	 *
	 * @static
	 * @attribute ensureInstanceOf
	 * @param Object} arg The value to check instance of.
	 * @param {Function} instance The constructor of the instance to check against.
	 * @param {Object} defaultValue A default fallback value if instance check fails
	 * @return {Object} The given value if type check passes, or the default value if it fails.
	 */
	ensureInstanceOf: function(arg, instance, defaultValue)
	{
		if(instance !== undefined && arg instanceof instance) {
			return arg;
		}
		else
		{
			return defaultValue;
		}
	},

	/**
	 * Given an array of values, ensure the instances of all items in the array matches the given instance constructor falling back to a default value if the check fails.
	 *
	 * If given value isn't an Array, delegates to ShaderUtils.ensureInstanceOf.
	 *
	 * @static
	 * @attribute ensureArrayInstanceOf
	 * @param {Array|Object} arg The value to perform the instanceof check on.
	 * @param {Function} instance The constructor of the instance to check against.
	 * @param {Object} defaultValue A default fallback value if instance check fails
	 * @return {Object} The given value if type check passes, or the default value if it fails.
	 */
	ensureArrayInstanceOf: function(arg, instance, defaultValue)
	{
		// If the argument being checked is an array, loop through it and ensure all the values are of the correct type, falling back to the defaultValue if any aren"t.
		if(Array.isArray(arg))
		{
			for(var i = arg.length - 1; i >= 0; --i)
			{
				if(instance !== undefined && arg[i] instanceof instance === false)
				{
					return defaultValue;
				}
			}

			return arg;
		}

		return this.ensureInstanceOf(arg, instance, defaultValue);
	},

	/**
	 * Ensures that any "value-over-lifetime" properties of an emitter are of the correct length (as dictated by valueOverLifetimeLength).
	 *
	 * Delegates to ShaderUtils.interpolateArray for array resizing.
	 *
	 * If properties aren't arrays, then property values are put into one.
	 *
	 * @static
	 * @attribute ensureValueOverLifetimeCompliance
	 * @param {Object} property  The property of an ParticleEmitterControl instance to check compliance of.
	 * @param {number} minLength The minimum length of the array to create.
	 * @param {number} maxLength The maximum length of the array to create.
	 */
	ensureValueOverLifetimeCompliance: function(property, minLength, maxLength)
	{
		minLength = minLength || 3;
		maxLength = maxLength || 3;

		// First, ensure both properties are arrays.
		if(Array.isArray(property._value) === false)
		{
			property._value = [property._value];
		}

		if(Array.isArray(property._spread) === false)
		{
			property._spread = [property._spread];
		}

		var valueLength = this.clamp(property._value.length, minLength, maxLength),
			spreadLength = this.clamp(property._spread.length, minLength, maxLength),
			desiredLength = Math.max(valueLength, spreadLength);

		if(property._value.length !== desiredLength)
		{
			property._value = this.interpolateArray(property._value, desiredLength);
		}

		if(property._spread.length !== desiredLength)
		{
			property._spread = this.interpolateArray(property._spread, desiredLength);
		}
	},

	/**
	 * Performs linear interpolation (lerp) on an array.
	 *
	 * For example, lerping [1, 10], with a newLength of 10 will produce [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].
	 *
	 * Delegates to ShaderUtils.lerpTypeAgnostic to perform the actual interpolation.
	 *
	 * @static
	 * @attribute interpolateArray
	 * @param {Array} srcArray  The array to lerp.
	 * @param {number} newLength The length the array should be interpolated to.
	 * @return {Array} The interpolated array.
	 */
	interpolateArray: function(srcArray, newLength)
	{
		var sourceLength = srcArray.length,
			newArray = [typeof srcArray[0].clone === "function" ? srcArray[0].clone() : srcArray[0]],
			factor = (sourceLength - 1) / (newLength - 1);


		for(var i = 1; i < newLength - 1; ++i)
		{
			var f = i * factor,
				before = Math.floor(f),
				after = Math.ceil(f),
				delta = f - before;

			newArray[i] = this.lerpTypeAgnostic(srcArray[before], srcArray[after], delta);
		}

		newArray.push(
			typeof srcArray[sourceLength - 1].clone === "function" ?
			srcArray[sourceLength - 1].clone() :
			srcArray[sourceLength - 1]
	   );

		return newArray;
	},

	/**
	 * Clamp a number to between the given min and max values.
	 *
	 * @static
	 * @attribute clamp
	 * @param {number} value The number to clamp.
	 * @param {number} min The minimum value.
	 * @param {number} max The maximum value.
	 * @return {number} The clamped number.
	 */
	clamp: function(value, min, max)
	{
		return Math.max(min, Math.min(value, max));
	},

	/**
	 * If the given value is less than the epsilon value, then return a randomised epsilon value if specified, or just the epsilon value if not.
	 *
	 * Works for negative numbers as well as positive.
	 *
	 * @static
	 * @attribute zeroToEpsilon
	 * @param {number} value     The value to perform the operation on.
	 * @param {boolean} randomise Whether the value should be randomised.
	 * @return {number}           The result of the operation.
	 */
	zeroToEpsilon: function(value, randomise)
	{
		var epsilon = 0.00001;
		var result = value;

		result = randomise ? Math.random() * epsilon * 10 : epsilon;

		if(value < 0 && value > -epsilon)
		{
			result = -result;
		}

		return result;
	},

	/**
	 * Linearly interpolates two values of various types. The given values must be of the same type for the interpolation to work.
	 *
	 * @static
	 * @attribute lerpTypeAgnostic
	 * @param {(number|Object)} start The start value of the lerp.
	 * @param {(number|object)} end The end value of the lerp.
	 * @param {number} delta The delta posiiton of the lerp operation. Ideally between 0 and 1 (inclusive).
	 * @return {(number|object|undefined)} The result of the operation. Result will be undefined if the start and end arguments aren't a supported type, or if their types do not match.
	 */
	lerpTypeAgnostic: function(start, end, delta)
	{
		var types = this.types,
			out;

		if(typeof start === types.NUMBER && typeof end === types.NUMBER)
		{
			return start + ((end - start) * delta);
		}
		else if(start instanceof Vector2 && end instanceof Vector2)
		{
			out = start.clone();
			out.x = this.lerp(start.x, end.x, delta);
			out.y = this.lerp(start.y, end.y, delta);
			return out;
		}
		else if(start instanceof Vector3 && end instanceof Vector3)
		{
			out = start.clone();
			out.x = this.lerp(start.x, end.x, delta);
			out.y = this.lerp(start.y, end.y, delta);
			out.z = this.lerp(start.z, end.z, delta);
			return out;
		}
		else if(start instanceof Vector4 && end instanceof Vector4)
		{
			out = start.clone();
			out.x = this.lerp(start.x, end.x, delta);
			out.y = this.lerp(start.y, end.y, delta);
			out.z = this.lerp(start.z, end.z, delta);
			out.w = this.lerp(start.w, end.w, delta);
			return out;
		}
		else if(start instanceof Color && end instanceof Color)
		{
			out = start.clone();
			out.r = this.lerp(start.r, end.r, delta);
			out.g = this.lerp(start.g, end.g, delta);
			out.b = this.lerp(start.b, end.b, delta);
			return out;
		}
		else
		{
			console.warn("nunuStudio: Invalid argument types, or argument types do not match.", start, end);
		}
	},

	/**
	 * Perform a linear interpolation operation on two numbers.
	 *
	 * @static
	 * @attribute lerp
	 * @param {number} start The start value.
	 * @param {number} end The end value.
	 * @param {number} delta The position to interpolate to.
	 * @return {number} The result of the lerp operation.
	 */
	lerp: function(start, end, delta)
	{
		return start + ((end - start) * delta);
	},

	/**
	 * Rounds a number to a nearest multiple.
	 *
	 * @static
	 * @attribute roundToNearestMultiple
	 * @param {number} n The number to round.
	 * @param {number} multiple The multiple to round to.
	 * @return {number} The result of the round operation.
	 */
	roundToNearestMultiple: function(n, multiple)
	{
		var remainder = 0;

		if(multiple === 0)
		{
			return n;
		}

		remainder = Math.abs(n) % multiple;

		if(remainder === 0)
		{
			return n;
		}

		if(n < 0)
		{
			return -(Math.abs(n) - remainder);
		}

		return n + multiple - remainder;
	},

	/**
	 * Check if all items in an array are equal. Uses strict equality.
	 *
	 * @static
	 * @attribute arrayValuesAreEqual
	 * @param {Array} array The array of values to check equality of.
	 * @return {boolean}       Whether the array"s values are all equal or not.
	 */
	arrayValuesAreEqual: function(array)
	{
		for(var i = 0; i < array.length - 1; ++i)
		{
			if(array[i] !== array[i + 1])
			{
				return false;
			}
		}

		return true;
	},

	/**
	 * Given a start value and a spread value, create and return a random number.
	 *
	 * @static
	 * @attribute randomFloat
	 * @param {number} base   The start value.
	 * @param {number} spread The size of the random variance to apply.
	 * @return {number}        A randomised number.
	 */
	randomFloat: function(base, spread)
	{
		return base + spread * (Math.random() - 0.5);
	},

	/**
	 * Given an ShaderAttribute instance, and various other settings, assign values to the attribute"s array in a vec3 format.
	 *
	 * @static
	 * @attribute randomVector3
	 * @param {Object} attribute The instance of ShaderAttribute to save the result to.
	 * @param {number} index The offset in the attribute"s TypedArray to save the result from.
	 * @param {Object} base Vector3 instance describing the start value.
	 * @param {Object} spread Vector3 instance describing the random variance to apply to the start value.
	 * @param {Object} spreadClamp Vector3 instance describing the multiples to clamp the randomness to.
	 */
	randomVector3: function(attribute, index, base, spread, spreadClamp)
	{
		var x = base.x + (Math.random() * spread.x - (spread.x * 0.5)),
			y = base.y + (Math.random() * spread.y - (spread.y * 0.5)),
			z = base.z + (Math.random() * spread.z - (spread.z * 0.5));

		if(spreadClamp)
		{
			x = -spreadClamp.x * 0.5 + this.roundToNearestMultiple(x, spreadClamp.x);
			y = -spreadClamp.y * 0.5 + this.roundToNearestMultiple(y, spreadClamp.y);
			z = -spreadClamp.z * 0.5 + this.roundToNearestMultiple(z, spreadClamp.z);
		}

		attribute.typedArray.setVec3Components(index, x, y, z);
	},

	/**
	 * Given an Shader attribute instance, and various other settings, assign Color values to the attribute.
	 *
	 * @static
	 * @attribute randomColor
	 * @param {Object} attribute The instance of ShaderAttribute to save the result to.
	 * @param {number} index The offset in the attribute"s TypedArray to save the result from.
	 * @param {Object} base Color instance describing the start color.
	 * @param {Object} spread Vector3 instance describing the random variance to apply to the start color.
	 */
	randomColor: function(attribute, index, base, spread)
	{
		var r = base.r + (Math.random() * spread.x),
			g = base.g + (Math.random() * spread.y),
			b = base.b + (Math.random() * spread.z);

		r = this.clamp(r, 0, 1);
		g = this.clamp(g, 0, 1);
		b = this.clamp(b, 0, 1);


		attribute.typedArray.setVec3Components(index, r, g, b);
	},


	/**
	 * Assigns a random color value, encoded as a hex value in decimal format, to a ShaderAttribute instance.
	 *
	 * @static
	 * @attribute randomColorAsHex
	 * @param {Object} attribute The instance of ShaderAttribute to save the result to.
	 * @param {number} index The offset in the attribute"s TypedArray to save the result from.
	 * @param {Object} base Color instance describing the start color.
	 * @param {Object} spread Vector3 instance describing the random variance to apply to the start color.
	 */
	randomColorAsHex: (function()
	{
		var workingColor = new Color();

		return function(attribute, index, base, spread)
		{
			var numItems = base.length,
				colors = [];

			for(var i = 0; i < numItems; ++i) {
				var spreadVector = spread[i];

				workingColor.copy(base[i]);

				workingColor.r += (Math.random() * spreadVector.x) - (spreadVector.x * 0.5);
				workingColor.g += (Math.random() * spreadVector.y) - (spreadVector.y * 0.5);
				workingColor.b += (Math.random() * spreadVector.z) - (spreadVector.z * 0.5);

				workingColor.r = this.clamp(workingColor.r, 0, 1);
				workingColor.g = this.clamp(workingColor.g, 0, 1);
				workingColor.b = this.clamp(workingColor.b, 0, 1);

				colors.push(workingColor.getHex());
			}

			attribute.typedArray.setVec4Components(index, colors[0], colors[1], colors[2], colors[3]);
		};
	}()),

	/**
	 * Assigns a random vector 3 value to an ShaderAttribute instance, projecting the given values onto a sphere.
	 *
	 * @static
	 * @attribute randomVector3OnSphere
	 * @param {Object} attribute The instance of ShaderAttribute to save the result to.
	 * @param {number} index     The offset in the attribute"s TypedArray to save the result from.
	 * @param {Object} base              Vector3 instance describing the origin of the transform.
	 * @param {number} radius            The radius of the sphere to project onto.
	 * @param {number} radiusSpread      The amount of randomness to apply to the projection result
	 * @param {Object} radiusScale       Vector3 instance describing the scale of each axis of the sphere.
	 * @param {number} radiusSpreadClamp What numeric multiple the projected value should be clamped to.
	 */
	randomVector3OnSphere: function(attribute, index, base, radius, radiusSpread, radiusScale, radiusSpreadClamp, distributionClamp)
	{
		var depth = 2 * Math.random() - 1,
			t = 6.2832 * Math.random(),
			r = Math.sqrt(1 - depth * depth),
			rand = this.randomFloat(radius, radiusSpread),
			x = 0,
			y = 0,
			z = 0;


		if(radiusSpreadClamp)
		{
			rand = Math.round(rand / radiusSpreadClamp) * radiusSpreadClamp;
		}

		// Set position on sphere
		x = r * Math.cos(t) * rand;
		y = r * Math.sin(t) * rand;
		z = depth * rand;

		// Apply radius scale to this position
		x *= radiusScale.x;
		y *= radiusScale.y;
		z *= radiusScale.z;

		// Translate to the base position.
		x += base.x;
		y += base.y;
		z += base.z;

		// Set the values in the typed array.
		attribute.typedArray.setVec3Components(index, x, y, z);
	},

	seededRandom: function(seed)
	{
		var x = Math.sin(seed) * 10000;
		return x - (x | 0);
	},

	/**
	 * Assigns a random vector 3 value to an ShaderAttribute instance, projecting the given values onto a 2d-disc.
	 *
	 * @static
	 * @attribute randomVector3OnDisc
	 * @param {Object} attribute The instance of ShaderAttribute to save the result to.
	 * @param {number} index The offset in the attribute"s TypedArray to save the result from.
	 * @param {Object} base Vector3 instance describing the origin of the transform.
	 * @param {number} radius The radius of the sphere to project onto.
	 * @param {number} radiusSpread The amount of randomness to apply to the projection result
	 * @param {Object} radiusScale Vector3 instance describing the scale of each axis of the disc. The z-component is ignored.
	 * @param {number} radiusSpreadClamp What numeric multiple the projected value should be clamped to.
	 */
	randomVector3OnDisc: function(attribute, index, base, radius, radiusSpread, radiusScale, radiusSpreadClamp)
	{
		var t = 6.2832 * Math.random(),
			rand = Math.abs(this.randomFloat(radius, radiusSpread)),
			x = 0,
			y = 0,
			z = 0;

		if(radiusSpreadClamp)
		{
			rand = Math.round(rand / radiusSpreadClamp) * radiusSpreadClamp;
		}

		// Set position on sphere
		x = Math.cos(t) * rand;
		y = Math.sin(t) * rand;

		// Apply radius scale to this position
		x *= radiusScale.x;
		y *= radiusScale.y;

		// Translate to the base position.
		x += base.x;
		y += base.y;
		z += base.z;

		// Set the values in the typed array.
		attribute.typedArray.setVec3Components(index, x, y, z);
	},

	/**
	 * Given an ShaderAttribute instance, create a direction vector from the given
	 * position, using speed as the magnitude. Values are saved to the attribute.
	 *
	 * @static
	 * @attribute randomDirectionVector3OnSphere
	 * @param {Object} attribute       The instance of ShaderAttribute to save the result to.
	 * @param {number} index           The offset in the attribute"s TypedArray to save the result from.
	 * @param {number} posX            The particle"s x coordinate.
	 * @param {number} posY            The particle"s y coordinate.
	 * @param {number} posZ            The particle"s z coordinate.
	 * @param {Object} emitterPosition Vector3 instance describing the emitter"s base position.
	 * @param {number} speed           The magnitude to apply to the vector.
	 * @param {number} speedSpread     The amount of randomness to apply to the magnitude.
	 */
	randomDirectionVector3OnSphere: (function()
	{
		var v = new Vector3();

		return function(attribute, index, posX, posY, posZ, emitterPosition, speed, speedSpread)
		{
			v.copy(emitterPosition);

			v.x -= posX;
			v.y -= posY;
			v.z -= posZ;

			v.normalize().multiplyScalar(-this.randomFloat(speed, speedSpread));

			attribute.typedArray.setVec3Components(index, v.x, v.y, v.z);
		};
	}()),


	/**
	 * Given an ShaderAttribute instance, create a direction vector from the given position, using speed as the magnitude. Values are saved to the attribute.
	 *
	 * @static
	 * @attribute randomDirectionVector3OnDisc
	 * @param {Object} attribute The instance of ShaderAttribute to save the result to.
	 * @param {number} index The offset in the attribute"s TypedArray to save the result from.
	 * @param {number} posX The particle"s x coordinate.
	 * @param {number} posY The particle"s y coordinate.
	 * @param {number} posZ The particle"s z coordinate.
	 * @param {Object} emitterPosition Vector3 instance describing the emitter"s base position.
	 * @param {number} speed The magnitude to apply to the vector.
	 * @param {number} speedSpread The amount of randomness to apply to the magnitude.
	 */
	randomDirectionVector3OnDisc: (function()
	{
		var v = new Vector3();

		return function(attribute, index, posX, posY, posZ, emitterPosition, speed, speedSpread)
		{
			v.copy(emitterPosition);

			v.x -= posX;
			v.y -= posY;
			v.z -= posZ;

			v.normalize().multiplyScalar(-this.randomFloat(speed, speedSpread));

			attribute.typedArray.setVec3Components(index, v.x, v.y, 0);
		};
	}()),

	/**
	 * Given a rotation axis, and a rotation axis spread vector, calculate a randomised rotation axis, and pack it into a hexadecimal value represented in decimal form.
	 *
	 * @static
	 * @attribute getPackedRotationAxis
	 * @param {Object} axis Vector3 instance describing the rotation axis.
	 * @param {Object} axisSpread Vector3 instance describing the amount of randomness to apply to the rotation axis.
	 * @return {number} The packed rotation axis, with randomness.
	 */
	getPackedRotationAxis: (function()
	{
		var v = new Vector3(),
			vSpread = new Vector3(),
			c = new Color(),
			addOne = new Vector3(1, 1, 1);

		return function(axis, axisSpread)
		{
			v.copy(axis).normalize();
			vSpread.copy(axisSpread).normalize();

			v.x += (-axisSpread.x * 0.5) + (Math.random() * axisSpread.x);
			v.y += (-axisSpread.y * 0.5) + (Math.random() * axisSpread.y);
			v.z += (-axisSpread.z * 0.5) + (Math.random() * axisSpread.z);

			v.normalize().add(addOne).multiplyScalar(0.5);

			c.setRGB(v.x, v.y, v.z);

			return c.getHex();
		};
	}())
};
export {ShaderUtils};