"use strict";

function NodesTab(parent, closeable, container, index)
{

	TabElement.call(this, parent, closeable, container, index, "Blueprint", Editor.filePath + "icons/script/blocks.png");

	this.element.style.backgroundColor = Editor.theme.barColor;

	this.canvas = document.createElement("canvas");
	this.canvas.id = "nodeed";
	this.canvas.width = "683";
	this.canvas.height= "491";
	this.element.appendChild(this.canvas);

	this.graph = new LGraph();

	this.lcanvas = new LGraphCanvas("#nodeed", this.graph);

	this.graph.start();
}

NodesTab.prototype = Object.create(TabElement.prototype);

NodesTab.prototype.getNodes = function() {
	return this.graph.serialize();
}

NodesTab.prototype.setNodes = function(nodes) {
	this.graph.setFromString(nodes);
}

NodesTab.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);

	this.canvas.width = (this.size.x) + "px";
	this.canvas.height = (this.size.y) + "px";
};
