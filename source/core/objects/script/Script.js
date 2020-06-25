/**
 * Script objects are used to control other objects present in the scene.
 *
 * These scripts can access everything inside of the program where they are running they should be used to control logic aspect of the application.
 *
 * Its possible to extend these scripts by using libraries that can be imported using the include() function provided. Libraries can be stored locally on the project or loaded from remote sources.
 * 
 * @class Script
 * @extends {Object}
 * @param {string} code Javascript code to be used by this script
 * @module Script
 */
function Script(code, mode)
{
	THREE.Group.call(this);
	
	this.type = "Script";
	this.name = "script";

	/**
	 * Javascript code attached to the script.
	 *
	 * It can access and change every object in the program and supports some events
	 *  - initialize
	 *    - Called on app initialization, its called after all children elements are initialized, its safe to apply operations on other objects inside this method.
	 *  - update(delta)
	 *    - Called on every frame after rendering
	 *  - dispose
	 *    - Called when disposing the program
	 *  - onMouseOver(intersections)
	 *    - Called on every frame if mouse is on top of one of the script children
	 *    - Receives an intersections array as argument.
	 *  - onResize(x, y)
	 *    - Called every time the window is resized
	 *    - Receives width and height as parameters
	 *  - onAppData(data)
	 *    - Called when receiving data sent by the host website
	 * 
	 * Code written inside scripts have access to the following attributes:
	 *  - scene
	 *  - program
	 *  - self
	 *    - Same as this reference but global in the script scope
	 *  - Keyboard
	 *  - Mouse
	 *
	 * There is also access to the following functions
	 *  - include
	 *    - Include a javascript file from resources, when including files the user needs to be carefull and clear manually global declarations. The access to this method may be restricted depeding on the include mode 
	 * 
	 * @property code
	 * @type {string}
	 */
	this.code = (code !== undefined) ? code : Script.DEFAULT;

	/**
	 * Mode indicates how to include external javascripts files into the script.
	 *
	 * Can be APPEND, EVALUATE or INCLUDE.
	 *
	 * APPEND mode with append the library code to the script code, when running in this mode the include method cannot be used during runtime
	 *
	 * EVALUATE node with evaluate the library code during runtime, include method may still be used.
	 *
	 * INCLUDE mode will include the file as a global script, these libraries are not unloaded after the script or application is terminated.
	 *
	 * @property mode
	 * @type {number}
	 */
	this.mode = (mode !== undefined) ? mode : Script.APPEND;

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

Script.prototype = Object.create(THREE.Group.prototype);

/**
 * Regular expression to obtain all the include calls placed inside of scripts.
 *
 * @attribute includeRegex
 * @type {RegExp}
 */
Script.includeRegex = /include[ ]*\([ \n]*["'].+?["'][ \n]*\);*/gi;
Script.includeRegexStart = /include[ ]*\([ \n]*["']/gi;
Script.includeRegexEnd = /["'][ \n]*\);*/gi;

/**
 * Default script code used when creating a new Script.
 *
 * @attribute DEFAULT
 * @type {string}
 */
Script.DEFAULT = "function initialize()\n{\n	// TODO <INITIALIZATION CODE>\n}\n\nfunction update(delta)\n{\n	// TODO <UPDATE CODE>\n}\n";

/**
 * List of default methods that can be implemented by scripts.
 *
 * @attribute METHODS
 * @type {Array}
 */
Script.METHODS = ["initialize", "update", "dispose", "onMouseOver", "onResize", "onAppData"];

/**
 * Append libraries on initialization.
 *
 * Libraries are appended to the script code on initialization.
 *
 * @attribute APPEND
 * @type {number}
 */
Script.APPEND = 100;

/**
 * Evaluate libs during runtime.
 *
 * This allows to load new libs during runtime, but its not possible to access private statements.
 *
 * @attribute EVALUATE
 * @type {number}
 */
Script.EVALUATE = 101;

/**
 * Include file into the document.body.
 *
 * This imports the JS file as any other file included into a <script> tag.
 *
 * @attribute INCLUDE
 * @type {number}
 */
Script.INCLUDE = 102;

/**
 * Auxiliar function to include javascript source file from resource into the script.
 *
 * The imported source is evaluated and loaded in the context of the script.
 *
 * Global declarations need to be cleaned using the dipose method.
 *
 * @method include
 * @param {string} name Javascript resource name.
 */

/**
 * Get includes from the code.
 *
 * Used to extract includes from code when loading libraries in APPEND mode.
 *
 * @static
 * @method getIncludes
 * @param {string} code Script code.
 */
Script.getIncludes = function(code)
{
	var results = [];

	// Regex object is statefull and iterates on each exec() call
	var includeRegex = new RegExp(Script.includeRegex, 'gi');

	while(true)
	{
		var match = includeRegex.exec(code);
		if(match === null)
		{
			break;
		}

		// Filter only the resource/library name
		var include = match[0];
		include = include.replace(Script.includeRegexStart, '');
		include = include.replace(Script.includeRegexEnd, '');
		results.push(include);
	}

	return results;
}

/**
 * Remove includes from code.
 *
 * Used to remove include statements when initializing code in APPEND mode.
 *
 * @static
 * @method removeIncludes
 * @param {string} code Script code.
 */
Script.removeIncludes = function(code)
{
	return code.replace(Script.includeRegex, "");
}

/**
 * Initialize script. Automatically called by the runtime.
 *
 * Compiles the script code and calls the script initialize method if it exists after the code is compiled.
 *
 * @method initialize
 */
Script.prototype.initialize = function()
{
	var node = this;
	while(node.parent !== null)
	{
		node = node.parent;
		if(node instanceof Scene)
		{
			this.scene = node;
		}
		else if(node instanceof Program)
		{
			this.program = node;
		}
	}

	THREE.Object3D.prototype.initialize.call(this);

	var self = this;

	this.compileCode(this.code, function()
	{
		if(self.script.initialize !== undefined)
		{
			self.script.initialize.call(self);
		}
	});
};

/**
 * Update script state.
 * 
 * Calls the script update method if it exists.
 * 
 * @method update
 */
Script.prototype.update = function(delta)
{
	if(this.script.onMouseOver !== undefined)
	{
		var intersections = this.scene.raycaster.intersectObjects(this.children, true);
		if(intersections.length > 0)
		{
			this.script.onMouseOver.call(this, intersections);
		}
	}

	if(this.script.update !== undefined)
	{
		this.script.update.call(this, delta);
	}

	THREE.Object3D.prototype.update.call(this, delta);
};

/**
 * Disposes the script, can be used to clear resources when the program exits.
 * 
 * Calls the script dispose method if it exists.
 * 
 * @method dispose
 */
Script.prototype.dispose = function()
{
	if(this.script.dispose !== undefined)
	{
		this.script.dispose.call(this);
	}

	THREE.Object3D.prototype.dispose.call(this);
}

/**
 * Call resize method if available.
 *
 * The resize method receives width and height as arguments.
 * 
 * @method resize
 */
Script.prototype.resize = function(x, y)
{
	if(this.script.onResize !== undefined)
	{
		this.script.onResize.call(this, x, y);
	}
};

/**
 * Call onAppData if available.
 *
 * Called automatically every time external data is passed to the runtime.
 * 
 * @method appData
 * @param {Object} data
 */
Script.prototype.appData = function(data)
{
	if(this.script.onAppData !== undefined)
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
 * @param {string} code
 * @param {Function} onReady Funtion called when the code is ready.
 */
Script.prototype.compileCode = function(code, onReady)
{
	if(code !== undefined)
	{
		this.code = code;
	}

	try
	{
		// Public method declaration
		var code = this.code;
		for(var i = 0; i < Script.METHODS.length; i++)
		{
			var method = Script.METHODS[i];
			code += "\nif(this." + method + " == undefined && typeof " + method + " !== 'undefined'){this." + method + " = " + method + ";}";
		}

		// Append libraries to code
		if(this.mode === Script.APPEND)
		{
			var libs = Script.getIncludes(code);	
			code = Script.removeIncludes(code);

			for(var i = 0; i < libs.length; i++)
			{
				var libCode = this.program.getResourceByName(libs[i]);
				if(libCode === null)
				{
					libCode = FileSystem.readFile(libs[i], true);
					if(libCode !== null)
					{
						code = libCode + "\n" + code;
					}
					else
					{
						throw new Error("Script include() library " + libs[i] + " not found.");
					}
				}
				else
				{
					code = libCode.data + "\n" + code;
				}
			}

			code += "\nfunction include(name)\
			{\
				console.warn(\"nunuStudio: Script running in append mode, \" + name + \" cannot be included in runtime.\");\
			}";
		}
		// Declare include method
		else if(this.mode === Script.EVALUATE)
		{
			code += "\nfunction include(name)\
			{\
				var text = program.getResourceByName(name);\
				if(text === null)\
				{\
					text = FileSystem.readFile(name, true);\
					if(text !== null)\
					{\
						new Function(text).call(this);\
					}\
					else\
					{\
						console.warn(\"nunuStudio: Javascript file \" + name + \" not found.\");\
					}\
				}\
				else\
				{\
					new Function(text.data).call(this);\
				}\
			}";
		}
		// Include
		else if(this.mode === Script.INCLUDE)
		{
			var libs = Script.getIncludes(code);	
			code = Script.removeIncludes(code);

			var libsLoaded = 0;
			var urls = [];

			for(var i = 0; i < libs.length; i++)
			{
				var resource = this.program.getResourceByName(libs[i]);
				if(resource !== null)
				{
					var blob = new Blob([resource.data], {type:"text/plain"});
					urls.push(URL.createObjectURL(blob));
				}
				else
				{
					// Read file content and loade locally to overcome CORS JS script issues.
					var text = FileSystem.readFile(libs[i], true);
					if(text !== null)
					{
						var blob = new Blob([text], {type:"text/plain"});
						urls.push(URL.createObjectURL(blob));
					}
					else
					{
						throw new Error("Script include() library " + libs[i] + " not found.");
					}
				}
			}

			if(urls.length > 0)
			{
				for(var i = 0; i < urls.length; i++)
				{
					var js = document.createElement("script");
					js.type = "text/javascript";
					js.async = true;
					js.src = url;
					js.onload = function()
					{
						libsLoaded++;

						if(libsLoaded === urls.length)
						{
							onReady();
						}
					};
					js.onerror = js.onload;
					document.body.appendChild(js);
				}
			}
			else
			{
				onReady();
			}
		}

		// Evaluate code and create constructor
		var Constructor = new Function("Keyboard, Mouse, self, program, scene", code);

		// Create script object
		try
		{
			this.script = new Constructor(this.program.keyboard, this.program.mouse, this, this.program, this.scene);
		}
		catch(e)
		{
			console.warn("nunuStudio: Error initializing script code", e);
			throw "Error initializing script code";
			this.script = {};
		}

		if(this.mode !== Script.INCLUDE)
		{
			onReady();
		}
	}
	catch(e)
	{
		console.warn("nunuStudio: Error compiling script code", e);
		throw "Error compiling script code";
		this.script = {};
	}
};

Script.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.code = this.code;
	data.object.mode = this.mode;

	return data;
};
