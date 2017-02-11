/**
 * Script objects are used to control other objects present in the scene
 * It can access and change every object in the program and supports some events
 *  - initialize
 *    - Called on app initialization
 *  - update
 *    - Called on every frame (after the frame is rendered)
 *  - onMouseOver
 *    - Called on every frame if mouse is on top of one of the script children
 *  - onResize
 *    - Called every time the window is resized
 *  - onAppData
 *    - Called when receiving data sent by the host website
 * 
 * Code written inside scripts have access to the following attributes
 *  - scene
 *  - program
 *  - self
 *    - Same as this reference but global in the script scope
 *  - Keyboard
 *  - Mouse
 * 
 * @class Script
 * @extends {Object}
 * @param {String} code Javascript code to be used by this script
 * @module Script
 */

/**
 * Javascript code attached to the script
 * @property code
 * @type {String}
 */
/**
 * Compiled function used during runtime
 * @attribute script
 * @type {Function}
 */
/**
 * Pointer to the parent program
 * Used access program resources easier
 * @property program
 * @type {Program}
 */
/**
 * Pointer to the parent scene
 * @property scene
 * @type {Scene}
 */
function Script(code)
{
	THREE.Object3D.call(this);
	
	this.type = "Script";
	this.name = "script";

	this.script = null;
	this.code = (code !== undefined) ? code : Script.default 

	this.program = null;
	this.scene = null;
}

Script.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Default script code used when creating a new Script
 * @attribute default
 * @type {String}
 */
Script.default = "this.initialize = function()\n{\n	//TODO <INITIALIZATION CODE>\n};\n\nthis.update = function()\n{\n	//TODO <UPDATE CODE>\n};\n\nthis.onMouseOver = function()\n{\n	//TODO <MOUSE OVER CHILDREN CODE>\n};\n\nthis.onResize = function()\n{\n	//TODO <RESIZE CODE>\n};";//\n\nthis.onExit = function()\n{\n	//TODO <APP EXIT CODE>\n};";

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

	//Compile script
	this.setCode(this.code);	

	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}

	//Initialize script
	if(this.script.initialize !== undefined)
	{
		this.script.initialize.call(this);
	}
}

/**
 * Update script state
 * Calls the script update method if it exists
 * @method update
 */
Script.prototype.update = function()
{
	if(this.script.onMouseOver !== undefined)
	{
		var obj = this.scene.raycaster.intersectObjects(this.children, true);
		if(obj.length > 0)
		{
			this.script.onMouseOver.call(this, obj);
		}
	}

	if(this.script.update !== undefined)
	{
		this.script.update.call(this);
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

/**
 * Call resize method if available
 * @method resize
 */
Script.prototype.resize = function()
{
	if(this.script.onResize !== undefined)
	{
		this.script.onResize.call(this);
	}
}

/**
 * Call onAppData if available
 * @method appData
 * @param {Object} data
 */
Script.prototype.appData = function(data)
{
	if(this.script.onAppData !== undefined)
	{
		this.script.onAppData.call(this);
	}
}

/**
 * Set script code
 * @method setCode
 * @param {String} code
 */
Script.prototype.setCode = function(code)
{
	if(code !== undefined)
	{
		this.code = code;
	}

	//Compile code and create object
	try
	{
		var Constructor = new Function("Keyboard, Mouse, self, program, scene", this.code);

		if(this.program !== null)
		{
			this.script = new Constructor(this.program.keyboard, this.program.mouse, this, this.program, this.scene);
		}
	}
	catch(e)
	{
		console.warn("nunuStudio: Error compiling script code", e);
		this.script = new(function(){})();
	}
}

/**
 * Create JSON for script
 * @param {Object} meta
 * @return {Object} json
 */
Script.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.code = this.code;

	return data;
}