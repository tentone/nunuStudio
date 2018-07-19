/**
 * Script objects are used to control other objects present in the scene.
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
 *    - Include a javascript file from resources, when including files the user needs to be carefull and clear manually global declarations
 * 
 * @class Script
 * @extends {Object}
 * @param {String} code Javascript code to be used by this script
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
	 * @property code
	 * @type {String}
	 */
	this.code = (code !== undefined) ? code : Script.DEFAULT;

	/**
	 * Mode indicates how to include external javascripts files into the script.
	 *
	 * Can be Script.APPEND, Script.EVALUATE or Script.INCLUDE.
	 *
	 * @property mode
	 * @type {Number}
	 */
	this.mode = (mode !== undefined) ? mode : Script.APPEND;

	/**
	 * Compiled function used during runtime.
	 *
	 * @attribute script
	 * @type {Function}
	 */
	this.script = {};

	/**
	 * Pointer to the parent program.
	 *
	 * Used access program resources easier.
	 *
	 * @property program
	 * @type {Program}
	 */
	this.program = null;

	/**
	 * Pointer to the parent scene.
	 *
	 * @property scene
	 * @type {Scene}
	 */
	this.scene = null;
}

Script.prototype = Object.create(THREE.Group.prototype);

/**
 * Default script code used when creating a new Script.
 * @attribute DEFAULT
 * @type {String}
 */
Script.DEFAULT = "function initialize()\n{\n	//TODO <INITIALIZATION CODE>\n}\n\nfunction update()\n{\n	//TODO <UPDATE CODE>\n}\n";

/**
 * List of methods that a script can implement.
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
 * @type {Number}
 */
Script.APPEND = 100;

/**
 * Evaluate libs during runtime.
 *
 * This allows to load new libs during runtime, but its not possible to access private statements.
 *
 * @attribute EVALUATE
 * @type {Number}
 */
Script.EVALUATE = 101;

/**
 * Include file into the document.body.
 *
 * This imports the JS file as any other file included into a <script> tag.
 *
 * @attribute INCLUDE
 * @type {Number}
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
 * @param {String} name Javascript resource name.
 */

/**
 * Get includes from the code.
 *
 * Used to extract includes from code when loading libraries in APPEND mode.
 *
 * @static
 * @method getIncludes
 * @param {String} code Script code.
 */
Script.getIncludes = function(code)
{
	var results = [];

	var index = code.search(/include\(".+?"\);/gi);
	if(index !== -1)
	{
		var sub = code.substring(index);
		var end = sub.indexOf("\");");
		var include = sub.substring(9, end);

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
 * @param {String} code Script code.
 */
Script.removeIncludes = function(code)
{
	return code.replace(/include\(".+?"\);/gi, "");
}

/**
 * Initialize script
 * Automatically called by the runtime
 * Calls the script initialize method if it exists
 * @method initialize
 */
Script.prototype.initialize = function()
{
	//Program and scene
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

	//Initialize children
	THREE.Object3D.prototype.initialize.call(this);

	var self = this;

	//Compile script
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

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].resize(x, y);
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
 * Set script code.
 * 
 * Can be used to dinamically change the script code. However it is not recommended can lead to undefined behavior.
 * 
 * @method compileCode
 * @param {String} code
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
		//Public method declaration
		var code = this.code;
		for(var i = 0; i < Script.METHODS.length; i++)
		{
			var method = Script.METHODS[i];
			code += "\nif(this." + method + " == undefined && typeof " + method + " !== 'undefined'){this." + method + " = " + method + ";}";
		}

		//Append libraries to code
		if(this.mode === Script.APPEND)
		{
			var libs = Script.getIncludes(code);	
			code = Script.removeIncludes(code);

			for(var i = 0; i < libs.length; i++)
			{
				code = this.program.getResourceByName(libs[i]).data + "\n" + code;
			}

			code += "\nfunction include(name)\
			{\
				console.warn(\"nunuStudio: Script running in append mode \" + name);\
			}";
		}
		//Declare include method
		else if(this.mode === Script.EVALUATE)
		{
			code += "\nfunction include(name)\
			{\
				var text = program.getResourceByName(name);\
				if(text !== null)\
				{\
					new Function(text.data).call(this);\
				}\
				else\
				{\
					console.warn(\"nunuStudio: Javascript file \" + name + \" not found in resources\");\
				}\
			}";
		}
		//Include
		else if(this.mode === Script.INCLUDE)
		{
			var libs = Script.getIncludes(code);	
			code = Script.removeIncludes(code);

			var fileCounter = 0;

			for(var i = 0; i < libs.length; i++)
			{
				var blob = new Blob([this.program.getResourceByName(libs[i]).data], {type:"text/plain"});
				var url = URL.createObjectURL(blob);

				var js = document.createElement("script");
				js.type = "text/javascript";
				js.async = false;
				js.src = url;
				js.onload = function()
				{
					fileCounter++;

					if(fileCounter === libs.length)
					{
						onReady();
					}
				};
				js.onerror = js.onload;
				document.body.appendChild(js);
			}
		}

		//Evaluate code and create constructor
		var Constructor = new Function("Keyboard, Mouse, self, program, scene", code);

		//Create script object
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

/**
 * Create JSON for script.
 *
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
Script.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.code = this.code;
	data.object.mode = this.mode;

	return data;
};
