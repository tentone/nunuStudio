"use strict";

function EditorControls(){}

/**
 * Attach a camera to this controls object.
 *
 * @method attach
 * @param {Camera} camera
 */
EditorControls.prototype.attach = function(camera){};

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
 * @param Mouse mouse
 */
EditorControls.prototype.update = function(mouse, keyboard){};

/**
 * Update controls position and rotation.
 *
 * Should be called if some of its properties are changed manually.
 * 
 * @method updateControls
 */
EditorControls.prototype.updateControls = function(){};
