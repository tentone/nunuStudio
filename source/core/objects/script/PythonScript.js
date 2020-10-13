import {Group, Object3D} from "three";
import * as Brython from "brython";
import {Scene} from "../Scene.js";
import {Program} from "../Program.js";
import {Script} from "./Script.js";

/**
 * Python scripts are similar to Script object by are written using the Python programming language.
 * 
 * Support for Python is provided using the Brython (https://github.com/brython-dev/brython) transpiler.
 * 
 * It is not possible to include external python code and libraries to the script.
 * 
 * @class PythonScript
 * @extends {Script}
 * @param {string} code Code to be used by this script
 * @module Script
 */
function PythonScript(code)
{
	code = code !== undefined ? code : PythonScript.DEFAULT;

	Script.call(this, code);
	
	this.type = "PythonScript";
	this.name = "script";

	// TODO <REMOVE THIS CODE>
	console.log(Brython);
}

PythonScript.prototype = Object.create(Script.prototype);

/**
 * Default script code used when creating a new Script.
 *
 * @attribute DEFAULT
 * @type {string}
 */
PythonScript.DEFAULT = "def initialize():\n\t# TODO <ADD CODE HERE>\n\tprint(\"Initialize\")\n\ndef update():\n\t# TODO <ADD CODE HERE>\n\tprint(\"Update\")";


/**
 * Call onAppData() from the script if available.
 *
 * This method is called everytime that external data is passed to the runtime.
 * 
 * @method appData
 * @param {Object} data
 */
PythonScript.prototype.appData = function(data)
{
	if (this.script.onAppData !== undefined)
	{
		this.script.onAppData.call(this, data);
	}
};

/**
 * Prepare the script code to be run. The script can be prepared using different methods depending on the include mode defined.
 * 
 * Can be used to dinamically change the script code. However it is not recommended can lead to undefined behavior.
 *
 * @method compileCode
 * @param {string} code Code to be compiled into usable code.
 */
PythonScript.prototype.compileCode = function(code, onReady)
{	
	var compiled;

	try
	{
		compiled = Brython.python_to_js(code);
		
		// TODO <REMOVE THIS>
		console.log(code, compiled);
	}
	catch (e)
	{
		throw new Error("Failed to transpile python into javascript code.", e);
	}

	
	Script.prototype.compileCode.call(this, compiled, onReady);
};

export {PythonScript};
