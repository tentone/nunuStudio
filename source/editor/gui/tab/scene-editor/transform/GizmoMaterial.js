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

	this.baseColor = this.color.clone();
	this.baseOpacity = this.opacity;
}

GizmoMaterial.prototype = Object.create(THREE.MeshBasicMaterial.prototype);

GizmoMaterial.red = new GizmoMaterial({color: 0xff0000});
GizmoMaterial.green = new GizmoMaterial({color: 0x00ff00});
GizmoMaterial.blue = new GizmoMaterial({color: 0x0000ff});
GizmoMaterial.yellow = new GizmoMaterial({color: 0xFFFF00});
GizmoMaterial.yellowAlpha = new GizmoMaterial({color: 0xFFFF00, opacity: 0.25});
GizmoMaterial.cyan = new GizmoMaterial({color: 0x00ffff});
GizmoMaterial.cyanAlpha = new GizmoMaterial({color: 0x00ffff, opacity: 0.25});
GizmoMaterial.magenta = new GizmoMaterial({color: 0xff00ff});
GizmoMaterial.magentaAlpha = new GizmoMaterial({color: 0xff00ff, opacity: 0.25});
GizmoMaterial.grey = new GizmoMaterial({color: 0x787878});
GizmoMaterial.whiteAlpha = new GizmoMaterial({color: 0xffffff, opacity: 0.25});

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
		this.color.setRGB(1.0, 1.0, 0);
		this.opacity = 1.0;
	}
	else
	{
		this.color.copy(this.baseColor);
		this.opacity = this.baseOpacity;
	}
};
