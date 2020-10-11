import {Group, Object3D} from "three";
import Brython from "brython";
import {Scene} from "../Scene.js";
import {Program} from "../Program.js";

console.log(Brython);

/**
 * Python scripts are similar to Script object by are written using the Python programming language.
 * 
 * Support for Python is provided using the Brython (https://github.com/brython-dev/brython) transpiler.
 * 
 * It is not possible to include external python code and libraries to the script.
 * 
 * @class PythonScript
 * @extends {Object}
 * @param {string} code Code to be used by this script
 * @module Script
 */
function PythonScript(code)
{
	Group.call(this);
	
	this.type = "PythonScript";
	this.name = "script";

	/*
	 * Python code attached to the script.
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
PythonScript.DEFAULT = "def initialize():\n\t# TODO <ADD CODE HERE>\n\tprint(\"Initialize\")\n\ndef update():\n\t# TODO <ADD CODE HERE>\n\tprint(\"Update\")";

/**
 * Initialize script, code automatically called by the runtime on program initialization.
 *
 * Compiles the script code and calls the script initialize method if it exists after the code is compiled.
 *
 * @method initialize
 */
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

	var self = this;

	this.compileCode(this.code, function()
	{
		if (self.script.initialize !== undefined)
		{
			self.script.initialize.call(self);
		}
	});
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
		this.script.update.call(this, delta);
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
		this.script.dispose.call(this);
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
		this.script.onResize.call(this, x, y);
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
PythonScript.prototype.compileCode = function(code)
{
	if (code !== undefined)
	{
		this.code = code;
	}

	// TODO <ADD CODE HERE>
};

PythonScript.prototype.toJSON = function(meta)
{
	var data = Object3D.prototype.toJSON.call(this, meta);

	data.object.code = this.code;

	return data;
};

export {PythonScript};
