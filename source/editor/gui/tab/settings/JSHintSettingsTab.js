"use strict";

function JSHintSettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Javascript", Editor.filePath + "icons/misc/js.png");

	this.element.style.overflow = "auto";

	//Self pointer
	var self = this;

	//Form
	this.form = new Form(this);
	this.form.defaultTextWidth = 125;
	this.form.position.set(5, 5);
	this.form.spacing.set(5, 5);
	
	//Javascript
	this.form.addText("Javascript");
	this.form.nextRow();

	//Bitwise
	this.form.addText("Warn Bitwise").setAltText("Prohibit bitwise operators (&, |, ^, etc.)");
	this.bitwise = new CheckBox(this.form.element);
	this.bitwise.size.set(15, 15);
	this.bitwise.setOnChange(function()
	{
		Editor.settings.jslint.bitwise = self.bitwise.getValue();
	});
	this.form.add(this.bitwise);
	this.form.nextRow();

	//Curly
	this.form.addText("Require curly").setAltText("Require {} for every new block or scope");
	this.curly = new CheckBox(this.form.element);
	this.curly.size.set(15, 15);
	this.curly.setOnChange(function()
	{
		Editor.settings.jslint.curly = self.curly.getValue();
	});
	this.form.add(this.curly);
	this.form.nextRow();

	//Eqeqeq
	this.form.addText("Require ===").setAltText("Require triple equals (===) for comparison");
	this.eqeqeq = new CheckBox(this.form.element);
	this.eqeqeq.size.set(15, 15);
	this.eqeqeq.setOnChange(function()
	{
		Editor.settings.jslint.eqeqeq = self.eqeqeq.getValue();
	});
	this.form.add(this.eqeqeq);
	this.form.nextRow();

	//For...in
	this.form.addText("Filtering for...in").setAltText("Require filtering for..in loops with obj.hasOwnProperty()");
	this.forin = new CheckBox(this.form.element);
	this.forin.size.set(15, 15);
	this.forin.setOnChange(function()
	{
		Editor.settings.jslint.forin = self.forin.getValue();
	});
	this.form.add(this.forin);
	this.form.nextRow();

	//Freeze
	this.form.addText("Freeze").setAltText("Prohibits overwriting prototypes of native objects such as Array, Date etc");
	this.freeze = new CheckBox(this.form.element);
	this.freeze.size.set(15, 15);
	this.freeze.setOnChange(function()
	{
		Editor.settings.jslint.freeze = self.freeze.getValue();
	});
	this.form.add(this.freeze);
	this.form.nextRow();

	//Latedef
	this.form.addText("Late definition").setAltText("Require variables/functions to be defined before being used");
	this.latedef = new CheckBox(this.form.element);
	this.latedef.size.set(15, 15);
	this.latedef.setOnChange(function()
	{
		Editor.settings.jslint.latedef = self.latedef.getValue();
	});
	this.form.add(this.latedef);
	this.form.nextRow();

	//Noarg
	this.form.addText("No arguments").setAltText("Prohibit use of `arguments.caller` and `arguments.callee`");
	this.noarg = new CheckBox(this.form.element);
	this.noarg.size.set(15, 15);
	this.noarg.setOnChange(function()
	{
		Editor.settings.jslint.noarg = self.noarg.getValue();
	});
	this.form.add(this.noarg);
	this.form.nextRow();

	//Nonbsp
	this.form.addText("Non bsp").setAltText("Prohibit non-breaking whitespace characters.");
	this.nonbsp = new CheckBox(this.form.element);
	this.nonbsp.size.set(15, 15);
	this.nonbsp.setOnChange(function()
	{
		Editor.settings.jslint.nonbsp = self.nonbsp.getValue();
	});
	this.form.add(this.nonbsp);
	this.form.nextRow();

	//NoNew
	this.form.addText("No new").setAltText("Prohibit use of constructors for side-effects (without assignment)");
	this.nonew = new CheckBox(this.form.element);
	this.nonew.size.set(15, 15);
	this.nonew.setOnChange(function()
	{
		Editor.settings.jslint.nonew = self.nonew.getValue();
	});
	this.form.add(this.nonew);
	this.form.nextRow();

	//Pluplus
	this.form.addText("Warn ++").setAltText("Prohibit use of ++ and --");
	this.plusplus = new CheckBox(this.form.element);
	this.plusplus.size.set(15, 15);
	this.plusplus.setOnChange(function()
	{
		Editor.settings.jslint.plusplus = self.plusplus.getValue();
	});
	this.form.add(this.plusplus);
	this.form.nextRow();

	//Pluplus
	this.form.addText("Warn Undefined").setAltText("Require all non-global variables to be declared (prevents global leaks)");
	this.undef = new CheckBox(this.form.element);
	this.undef.size.set(15, 15);
	this.undef.setOnChange(function()
	{
		Editor.settings.jslint.undef = self.undef.getValue();
	});
	this.form.add(this.undef);
	this.form.nextRow();

	//Blank Space
	this.form.addText("");
	this.form.nextRow();

	//Relaxing options
	this.form.addText("Relaxing Options");
	this.form.nextRow();

	this.form.addText("No semicolons").setAltText("Tolerate Automatic Semicolon Insertion (no semicolons)");
	this.asi = new CheckBox(this.form.element);
	this.asi.size.set(15, 15);
	this.asi.setOnChange(function()
	{
		Editor.settings.jslint.asi = self.asi.getValue();
	});
	this.form.add(this.asi);
	this.form.nextRow();

	this.form.addText("Assign on compare").setAltText("Tolerate assignments where comparisons would be expected");
	this.boss = new CheckBox(this.form.element);
	this.boss.size.set(15, 15);
	this.boss.setOnChange(function()
	{
		Editor.settings.jslint.boss = self.boss.getValue();
	});
	this.form.add(this.boss);
	this.form.nextRow();

	this.form.addText("Debug statement").setAltText("Allow debugger statements e.g. browser breakpoints.");
	this.debug = new CheckBox(this.form.element);
	this.debug.size.set(15, 15);
	this.debug.setOnChange(function()
	{
		Editor.settings.jslint.debug = self.debug.getValue();
	});
	this.form.add(this.debug);
	this.form.nextRow();

	this.form.addText("Null compare").setAltText("Tolerate use of == null");
	this.eqnull = new CheckBox(this.form.element);
	this.eqnull.size.set(15, 15);
	this.eqnull.setOnChange(function()
	{
		Editor.settings.jslint.eqnull = self.eqnull.getValue();
	});
	this.form.add(this.eqnull);
	this.form.nextRow();

	this.form.addText("ECMAScript Version").setAltText("Specify the ECMAScript version to which the code must adhere");
	this.esversion = new DropdownList(this.form.element);
	this.esversion.size.set(50, 20);
	this.esversion.addValue(5, 5);
	this.esversion.addValue(6, 6);
	this.esversion.setOnChange(function()
	{
		Editor.settings.jslint.esversion = self.esversion.getValue();
	});
	this.form.add(this.esversion);
	this.form.nextRow();

	this.form.addText("Allow moz").setAltText("Allow Mozilla specific syntax (extends and overrides esnext features)");
	this.moz = new CheckBox(this.form.element);
	this.moz.size.set(15, 15);
	this.moz.setOnChange(function()
	{
		Editor.settings.jslint.moz = self.moz.getValue();
	});
	this.form.add(this.moz);
	this.form.nextRow();

	this.form.addText("Allow eval").setAltText("Tolerate use of eval() and new Function()");
	this.evil = new CheckBox(this.form.element);
	this.evil.size.set(15, 15);
	this.evil.setOnChange(function()
	{
		Editor.settings.jslint.evil = self.evil.getValue();
	});
	this.form.add(this.evil);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

