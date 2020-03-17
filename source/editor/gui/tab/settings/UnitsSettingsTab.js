"use strict";

function UnitsSettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, Locale.units, Global.FILE_PATH + "icons/misc/ruler.png");

	this.element.style.overflow = "auto";

	var self = this;

	this.form = new TableForm(this);
	this.form.defaultTextWidth = 125;
	this.form.setAutoSize(false);

	this.form.addText(Locale.units);
	this.form.nextRow();
	
	this.form.addText(Locale.angle);
	this.angle = new DropdownList(this.form);
	this.angle.size.set(150, 18);
	this.angle.addValue(Locale.radians, Settings.RADIAN);
	this.angle.addValue(Locale.degrees, Settings.DEGREE);
	this.angle.setOnChange(function()
	{
		Editor.settings.units.angle = self.angle.getValue();
	});
	this.form.add(this.angle);
	this.form.nextRow();

	this.form.addText(Locale.distance);
	this.distance = new DropdownList(this.form);
	this.distance.size.set(150, 18);
	this.distance.addValue(Locale.meters, Settings.METER);
	this.distance.setOnChange(function()
	{
		Editor.settings.units.distance = self.distance.getValue();
	});
	this.form.add(this.distance);
	this.form.nextRow();
}

UnitsSettingsTab.prototype = Object.create(TabElement.prototype);

UnitsSettingsTab.prototype.activate = function()
{
	this.angle.setValue(Editor.settings.units.angle);
	this.distance.setValue(Editor.settings.units.distance);
}

UnitsSettingsTab.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);
	
	this.form.size.copy(this.size);
	this.form.updateInterface();
};
