import {ParametricBufferGeometry as TParametricBufferGeometry} from "three";

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
	TParametricBufferGeometry.call(this, this.compile(code), slices, stacks);

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
	return new Function("u, v, target", code);
};

export {ParametricBufferGeometry};