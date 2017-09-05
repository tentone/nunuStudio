"use strict";

function AnimationTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Console", Editor.filePath + "icons/misc/console.png");

	//TODO <ADD CODE HERE>
}

AnimationTab.prototype = Object.create(TabElement.prototype);

//Update interface
AnimationTab.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";

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

