"use strict";

/**
 * A editor controls objects is used to control the camera inside of the editor.
 *
 * @class EditorControls
 * @extends {THREE.Group}
 */
function EditorControls()
{
	THREE.Group.call(this);

	/**
	 * Camera object attached to this controls.
	 *
	 * @property camera
	 * @type {Object3D}
	 */
	this.camera = null;
}

EditorControls.prototype = Object.create(THREE.Group.prototype);

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
 * @param {THREE.Object3D} object Object to point camera at.
 */
EditorControls.prototype.focusObject = function(object){};

/** 
 * Set controls orientation, using orientation code form OrientationCube 
 *
 * @method setOrientation
 */
EditorControls.prototype.setOrientation = function(orientation){};

/**
 * Update the orbit controls position.
 * 
 * @method update
 * @param {Mouse} mouse
 * @param {Keyboard} keyboard
 * @param {Number} delta Time passed after from the last update.
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

/**
 * Move the controller to a point.
 * 
 * @method moveTo
 * @param {Vector3} point
 */
EditorControls.prototype.moveTo = function(point){};
