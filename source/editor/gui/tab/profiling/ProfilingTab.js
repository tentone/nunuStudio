"use strict";

/**
 * Profiling tab is used to measure the performance of the application booth in the editor and while it is running.
 *
 * Can measure FPS, CPU usage, memory etc, some metrics may only be available when the editor is running in desktop.
 *
 * @constructor
 * @class ProfilingTab
 * @extends {TabElement}
 * @param parent
 * @param closeable
 * @param container
 * @param index
 */
function ProfilingTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, Locale.profiling, Global.FILE_PATH + "icons/misc/speedometer.png");

	// Canvas
	this.canvas = new Canvas();
}

ProfilingTab.prototype = Object.create(TabElement.prototype);

ProfilingTab.prototype.update = function()
{
	// Renderer info
	var tabs = Editor.gui.tab.getActiveTab();
	for(var i = 0; i < tabs.length; i++)
	{
		var tab = tabs[i];
		var renderer = tab.renderer || (tab.canvas ? tab.canvas.renderer : undefined);
		if(renderer !== undefined)
		{
			var info = renderer.info;
			// TODO <CHANGE THIS>
			//console.log(info);
		}
	}

	// System metrics
	// TODO <ADD CODE HERE>
};

ProfilingTab.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);

};
