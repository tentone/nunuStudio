import * as Brython from "brython";
import {Group, Object3D} from "three";
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

	Group.call(this);
	
	this.type = "PythonScript";
	this.name = "script";

	/**
	 * Python code attached to the script.
	 * 
	 * It only has acess to the data provided as parameter in each method.
	 * - initialize(obj, scene, program, keyboard, mouse) 
	 *    - Called on app initialization, its called after all children elements are initialized, its safe to apply operations on other objects inside this method.
	 *  - update(delta, obj, scene, program, keyboard, mouse)
	 *    - Called on every frame after rendering
	 *  - dispose(obj, scene, program, keyboard, mouse)
	 *    - Called when disposing the program
	 *  - onMouseOver(intersections, obj, scene, program, keyboard, mouse)
	 *    - Called on every frame if mouse is on top of one of the script children
	 *    - Receives an intersections array as argument.
	 *  - onResize(x, y, obj, scene, program, keyboard, mouse)
	 *    - Called every time the window is resized
	 *    - Receives width and height as parameters
	 *  - onAppData(data, obj, scene, program, keyboard, mouse)
	 *    - Called when receiving data sent by the host website
	 * 
	 * @property code
	 * @type {string}
	 */
	this.code = code !== undefined ? code : PythonScript.DEFAULT;

	/**
	 * Compiled function used during runtime.
	 *
	 * This varible gets created using the compileCode() function called automatically on initalization.
	 *
	 * @attribute script
	 * @type {Function}
	 */
	this.script = {};

	/**
	 * Reference to the program object.
	 *
	 * Can be used to access other scenes, get resources and objects.
	 *
	 * @property program
	 * @type {Program}
	 */
	this.program = null;

	/**
	 * Reference to the scene where the script is placed.
	 *
	 * Can be used to interact with other objects.
	 *
	 * @property scene
	 * @type {Scene}
	 */
	this.scene = null;
}

PythonScript.prototype = Object.create(Group.prototype);

/**
 * Default script code used when creating a new Script.
 *
 * @attribute DEFAULT
 * @type {string}
 */
PythonScript.DEFAULT = `def initialize(obj, scene, program, keyboard, mouse):
	# TODO <ADD CODE HERE>
	pass

def update(delta, obj, scene, program, keyboard, mouse):
	# TODO <ADD CODE HERE>
	pass`;

PythonScript.prototype.initialize = function()
{
	var node = this;
	while (node.parent !== null)
	{
		node = node.parent;
		if (node instanceof Scene)
		{
			this.scene = node;
		}
		else if (node instanceof Program)
		{
			this.program = node;
		}
	}

	Object3D.prototype.initialize.call(this);

	this.compileCode(this.code);

	if (this.script.initialize !== undefined)
	{
		this.script.initialize.call(this, this, this.scene, this.program, this.program.keyboard, this.program.mouse);
	}
};

/**
 * Update script state automatically calls for mouse events if they are defined and for the script update method.
 * 
 * This method is executed every frame, script logic should not relly on the frame time, use the "delta" value provided.
 * 
 * @method update
 */
PythonScript.prototype.update = function(delta)
{
	if (this.script.onMouseOver !== undefined)
	{
		var intersections = this.scene.raycaster.intersectObjects(this.children, true);
		if (intersections.length > 0)
		{
			this.script.onMouseOver.call(this, intersections);
		}
	}

	if (this.script.update !== undefined)
	{
		this.script.update.call(this, delta, this, this.scene, this.program, this.program.keyboard, this.program.mouse);
	}

	Object3D.prototype.update.call(this, delta);
};

/**
 * Disposes the script, can be used to clear resources when the program exits.
 * 
 * Calls the script dispose method if it exists.
 * 
 * @method dispose
 */
PythonScript.prototype.dispose = function()
{
	if (this.script.dispose !== undefined)
	{
		this.script.dispose.call(this, this, this.scene, this.program, this.program.keyboard, this.program.mouse);
	}

	Object3D.prototype.dispose.call(this);
};

/**
 * Call resize method if available.
 *
 * The resize method receives width and height as arguments.
 * 
 * @method resize
 */
PythonScript.prototype.resize = function(x, y)
{
	if (this.script.onResize !== undefined)
	{
		this.script.onResize.call(this, x, y, this, this.scene, this.program, this.program.keyboard, this.program.mouse);
	}
};

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
		this.script.onAppData.call(this, data, this, this.scene, this.program, this.program.keyboard, this.program.mouse);
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
	// compiled = "for(var p in __context__){eval('var ' + p + ' = __context__[p];');}\n" + compiled;

	// Public method declaration
	for (var i = 0; i < Script.METHODS.length; i++)
	{
		 var method = Script.METHODS[i];
		 compiled += "\nif(this." + method + " == undefined && typeof $locals___main__[\"" + method + "\"] !== 'undefined'){this." + method + " = $locals___main__[\"" + method + "\"];}";
	}

	var Constructor = new Function(compiled);

	// Create script object
	try
	{	
		// var context = this.createContextObject();
		this.script = new Constructor();
	}
	catch (e)
	{
		this.script = {};
		console.warn("nunuStudio: Error initializing script code", e);
		throw new Error("Error initializing script code");
	}

	// TODO <REMOVE THIS>
	console.log(this.script, code, compiled);

	if (onReady !== undefined)
	{
		onReady();
	}
};

PythonScript.prototype.toJSON = function(meta)
{
	var data = Object3D.prototype.toJSON.call(this, meta);

	data.object.code = this.code;

	return data;
};


export {PythonScript};
