import {NodeSocket, Object2D, Text, Vector2, ColorStyle} from "escher.js/build/escher.module.js";
import {DOMUtils} from "../../../../editor/utils/DOMUtils.js";
import {BaseNode} from "./BaseNode.js";

/**
 * Operation nodes can be used for simple math operations with two input values.
 *
 * @constructor
 * @class OperationNode
 * @param {string} operation Math operation symbol to be performed.
 */
class OperationNode extends BaseNode
{
constructor(operation)
{
super();

this.type = "OperationNode";

/**
 * Math operation performed by this node.
 *
 * @attribute operation
 * @type {string}
 */
this.operation = operation;

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
this.text.strokeStyle = new ColorStyle(DOMUtils.getCSSVariable("--color-light"));
this.text.serializable = false;
this.text.font = "25px Arial";
this.text.layer = 2;
this.add(this.text);
}

registerSockets()
{
if (this.a === null)
{
this.a = this.addInput("string", "a");
}

if (this.b === null)
{
this.b = this.addInput("string", "b");
}

if (this.r === null)
{
this.r = this.addOutput("string", "r");
this.r.getValue = () =>
{
return "(" + this.a.getValue() + this.operation + this.b.getValue() + ")";
};
}
}

onUpdate()
{
super.onUpdate();

this.text.text = this.operation;
}

serialize(recursive)
{
var data = super.serialize(recursive);

data.operation = this.operation;
data.a = this.a !== null ? this.a.uuid : null;
data.b = this.b !== null ? this.b.uuid : null;
data.r = this.r !== null ? this.r.uuid : null;

return data;
}

parse(data, root)
{
super.parse(data, root);

this.operation = data.operation;

if (data.a !== null)
{
this.a = root.getChildByUUID(data.a);
}

if (data.b !== null)
{
this.b = root.getChildByUUID(data.b);
}

if (data.r !== null)
{
this.r = root.getChildByUUID(data.r);
this.r.getValue = () =>
{
return "(" + this.a.getValue() + this.operation + this.b.getValue() + ")";
};
}
}
}

Object2D.register(OperationNode, "OperationNode");

export {OperationNode};
