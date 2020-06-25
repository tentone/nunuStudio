import {Mouse} from "../../../../../core/input/Mouse.js";
import {Keyboard} from "../../../../../core/input/Keyboard.js";
import {Key} from "../../../../../core/input/Key.js";
import {OrientationCube} from "../utils/OrientationCube.js";
import {Editor} from "../../../../Editor.js";
import {Group, Object3D} from "three";

/**
 * A editor controls objects is used to control the camera inside of the editor.
 *
 * @class EditorControls
 * @extends {Group}
 */
function EditorControls()
{
	Group.call(this);

	/**
	 * Camera object attached to this controls.
	 *
	 * @property camera
	 * @type {Object3D}
	 */
	this.camera = null;
}

EditorControls.prototype = Object.create(Group.prototype);

/**
 * Attach a camera to this controls object.
 *
 * @method attach
 * @param {Camera} camera
 */
EditorControls.prototype.attach = function(camera)
{
	while(this.children.length > 0)
	{
		this.remove(this.children[0]);
	}
	this.add(camera);

	this.camera = camera;
	this.updateControls();
};

/**
 * Reset the controls to its original position.
 * 
 * @method reset
 */
EditorControls.prototype.reset = function(){};

/** 
 * Focus camera on a object.
 * 
 * @method focusObject
 * @param {Object3D} object Object to point camera at.
 */
EditorControls.prototype.focusObject = function(object){};

/** 
 * Set controls orientation, using orientation code form OrientationCube 
 *
 * @method setOrientation
 */
EditorControls.prototype.setOrientation = function(orientation){};

/**
 * Update the orbit controls position, the keyboard movement should be optional.
 * 
 * @method update
 * @param {Mouse} mouse
 * @param {Keyboard} keyboard
 * @param {number} delta Time passed after from the last update.
 */
EditorControls.prototype.update = function(mouse, keyboard, delta){};

/**
 * Update controls position and rotation.
 *
 * Should be called if some of its properties are changed manually.
 * 
 * @method updateControls
 */
EditorControls.prototype.updateControls = function(){};

export {EditorControls};