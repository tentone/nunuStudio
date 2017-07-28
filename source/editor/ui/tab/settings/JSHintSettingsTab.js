"use strict";

function JSHintSettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "JSHint", Editor.filePath + "icons/misc/js.png");

	this.element.style.overflow = "auto";

	//Self pointer
	var self = this;

	//Form
	this.form = new Form(this.element);
	this.form.defaultTextWidth = 125;
	this.form.position.set(5, 5);
	this.form.spacing.set(5, 5);
	
	//Renderer settings
	this.form.addText("JSHint");
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

JSHintSettingsTab.prototype = Object.create(TabElement.prototype);

//Activate
JSHintSettingsTab.prototype.activate = function()
{
	//TODO <UPDATE OPTIONS HERE>
};

//Update division Size
JSHintSettingsTab.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		//Element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
