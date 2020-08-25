import {Group, Object3D} from "three";
import {NodeGraph} from "escher.js/build/escher.module.js";

/**
 * Node scripts are build using a graph composed of operations.
 * 
 * They can be used to create interaction without requiring any coding, logic can be build from provided blocks.
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

	/**
	 * Node graph that composes this script.
	 * 
	 * @attribute graph
	 * @type {NodeGraph}
	 */
	this.graph = new NodeGraph();
}

NodeScript.prototype = Object.create(Group.prototype);

/**
 * Add a node the graph, these nodes can be connected with other already existing nodes in the graph.
 * 
 * @param {Node} node Node to be added into the graph.
 */
NodeScript.prototype.addNode = function(node)
{
	this.graph.addNode(node);
};

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

	data.object.graph = this.graph.serialize();

	return data;
};

export {NodeScript};
