"use strict";

/**
 * Basic material to represent the line portions of a gizmo.
 *
 * @class GizmoMaterial
 * @extends {THREE.LineBasicMaterial}
 */
function GizmoLineMaterial(parameters)
{
	THREE.LineBasicMaterial.call(this);

	this.depthTest = false;
	this.depthWrite = false;
	this.transparent = true;
	this.linewidth = 1;

	this.setValues(parameters);

	this.oldColor = this.color.clone();
	this.oldOpacity = this.opacity;
}

GizmoLineMaterial.prototype = Object.create(THREE.LineBasicMaterial.prototype);

/**
 * Toggle the highlight state of a gizmo material.
 *
 * @method highlight
 * @param {boolean} highlighted
 */
GizmoLineMaterial.prototype.highlight = function(highlighted)
{
	if(highlighted)
	{
		this.color.setRGB(1, 1, 0);
		this.opacity = 1;
	}
	else
	{
		this.color.copy(this.oldColor);
		this.opacity = this.oldOpacity;
	}
};