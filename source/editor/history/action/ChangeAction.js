import {Action} from "../Action.js";
import {Editor} from "../../../Editor.js";
import {Text} from "../../../components/Text.js";
import {Material, Texture, Quaternion} from "three";

/**
 * Stores change to one object attribute.
 * 
 * @class ChangeAction
 * @extends {Action}
 * @param {Object} object Object to be changed.
 * @param {string} attribute Name of the attribute.
 * @param {Object} newValue New value for the object attribute.
 * @param {Object} oldValue Optionally we can pass the old value.
 */
function ChangeAction(object, attribute, newValue, oldValue)
{
	Action.call(this);

	this.object = object;
	this.attribute = attribute;
	this.newValue = newValue;
	this.oldValue = oldValue !== undefined ? oldValue : (ChangeAction.isVetorial(object[attribute]) ? object[attribute].clone() : object[attribute]);
}

ChangeAction.prototype.apply = function()
{
	if(ChangeAction.isVetorial(this.object[this.attribute]))
	{
		this.object[this.attribute].copy(this.newValue)
	}
	else
	{
		this.object[this.attribute] = this.newValue;
	}

	ChangeAction.updateGUI(this.object, this.attribute, this.newValue);
};

ChangeAction.prototype.revert = function()
{
	if(ChangeAction.isVetorial(this.object[this.attribute]))
	{
		this.object[this.attribute].copy(this.oldValue)
	}
	else
	{
		this.object[this.attribute] = this.oldValue;
	}

	ChangeAction.updateGUI(this.object, this.attribute, this.oldValue);
};

ChangeAction.updateGUI = function(object, attribute, newValue)
{
	if(object instanceof Material)
	{
		object.needsUpdate = true;
	}
	else if(object instanceof Texture)
	{
		object.needsUpdate = true;
	}

	Editor.updateObjectsViewsGUI();

	if(Editor.isSelected(object))
	{
		Editor.gui.inspector.updateValues();
	}
};

/**
 * Check if a attribute is a THREE vectorial data type.
 * 
 * Vetorial types have some common methods (toArray, copy, fromArray).
 *
 * (Matrix3, Matrix4, Vector2, Vector3, Vector4, Quaternion, Euler).
 * 
 * @static
 * @method isVetorial
 * @param {Object} object To be checked.
 */
ChangeAction.isVetorial = function(object)
{
	if(object === null || object === undefined)
	{
		return false;
	}

	return object.isVector3 === true || object.isEuler === true || (object instanceof Quaternion) || object.isVector2 === true || object.isVector4 === true || object.isMatrix3 === true || object.isMatrix4 === true;
};

export {ChangeAction};