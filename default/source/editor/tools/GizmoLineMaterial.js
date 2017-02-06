"use strict";

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

	this.highlight = function(highlighted)
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
}

GizmoLineMaterial.prototype = Object.create(THREE.LineBasicMaterial.prototype);