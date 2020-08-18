import {Locale} from "../../locale/LocaleManager.js";
import {Global} from "../../Global.js";
import {TabComponent} from "../../components/tabs/TabComponent.js";
import {Canvas} from "../../components/Canvas.js";
import {Component} from "../../components/Component.js";

function NodeEditor(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.about, Global.FILE_PATH + "icons/misc/about.png");

	this.element.style.backgroundColor = "var(--bar-color)";

	this.sideBar = new Component(this, "div");

	this.canvas = new Canvas(this);

}

NodeEditor.prototype = Object.create(TabComponent.prototype);
export {NodeEditor as AboutTab};