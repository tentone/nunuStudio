import {Program} from "../Program.js";
import {Mouse} from "../../input/Mouse.js";
import {Keyboard} from "../../input/Keyboard.js";
import {Key} from "../../input/Key.js";
import {Button} from "../../../editor/components/buttons/Button.js";
import {Group, Vector2, Vector3, Object3D, Matrix4} from "three";

/**
 * First person controls can be controlled using the mouse and keyboard.
 *
 * Provides a navigations system familiar to the one found on FPS games.
 * 
 * The mouse left button can be used to look around, and the keyboard arrows for movement.
 * 
 * @class FirstPersonControls
 * @extends {Group}
 * @module Controls
 */
function FirstPersonControls()
{
	Group.call(this);

	this.name = "controls";
	this.type = "FirstPersonControls";

	/**
	 * Mouse sensitivity.
	 * 
	 * @property sensitivity
	 * @type {number}
	 */
	this.sensitivity = 0.005;

	/**
	 * Flag to indicate if the button left button needs to be pressed to rotate the object.
	 * 
	 * @property needsButtonPressed
	 * @default true
	 * @type {boolean}
	 */
	this.needsButtonPressed = true;

	/**
	 * Indicates if its possible to move the object using the Keyboard keys.
	 * 
	 * @property movementEnabled
	 * @default true
	 * @type {boolean}
	 */
	this.movementEnabled = true;

	/**
	 * Movement speed, relative to the world.
	 * 
	 * @property moveSpeed
	 * @default moveSpeed
	 * @type {number}
	 */
	this.moveSpeed = 0.05;

	/**
	 * If set to true the object will only move on X and Z axis.
	 * 
	 * @property moveOnPlane
	 * @default false
	 * @type {boolean}
	 */
	this.moveOnPlane = false;

	/**
	 * Array with keys to be used to move the object.
	 *  - Forward
	 *  - Backward
	 *  - Left
	 *  - Right
	 * 
	 * @property moveKeys
	 * @type {Array}
	 */
	this.moveKeys = [Keyboard.W, Keyboard.S, Keyboard.A, Keyboard.D];
	
	/**
	 * Orientation of the camera.
	 *
	 * X is the horizontal orientation and Y the vertical orientation.
	 *
	 * @property vector
	 * @type {Vector2}
	 */	
	this.vector = new Vector2(0, 0);

	this.mouse = null;
	this.keyboard = null;

	this.tempVector = new Vector3();
}

FirstPersonControls.UP = new Vector3(0, 1, 0);

FirstPersonControls.prototype = Object.create(Group.prototype);

FirstPersonControls.prototype.initialize = function()
{
	var node = this;
	while(node.parent !== null)
	{
		node = node.parent;

		if(node instanceof Program)
		{
			this.mouse = node.mouse;
			this.keyboard = node.keyboard;
		}
	}

	this.updateControls();
	
	Group.prototype.initialize.call(this);
};

FirstPersonControls.prototype.update = function(delta)
{
	if(!this.needsButtonPressed || this.mouse.buttonPressed(Mouse.LEFT))
	{
		this.vector.y -= this.sensitivity * this.mouse.delta.y;
		this.vector.x -= this.sensitivity * this.mouse.delta.x;

		if(this.vector.y < -1.57)
		{
			this.vector.y = -1.57;
		}
		else if(this.vector.y > 1.57)
		{
			this.vector.y = 1.57;
		}

		this.updateControls();
	}

	if(this.movementEnabled)
	{
		if(this.keyboard.keyPressed(this.moveKeys[0]))
		{
			var direction = this.getWorldDirection(this.tempVector);
			if(this.moveOnPlane)
			{
				direction.y = 0;
			}
			direction.normalize();
			direction.multiplyScalar(this.moveSpeed);
			this.position.sub(direction);
		}
		if(this.keyboard.keyPressed(this.moveKeys[1]))
		{
			var direction = this.getWorldDirection(this.tempVector);
			if(this.moveOnPlane)
			{
				direction.y = 0;
			}
			direction.normalize();
			direction.multiplyScalar(this.moveSpeed);
			this.position.add(direction);
		}
		if(this.keyboard.keyPressed(this.moveKeys[2]))
		{
			var direction = new Vector3(Math.sin(this.vector.x - 1.57), 0, Math.cos(this.vector.x - 1.57));
			direction.normalize();
			direction.multiplyScalar(this.moveSpeed);
			this.position.sub(direction);
		}
		if(this.keyboard.keyPressed(this.moveKeys[3]))
		{
			var direction = new Vector3(Math.sin(this.vector.x + 1.57), 0, Math.cos(this.vector.x + 1.57));
			direction.normalize();
			direction.multiplyScalar(this.moveSpeed);
			this.position.sub(direction);
		}
	}
	
	Object3D.prototype.update.call(this, delta);
};

/**
 * Update controls position and rotation.
 *
 * Should be called if some of its properties are changed manually.
 *
 * @method updateControls
 */
FirstPersonControls.prototype.updateControls = function()
{
	var cos = Math.cos(this.vector.y);
	var direction = new Vector3(Math.sin(this.vector.x) * cos, Math.sin(this.vector.y), Math.cos(this.vector.x) * cos);
	direction.add(this.position);

	var matrix = new Matrix4();
	matrix.lookAt(this.position, direction, FirstPersonControls.UP);
	this.quaternion.setFromRotationMatrix(matrix);
};

/**
 * Used to get camera direction for this controller.
 *
 * Controller direction can be used to simplify controlling physics objects, create objects in the camera direction, etc.
 *
 * @method getDirection
 * @return {Vector3} Normalized camera direction. 
 */
FirstPersonControls.prototype.getDirection = function()
{
	var direction = this.getWorldDirection(this.tempVector);
	direction.normalize();
	return direction;
};

FirstPersonControls.prototype.toJSON = function(meta)
{
	var data = Object3D.prototype.toJSON.call(this, meta);

	data.object.moveSpeed = this.moveSpeed;
	data.object.sensitivity = this.sensitivity;
	data.object.needsButtonPressed = this.needsButtonPressed;
	data.object.movementEnabled = this.movementEnabled;
	data.object.moveOnPlane = this.moveOnPlane;
	data.object.moveKeys = this.moveKeys;
	
	return data;
};
export {FirstPersonControls};