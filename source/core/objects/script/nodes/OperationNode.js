import {NodeSocket, Object2D, Text, Vector2} from "escher.js/build/escher.module.js";
import {BaseNode} from "./BaseNode.js";

/**
 * Operation nodes can be used for simple math operations with two input values.
 * 
 * @constructor
 * @class OperationNode
 * @param {string} operation Math operation symbol to be performed.
 * @param {string} label Label of the node.
 */
function OperationNode(operation, label)
{
    BaseNode.call(this);

    this.type = "OperationNode";

	/**
	 * Math operation performed by this node.
	 */
    this.operation = operation;

    /**
	 * Label shown to the user in th graph.
	 */
    this.label = label;

    this.box.set(new Vector2(-50, -35), new Vector2(50, 35));

    /**
     * Input node socket a.
     * 
     * @attribute a
     * @type {NodeSocket}
     */
    this.a = null;
    
    /**
     * Input node socket b.
     * 
     * @attribute b
     * @type {NodeSocket}
     */
    this.b = null;

    /**
     * Output node socket r with the result.
     * 
     * @attribute r
     * @type {NodeSocket}
     */
	this.r = null;
	
    this.text = new Text();
    this.text.serializable = false;
    this.text.font = "25px Arial";
    this.text.layer = 2;
    this.add(this.text);
}

OperationNode.prototype = Object.create(BaseNode.prototype)

OperationNode.prototype.registerSockets = function()
{
    if(this.a === null)
    {
        this.a = this.addInput("string", "a");
    }

    if(this.b === null)
    {
        this.b = this.addInput("string", "b");
    }

    if(this.r === null)
    {
        this.r = this.addOutput("string", "r");
        this.r.getValue = () => {
            return "(" + this.a.getValue() + this.operation + this.b.getValue() + ")";
        };
    }
};

OperationNode.prototype.onUpdate() = function()
{
    BaseNode.prototype.onUpdate.call(this);

    this.text.text = this.label;
};

OperationNode.prototype.serialize(recursive) = function()
{
    var data = BaseNode.prototype.serialize.call(this, recursive);

    data.operation = this.operation;
    data.label = this.label;
    data.a = this.a !== null ? this.a.uuid : null;
    data.b = this.b !== null ? this.b.uuid : null;
    data.r = this.r !== null ? this.r.uuid : null;

    return data;
};

OperationNode.prototype.parse(data, root) = function()
{
    BaseNode.prototype.parse.call(this, data, root);

    this.operation = data.operation;
    this.label = data.label;

    if(data.a !== null)
    {
        this.a = root.getChildByUUID(data.a);
    }

    if(data.b !== null)
    {
        this.b = root.getChildByUUID(data.b);
    }

    if(data.r !== null)
    {
        this.r = root.getChildByUUID(data.r);
        this.r.getValue = () =>
        {
            return "(" + this.a.getValue() + this.operation + this.b.getValue() + ")";
        };
    }
};

Object2D.register(OperationNode, "OperationNode");

