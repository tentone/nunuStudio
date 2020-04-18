"use strict";

/**
 * Basic material to represent the solid portion of a gizmo.
 *
 * @class GizmoMaterial
 * @extends {THREE.MeshBasicMaterial}
 */
function GizmoMaterial(parameters)
{
	THREE.MeshBasicMaterial.call(this);

	this.depthTest = false;
	this.depthWrite = false;
	this.side = THREE.FrontSide;
	this.transparent = true;

	this.setValues(parameters);

	this.oldColor = this.color.clone();
	this.oldOpacity = this.opacity;
}

GizmoMaterial.prototype = Object.create(THREE.MeshBasicMaterial.prototype);

/**
 * Toggle the highlight state of a gizmo material.
 *
 * @method highlight
 * @param {boolean} highlighted
 */
GizmoMaterial.prototype.highlight = function(highlighted)
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
