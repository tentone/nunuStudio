"use strict";

function CameraEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "camera", "editor/files/icons/camera/camera.png");

	this.camera = null;

	//TODO <ADD CODE HERE>
}

CameraEditor.prototype = Object.create(TabElement.prototype);

CameraEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	//TODO <ADD CODE HERE>
};

CameraEditor.prototype.updateMetadata = function()
{
	if(this.camera !== null)
	{
		var camera = this.camera;

		this.setName(camera.name);

		var found = false;
		Editor.program.traverse(function(obj)
		{
			if(obj.uuid === camera.uuid)
			{
				found = true;
			}
		});

		if(!found)
		{
			this.close();
		}
	}
}

CameraEditor.prototype.attach = function(camera)
{
	this.camera = camera;
	this.updateMetadata();
}

CameraEditor.prototype.isAttached = function(camera)
{
	return this.camera === camera;
}

CameraEditor.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		//TODO <ADD CODE HERE>

		//Update base element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
}
