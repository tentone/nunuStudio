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
}

PythonScript.prototype = Object.create(Script.prototype);

/**
 * Default script code used when creating a new Script.
 *
 * @attribute DEFAULT
 * @type {string}
 */
PythonScript.DEFAULT = "def initialize():\n\t# TODO <ADD CODE HERE>\n\tprint(\"Initialize\")\n\ndef update(delta):\n\t# TODO <ADD CODE HERE>\n\tprint(\"Update\")";

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
		// Compile code to JS
		compiled = Brython.python_to_js(code);

		// Remove scope wrapper from the compiled code
		compiled = compiled.substring(compiled.indexOf("\n") + 1, compiled.lastIndexOf("\n"));
	}
	catch (e)
	{
		throw new Error("Failed to transpile python into javascript code.", e);
	}
	
	// Context code
	compiled = "for(var p in __context__){eval('var ' + p + ' = __context__[p];');}\n" + compiled;

	// Public method declaration
	for (var i = 0; i < Script.METHODS.length; i++)
	{
		var method = Script.METHODS[i];
		compiled += "\nif(this." + method + " == undefined && typeof $locals___main__[\"" + method + "\"] !== 'undefined'){this." + method + " = $locals___main__[\"" + method + "\"];}";
	}

	var Constructor = new Function("__context__", compiled);

	// Create script object
	try
	{	
		var context = this.createContextObject();
		this.script = new Constructor(context);
	}
	catch (e)
	{
		this.script = {};
		console.warn("nunuStudio: Error initializing script code", e);
		throw new Error("Error initializing script code");
	}

	// TODO <REMOVE THIS>
	console.log(this.script, code, compiled);
};

export {PythonScript};
