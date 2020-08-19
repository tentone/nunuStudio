import {Group, Object3D} from "three";

/**
 * Node scripts are build using a graph composed of operations.
 * 
 * @class NodeScript
 * @extends {Object}
 * @module Script
 */
function NodeScript()
{
	Group.call(this);
	
	this.type = "NodeScript";
	this.name = "script";
}

NodeScript.prototype = Object.create(Group.prototype);

/**
 * Initialize script, automatically called by the runtime.
 *
 * Compiles the script code and calls the script initialize method if it exists after the code is compiled.
 *
 * @method initialize
 */
NodeScript.prototype.initialize = function()
{
	Object3D.prototype.initialize.call(this);

	// TODO <ADD CODE HERE>
};

/**
 * Update node script state runs the update methods from the node graph.
 * 
 * @method update
 */
NodeScript.prototype.update = function(delta)
{
	// TODO <ADD CODE HERE>

	Object3D.prototype.update.call(this, delta);
};

/**
 * Disposes the script, can be used to clear resources when the program exits.
 * 
 * Calls the script dispose method if it exists.
 * 
 * @method dispose
 */
NodeScript.prototype.dispose = function()
{
	// TODO <ADD CODE HERE>

	Object3D.prototype.dispose.call(this);
};

/**
 * Call resize method if available.
 *
 * The resize method receives width and height as arguments.
 * 
 * @method resize
 */
NodeScript.prototype.resize = function(x, y)
{
	// TODO <ADD CODE HERE>
};

NodeScript.prototype.toJSON = function(meta)
{
	var data = Object3D.prototype.toJSON.call(this, meta);

	// TODO <ADD CODE HERE>

	return data;
};

export {NodeScript};
