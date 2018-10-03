"use strict";

function MeshPanel(parent, object)
{
	DrawablePanel.call(this, parent, object);

	this.geometry = GeometryForm.create(this.form, this.object);
}

MeshPanel.prototype = Object.create(DrawablePanel.prototype);

MeshPanel.prototype.updatePanel = function()
{
	DrawablePanel.prototype.updatePanel.call(this);
	
	if(this.geometry !== null)
	{
		try
		{
			this.geometry.updateValues();
		}
		catch(e)
		{
			this.geometry.destroy();
			this.geometry = GeometryForm.create(this.form, this.object);
		}
	}
};
