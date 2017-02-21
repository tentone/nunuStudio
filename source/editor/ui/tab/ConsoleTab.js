"use strict";

function ConsoleTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Console", "editor/files/icons/misc/console.png");

	//TODO <ADD CODE HERE>
}

ConsoleTab.prototype = Object.create(TabElement.prototype);

//Update division Size
ConsoleTab.prototype.updateInterface = function()
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
