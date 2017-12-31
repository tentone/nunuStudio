"use strict";

function ProfilingTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Profiling", Editor.filePath + "icons/misc/speedometer.png");

	this.dual = new DualDivisionResizable(this.element);
	this.dual.divA.style.backgroundColor = Editor.theme.barColor;
	this.dual.tabPosition = 0.2;
}

ProfilingTab.prototype = Object.create(TabElement.prototype);

ProfilingTab.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";

		this.dual.size.copy(this.size);
		this.dual.updateInterface();
	}
	else
	{
		this.element.style.display = "none";
	}
};

