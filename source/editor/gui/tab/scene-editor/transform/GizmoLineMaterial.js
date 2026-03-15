import {LineBasicMaterial} from "three";

/**
 * Basic material to represent the line portions of a gizmo.
 *
 * @class GizmoMaterial
 * @extends {LineBasicMaterial}
 */
class GizmoLineMaterial extends LineBasicMaterial {
	constructor(parameters) {
	super();

	this.depthTest = false;
	this.depthWrite = false;
	this.transparent = true;
	this.linewidth = 1;

	this.setValues(parameters);

	this.baseColor = this.color.clone();
	this.baseOpacity = this.opacity;
	}


/**
 * Toggle the highlight state of a gizmo material.
 *
 * @method highlight
 * @param {boolean} highlighted
 */
	highlight(highlighted) {
	if (highlighted)
	{
		this.color.setRGB(1.0, 1.0, 0);
		this.opacity = 1.0;
	}
	else
	{
		this.color.copy(this.baseColor);
		this.opacity = this.baseOpacity;
	}
	}

}

GizmoLineMaterial.red = new GizmoLineMaterial({color: 0xff0000});
GizmoLineMaterial.green = new GizmoLineMaterial({color: 0x00ff00});
GizmoLineMaterial.blue = new GizmoLineMaterial({color: 0x0000ff});
GizmoLineMaterial.yellow = new GizmoLineMaterial({color: 0xFFFF00});
GizmoLineMaterial.grey = new GizmoLineMaterial({color: 0x787878});
export {GizmoLineMaterial};
