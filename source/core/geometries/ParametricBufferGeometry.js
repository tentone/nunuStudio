import {ParametricBufferGeometry as TParametricBufferGeometry, Vector3} from "three";

/**
 * Parametric bufffer geometry are constructed from javascript code describing a parametric surface.
 * 
 * A parametric function receives a (u, v) coordinate value and returns a Vector3 with the surface point for those values.
 * 
 * (u, v) values are normalized and might need readjusting to match the parametric function generator domain.
 * 
 * @class ParametricBufferGeometry
 * @constructor
 * @param {string} code Javascript code that receive (u: number, v: number, target?: Vector3) as parameters, the target paramter might be undefined.
 * @param {number} slices The count of slices to use for the parametric function.
 * @param {number} stacks The count of stacks to use for the parametric function.
 */
function ParametricBufferGeometry(code, slices, stacks)
{
	var generator = this.compile(code);
	
	TParametricBufferGeometry.call(this, generator, slices, stacks);

	this.type = "ParametricBufferGeometry";

	this.parameters = {
		code: code,
		slices: slices,
		stacks: stacks
	};
}

ParametricBufferGeometry.prototype = Object.create(TParametricBufferGeometry.prototype);

/**
 * Compile the generator code and generate a function to be passed to the geometry generator.
 * 
 * @function compile
 */
ParametricBufferGeometry.prototype.compile = function(code)
{
	try
	{
		return new Function("u, v, target", code);
	}
	catch(e)
	{
		console.error("nunuStudio: Error occured while compiling ParametricBufferGeometry code.", e);
	}

	return function(u, v, target) {
		return target || new Vector3();
	}
};

export {ParametricBufferGeometry};