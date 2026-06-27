/**
 * MathUtils contains auxiliary values and function to help with mathematical operations.
 *
 * @static
 * @class MathUtils
 * @module Utils
 */
function MathUtils() {}

/**
 * Value of PI*2. 360 degrees.
 *
 * @attribute pi2
 * @type {number}
 */
MathUtils.PI2 = 2 * Math.PI;

/**
 * Value of PI/3. 60 degrees.
 *
 * @attribute pid3
 * @type {number}
 */
MathUtils.PID3 = Math.PI / 3;

/**
 * Value of PI/2. 45 degrees.
 *
 * @attribute pid2
 * @type {number}
 */
MathUtils.PID2 = Math.PI / 2;

/**
 * Generates a random color code.
 *
 * Uses the #RRGGBB format.
 *
 * @method randomColor
 * @return {string} Generated color code.
 */
MathUtils.randomColor = function()
{
	var letters = "0123456789ABCDEF";
	var color = "#";

	for (var i = 0; i < 6; i++)
	{
		color += letters[Math.floor(Math.random() * 16)];
	}

	return color;
};

/**
 * Clamps a value between a minimum and maximum value.
 *
 * @static
 * @method clamp
 * @param {number} value Value to clamp.
 * @param {number} min Minimum value.
 * @param {number} max Maximum value.
 * @return {number} Clamped value.
 */
MathUtils.clamp = function(value, min, max)
{
	return Math.max(min, Math.min(value, max));
};

/**
 * Performs linear interpolation between two values.
 *
 * @static
 * @method lerp
 * @param {number} a Start value.
 * @param {number} b End value.
 * @param {number} t Interpolation factor.
 * @return {number} Interpolated value.
 */
MathUtils.lerp = function(a, b, t)
{
	return a + (b - a) * t;
};

/**
 * Smooth Hermite interpolation between 0 and 1.
 *
 * @static
 * @method smoothstep
 * @param {number} x Input value.
 * @param {number} min Minimum edge.
 * @param {number} max Maximum edge.
 * @return {number} Interpolated value.
 */
MathUtils.smoothstep = function(x, min, max)
{
	if (x <= min)
	{
		return 0;
	}
	if (x >= max)
	{
		return 1;
	}

	x = (x - min) / (max - min);

	return x * x * (3 - 2 * x);
};

/**
 * Smoother Hermite interpolation (Ken Perlin).
 *
 * @static
 * @method smootherstep
 * @param {number} x Input value.
 * @param {number} min Minimum edge.
 * @param {number} max Maximum edge.
 * @return {number} Interpolated value.
 */
MathUtils.smootherstep = function(x, min, max)
{
	if (x <= min)
	{
		return 0;
	}
	if (x >= max)
	{
		return 1;
	}

	x = (x - min) / (max - min);

	return x * x * x * (x * (x * 6 - 15) + 10);
};

/**
 * Re-maps a number from one range to another.
 *
 * @static
 * @method mapRange
 * @param {number} value Value to be re-mapped.
 * @param {number} inMin Lower bound of the value's current range.
 * @param {number} inMax Upper bound of the value's current range.
 * @param {number} outMin Lower bound of the target range.
 * @param {number} outMax Upper bound of the target range.
 * @return {number} Re-mapped value.
 */
MathUtils.mapRange = function(value, inMin, inMax, outMin, outMax)
{
	return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
};

/**
 * Convert degrees to radians.
 *
 * @static
 * @method degToRad
 * @param {number} degrees Angle in degrees.
 * @return {number} Angle in radians.
 */
MathUtils.degToRad = function(degrees)
{
	return degrees * Math.PI / 180;
};

/**
 * Convert radians to degrees.
 *
 * @static
 * @method radToDeg
 * @param {number} radians Angle in radians.
 * @return {number} Angle in degrees.
 */
MathUtils.radToDeg = function(radians)
{
	return radians * 180 / Math.PI;
};

/**
 * Checks if value is a power of two.
 *
 * @static
 * @method isPowerOfTwo
 * @param {number} value Value to check.
 * @return {boolean} True if the value is a power of two.
 */
MathUtils.isPowerOfTwo = function(value)
{
	return (value & value - 1) === 0 && value !== 0;
};

/**
 * Returns the next power of two.
 *
 * @static
 * @method nextPowerOfTwo
 * @param {number} value Input value.
 * @return {number} Next power of two.
 */
MathUtils.nextPowerOfTwo = function(value)
{
	value--;
	value |= value >> 1;
	value |= value >> 2;
	value |= value >> 4;
	value |= value >> 8;
	value |= value >> 16;
	value++;

	return value;
};

/**
 * Generate a random float in range [min, max).
 *
 * @static
 * @method randomRange
 * @param {number} min Minimum value.
 * @param {number} max Maximum value.
 * @return {number} Random float.
 */
MathUtils.randomRange = function(min, max)
{
	return min + Math.random() * (max - min);
};

/**
 * Generate a random integer in range [min, max].
 *
 * @static
 * @method randomInt
 * @param {number} min Minimum value.
 * @param {number} max Maximum value.
 * @return {number} Random integer.
 */
MathUtils.randomInt = function(min, max)
{
	return min + Math.floor(Math.random() * (max - min + 1));
};

export {MathUtils};
