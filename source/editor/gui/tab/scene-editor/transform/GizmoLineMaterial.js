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

	this.baseColor = this.color.clone();
	this.baseOpacity = this.opacity;
}

GizmoLineMaterial.prototype = Object.create(THREE.LineBasicMaterial.prototype);

GizmoLineMaterial.red = new GizmoLineMaterial({color: 0xff0000});
GizmoLineMaterial.green = new GizmoLineMaterial({color: 0x00ff00});
GizmoLineMaterial.blue = new GizmoLineMaterial({color: 0x0000ff});
GizmoLineMaterial.yellow = new GizmoLineMaterial({color: 0xFFFF00});
GizmoLineMaterial.grey = new GizmoLineMaterial({color: 0x787878});

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
		this.color.setRGB(1.0, 1.0, 0);
		this.opacity = 1.0;
	}
	else
	{
		this.color.copy(this.baseColor);
		this.opacity = this.baseOpacity;
	}
};