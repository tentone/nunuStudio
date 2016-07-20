"use strict";

//Auxiliar math functions
function MathUtils(){}

//Round a number to a decimal precision
MathUtils.roundNumber = function(number, precision)
{
	if(precision === undefined)
	{	
		return Math.round(number)
	}

	if(number === 0)
	{
		var decimals = "";

		for(var i = 0; i < precision; i++)
		{
			decimals += "0";
		}

		return "0."+decimals;
	}

	var exponent = Math.pow(10, precision);
	var num = Math.round(number * exponent).toString();
	return parseFloat(num.slice(0, -1 * precision) + "." + num.slice(-1 * precision));
}