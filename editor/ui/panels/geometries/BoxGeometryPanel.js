"use strict";

function BoxGeometryPanel(parent)
{
	Panel.call(this, parent);

	var self = this;

	//BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
	
	this.form.addText("Size");
	this.size = new CoordinatesBox(this.form.element);
	this.size.setOnChange(function()
	{
		//TODO <ADD CODE HERE>
	});
	this.form.add(this.size);
	this.form.nextRow();

	this.form.addText("Segments");
	this.segments = new CoordinatesBox(this.form.element);
	this.segments.setOnChange(function()
	{
		//TODO <ADD CODE HERE>
	});
	this.form.add(this.segments);
	this.form.nextRow();

	this.buffered = new CheckBox(this.form.element);
	this.buffered.setText("Buffered");
	this.buffered.size.set(200, 15);
	this.buffered.setOnChange(function()
	{
		//TODO <ADD CODE HERE>
	});
	this.form.add(this.buffered);


	this.form.updateInterface();
}

BoxGeometryPanel.prototype = Object.create(Panel.prototype);

BoxGeometryPanel.prototype.updatePanel = function()
{
	if(this.obj !== null)
	{

	}
}
