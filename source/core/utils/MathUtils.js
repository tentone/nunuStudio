"use strict";

/**
 * MathUtils contains auxiliar values and function to help with mathematical operations.
 *
 * @class MathUtils
 * @module Utils
 * @static
 */
function MathUtils(){}

/**
 * Value of PI*2. 360 degrees.
 *
 * @attribute pi2
 * @type {Number}
 */
MathUtils.pi2 = 2 * Math.PI;

/**
 * Value of PI/3. 60 degrees.
 *
 * @attribute pid3
 * @type {Number}
 */
MathUtils.pid3 = Math.PI / 3;

/**
 * Value of PI/2. 45 degrees.
 *
 * @attribute pid2
 * @type {Number}
 */
MathUtils.pid2 = Math.PI / 2;

/**
 * Generates a random color code.
 *
 * Uses the #RRGGBB format.
 *
 * @method randomColor
 * @return {String} Generated color code.
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
