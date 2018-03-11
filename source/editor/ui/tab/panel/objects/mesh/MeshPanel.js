"use strict";

function MeshPanel(parent, obj)
{
	ObjectPanel.call(this, parent, obj);

	this.geometry = GeometryForm.create(this.form, this.obj);
}

MeshPanel.prototype = Object.create(ObjectPanel.prototype);

MeshPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	if(this.geometry !== null)
	{
		this.geometry.updateValues();
	}
};
