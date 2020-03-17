"use strict";

/**
 * The unit convertor is responsible for performing unit conversion between values.
 *
 * Units are represented by their natural texture unit representation (m/s, km/s, n/m, etc).
 *
 * @static
 * @class UnitConverter
 */
function UnitConverter(){}

/**
 * Scale levels.
 *
 * Is a map containing the scale symbol and its value.
 *
 * @static
 * @attribute scales
 * @type {Map}
 */
UnitConverter.scales = new Map(
[
	["Y", 1e24],
	["Z", 1e21],
	["E", 1e18],
	["P", 1e15],
	["T", 1e12],
	["G", 1e9],
	["M", 1e6],
	["k", 1e3],
	["m", 1e-3],
	["u", 1e-6],
	["n", 1e-9],
	["p", 1e-12],
	["f", 1e-15],
	["a", 1e-18],
	["z", 1e-21],
	["y", 1e-24]
]);

/**
 * List of known units.
 *
 * It a map containing sub maps that contains methods that allow getting to the unit refered.
 *
 * @static
 * @attribute units
 * @type {Map}
 */
UnitConverter.units = new Map(
[
	// Distance
	["m", new Map([["i", function(i){return i / 39.3701;}]])], // Meter
	["i", new Map([["m", function(m){return m * 39.3701;}]])], // Inch

	// Mass
	["g", null], // Gram
	
	// Time
	["s", null], // Second

	// Temperature
	["c", new Map([["k", function(k){return k - 273.15;}], ["f", function(f){return (f - 32) / 1.8;}]])], // Celsius
	["k", new Map([["c", function(c){return c + 273.15;}], ["f", function(f){return (f - 32) / 1.8 + 273.15;}]])], // Kelvin
	["f", new Map([["c", function(c){return c * 1.8 + 32;}], ["k", function(k){return k * 1.8 - 459.67;}]])], // Fahrenheit

	// Angle
	["d", new Map([["r", function(r){return r * 57.2957795131;}]])], // Degrees
	["r", new Map([["d", function(d){return d / 57.2957795131;}]])] // Radians
]);

/**
 * Convert a unit form one input unit to another unit.
 * 
 * @static
 * @method convert
 * @param {Number} value Input value to be converted.
 * @param {Number} inUnit Input original unit.
 * @param {Number} outUnit Input output unit.
 * @return {Number} Retuns the value converted based on input and output units, if the value cannot be converted returns null.
 */
UnitConverter.convert = function(value, inUnit, outUnit)
{
	if(inUnit.length > 1)
	{
		value *= UnitConverter.scales.get(inUnit.charAt(0));
		inUnit = inUnit.slice(1);
	}

	var outScale = 1;
	if(outUnit.length > 1)
	{
		outScale = UnitConverter.scales.get(outUnit.charAt(0));
		outUnit = outUnit.slice(1);
	}
	
	if(inUnit === outUnit)
	{
		return value / outScale;
	}

	return UnitConverter.units.get(outUnit).get(inUnit)(value) / outScale;
};