JSHintSettingsTab.prototype = Object.create(TabElement.prototype);

//Activate
JSHintSettingsTab.prototype.activate = function()
{
	this.bitwise.setValue(Editor.settings.jslint.bitwise);
	this.curly.setValue(Editor.settings.jslint.curly);
	this.eqeqeq.setValue(Editor.settings.jslint.eqeqeq);
	this.forin.setValue(Editor.settings.jslint.forin);
	this.freeze.setValue(Editor.settings.jslint.freeze);
	this.latedef.setValue(Editor.settings.jslint.latedef);
	this.noarg.setValue(Editor.settings.jslint.noarg);
	this.nonbsp.setValue(Editor.settings.jslint.nonbsp);
	this.nonew.setValue(Editor.settings.jslint.nonew);
	this.plusplus.setValue(Editor.settings.jslint.plusplus);
	this.undef.setValue(Editor.settings.jslint.undef);

	this.asi.setValue(Editor.settings.jslint.asi);
	this.boss.setValue(Editor.settings.jslint.boss);
	this.debug.setValue(Editor.settings.jslint.debug);
	this.eqnull.setValue(Editor.settings.jslint.eqnull);
	this.esversion.setValue(Editor.settings.jslint.esversion);
	this.moz.setValue(Editor.settings.jslint.moz);
	this.evil.setValue(Editor.settings.jslint.evil);
};
