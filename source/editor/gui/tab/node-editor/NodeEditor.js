import {Renderer, Viewport, ViewportControls} from "escher.js/build/escher.module.js";
import {Canvas} from "../../../components/Canvas.js";
import {Global} from "../../../Global.js";
import {Locale} from "../../../locale/LocaleManager.js";
import {SideBar} from "./SideBar.js";
import {TabComponent} from "../../../components/tabs/TabComponent.js";

function NodeEditor(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.about, Global.FILE_PATH + "icons/misc/about.png");

	this.element.style.backgroundColor = "var(--bar-color)";

	/**
	 * Node script being edited in this tab.
	 * 
	 * @attribute graph
	 * @type {NodeScript}
	 */
	this.node = null;

	/**
	 * Side bar contains the buttons to add new nodes into the node editor graph.
	 *
	 * @attribute sideBar
	 * @type {SideBar}
	 */
	this.sideBar = new SideBar(this);

	/**
	 * Canvas used to display the graph.
	 * 
	 * @attribute canvas
	 * @type {Canvas}
	 */
	this.canvas = new Canvas(this);

	/**
	 * Viewport used to display the graph.
	 * 
	 * @attribute canvas
	 * @type {Canvas}
	 */
	this.viewport = new Viewport(this.canvas.element);

	/**
	 * 2D renderer object used to draw the graph editor into the canvas.
	 * 
	 * @attribute renderer
	 * @type {Renderer}
	 */
	this.renderer = new Renderer(this.canvas.element);

	/**
	 * Viewport controls used to control the viewport object.
	 * 
	 * @attribute controls
	 * @type {ViewportControls}
	 */
	this.controls = new ViewportControls(this.viewport);
}

NodeEditor.prototype = Object.create(TabComponent.prototype);

NodeEditor.prototype.updateMetadata = function()
{
	if(this.node !== null)
	{
		this.setName(this.node.name);
	}	
}

NodeEditor.prototype.attach = function(node)
{
	this.node = node;
	this.updateMetadata();
};

NodeEditor.prototype.isAttached = function(node)
{
	return this.node === node;
};

NodeEditor.prototype.update = function()
{
	if(this.node !== null && this.node.graph !== null)
	{
		this.controls.update(this.renderer.pointer);
		this.renderer.update(this.node.graph, this.viewport);
	}
};

NodeEditor.prototype.updateSize = function()
{
	TabComponent.prototype.updateSize.call(this);

	this.sideBar.position.set(0, 0);
	this.sideBar.size.set(40, this.size.y);
	this.sideBar.updateInterface();

	var width = this.size.x - this.sideBar.size.x;
	var height = this.size.y;

	this.canvas.position.set(this.sideBar.size.x, 0);
	this.canvas.size.set(width, height);
	this.canvas.updateInterface();
};

export {NodeEditor};