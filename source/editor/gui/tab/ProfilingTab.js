"use strict";

function ProfilingTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Profiling", Editor.filePath + "icons/misc/speedometer.png");

	this.dual = new DualDivision(this);
	this.dual.divA.element.style.backgroundColor = Editor.theme.barColor;
	this.dual.divA.element.style.overflow = "auto";
	this.dual.tabPosition = 0.2;

	//Canvas
	this.canvas = new Canvas(this.dual.divB);
	
	//Form
	this.form = new Form(this.dual.divA);

	this.form.addText("Renderer");
	this.form.nextRow();

	this.form.addText("Draw Calls");
	this.calls = this.form.addText("");
	this.form.nextRow();

	this.form.addText("Faces");
	this.faces = this.form.addText("");
	this.form.nextRow();

	this.form.addText("Frame");
	this.frame = this.form.addText("123");
	this.form.nextRow();

	this.form.addText("Points");
	this.points = this.form.addText("123");
	this.form.nextRow();

	this.form.addText("Vertices");
	this.vertices = this.form.addText("123");
	this.form.nextRow();

	this.form.updateInterface();
}

ProfilingTab.prototype = Object.create(TabElement.prototype);

ProfilingTab.prototype.update = function()
{
	var tab = Editor.gui.tab.getActiveTabs();

	if(tab.renderer !== undefined)
	{
		var info = tab.renderer.info;

		this.calls.setText(info.render.calls);
		this.faces.setText(info.render.faces);
		this.frame.setText(info.render.frame);
		this.points.setText(info.render.points);
		this.vertices.setText(info.render.vertices);
	}
};

ProfilingTab.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);
	
	this.dual.size.copy(this.size);
	this.dual.updateInterface();

	this.canvas.size.set(Number.parseInt(this.dual.divB.element.style.width), Number.parseInt(this.dual.divB.element.style.height));
	this.canvas.updateInterface();
};

