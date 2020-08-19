import {Circle, Node} from "escher.js/build/escher.module.js";

/**
 * Base node are used as a basis for all other nodes, they implement the necessary common functionality for all nodes.
 * 
 * Base nodes add a destructible function with a button which allows the user to destroy them.
 *
 * When the node gets destroyed it automatically gets removed from the graph.
 *
 * @constructor
 * @class BaseNode
 * @module Script
 */
function BaseNode()
{
	Node.call(this);

	/**
	 * Button used to destroy the node and remove it from the graph.
	 * 
	 * @attribute destroyButton
	 * @type {Circle} 
	 */
	this.destroyButton = new Circle();
	this.destroyButton.serializable = false;
	this.destroyButton.layer = 2;
	this.destroyButton.radius = 8;
	this.destroyButton.onButtonDown = () => {
		this.destroy();
	};
	
	this.destroyButton.draw = function(context, viewport, canvas) {
		Circle.prototype.draw.call(this, context, viewport, canvas);

		const size = this.radius * 0.5;
		context.beginPath();
		context.moveTo(-size, -size);
		context.lineTo(size, size);
		context.moveTo(-size, size);
		context.lineTo(size, -size);
		context.stroke();
	};

	this.add(this.destroyButton);
}

BaseNode.prototype.onUpdate = function()
{
	this.destroyButton.position.set(this.box.max.x, this.box.min.y);

	Node.prototype.onUpdate.call(this);
};