"use strict";

//TODO <NOT BEING USED>

function ProfilingTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Profiling", Editor.FILE_PATH + "icons/misc/speedometer.png");

	//Canvas
	this.canvas = new Canvas();
	
	//Form
	this.form = new TableForm();
	this.form.setAutoSize(false);
	this.form.addText("Renderer");
	this.form.nextRow();

	this.form.addText("Draw Calls");
	this.calls = this.form.addText("");
	this.form.nextRow();

	this.form.addText("Faces");
	this.faces = this.form.addText("");
	this.form.nextRow();

	this.form.addText("Frame");
	this.frame = this.form.addText("");
	this.form.nextRow();

	this.form.addText("Points");
	this.points = this.form.addText("");
	this.form.nextRow();

	this.form.addText("Vertices");
	this.vertices = this.form.addText("");
	this.form.nextRow();

	//Container
	this.dual = new DualContainer(this);
	this.dual.tabPosition = 0.2;
	this.dual.attachA(this.canvas);
	this.dual.attachA(this.form);
}

ProfilingTab.prototype = Object.create(TabElement.prototype);

ProfilingTab.prototype.update = function()
{
	var tabs = Editor.gui.tab.getActiveTab();
	
	for(var i = 0; i < tabs.length; i++)
	{
		var tab = tabs[i];

		if(tab.renderer !== undefined)
		{
			var info = tab.renderer.info;

			this.calls.setText(info.render.calls);
			this.faces.setText(info.render.faces);
			this.frame.setText(info.render.frame);
			this.points.setText(info.render.points);
			this.vertices.setText(info.render.vertices);
		}
	}
};

ProfilingTab.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);
	
	this.dual.size.copy(this.size);
	this.dual.updateInterface();
};
