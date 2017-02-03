"use strict";

function TextureTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Texture", "editor/files/icons/misc/image.png");

	this.Texture = null;

	//this.division = new DualDivisionResizable(this.element);
}

TextureTab.prototype = Object.create(TabElement.prototype);

//Check if texture is attached to tab
TextureTab.prototype.isAttached = function(texture)
{
	return this.texture === texture;
}

//Activate
TextureTab.prototype.activate = function()
{
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();
	
	//Mouse.setCanvas(this.canvas.element);
}

//Update object data
TextureTab.prototype.updateMetadata = function()
{
	if(this.texture !== null)
	{
		//Set name
		if(this.texture.name !== undefined)
		{
			this.setName(this.texture.name);
		}

		//If not found close tab
		if(Editor.program.textures[this.texture.uuid] === undefined)
		{
			this.close();
		}
	}
}

//Attach texure
TextureTab.prototype.attach = function(texture)
{
	this.texture = texture;
	this.updateMetadata();

	//TODO <UPDATE TEXTURE FORM>
};

//Update division Size
TextureTab.prototype.updateInterface = function()
{
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
	
	//Dual division
	//this.division.visible = this.visible;
	//this.division.size.copy(this.size);
	//this.division.updateInterface();

	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
