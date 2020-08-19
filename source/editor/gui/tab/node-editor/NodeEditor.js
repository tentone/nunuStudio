import {Locale} from "../../locale/LocaleManager.js";
import {Global} from "../../Global.js";
import {TabComponent} from "../../components/tabs/TabComponent.js";
import {Canvas} from "../../components/Canvas.js";
import {SideBar} from "./SideBar.js";

function NodeEditor(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.about, Global.FILE_PATH + "icons/misc/about.png");

	this.element.style.backgroundColor = "var(--bar-color)";

	/** 
	 * Side bar contains the buttons to add new nodes into the node editor graph.
	 *
	 * @attribute sideBar
	 * @type {SideBar}
	 */
	this.sideBar = new SideBar(this);

	this.canvas = new Canvas(this);

	this.group = new Escher.Object2D();

	this.viewport = new Escher.Viewport(this.canvas.element);

	this.renderer = new Escher.Renderer(this.canvas.element);

	this.controls = new Escher.ViewportControls(this.viewport);
}

NodeEditor.prototype = Object.create(TabComponent.prototype);

NodeEditor.prototype.update = function()
{
	this.controls.update(this.renderer.pointer);
	this.renderer.update(this.group, this.viewport);
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