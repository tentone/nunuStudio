"use strict";

/**
 * MathUtils contains auxiliar values and function to help with mathematical operations.
 *
 * @static
 * @class MathUtils
 * @module Utils
 */
function MathUtils(){}

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

	for(var i = 0; i < 6; i++)
	{
		color += letters[Math.floor(Math.random() * 16)];
	}

	return color;
};
