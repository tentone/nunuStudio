import {Locale} from "../../../locale/LocaleManager.js";
import {Global} from "../../../Global.js";
import {Editor} from "../../../Editor.js";
import {TabComponent} from "../../../components/tabs/TabComponent.js";
import {Component} from "../../../components/Component.js";
import {Canvas} from "../../../components/Canvas.js";

/**
 * Profiling tab is used to measure the performance of the application booth in the editor and while it is running.
 *
 * Can measure FPS, CPU usage, memory etc, some metrics may only be available when the editor is running in desktop.
 *
 * @constructor
 * @class ProfilingTab
 * @extends {TabComponent}
 * @param parent
 * @param closeable
 * @param container
 * @param index
 */
function ProfilingTab(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.profiling, Global.FILE_PATH + "icons/misc/speedometer.png");

	// Canvas
	this.canvas = new Canvas();
}

ProfilingTab.prototype = Object.create(TabComponent.prototype);

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
	TabComponent.prototype.updateSize.call(this);

};

export {ProfilingTab};