"use strict";

function CodeSettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Code Editor", Editor.filePath + "icons/script/script.png");
	
	this.element.style.overflow = "auto";

	//Self pointer
	var self = this;

	//Form
	this.form = new Form(this.element);
	this.form.defaultTextWidth = 125;
	this.form.position.set(5, 5);
	this.form.spacing.set(5, 5);

	//Code editor text
	this.form.addText("Code Editor");
	this.form.nextRow();

	//Code Theme
	this.form.addText("Editor theme");
	this.codeTheme = new DropdownList(this.form.element);
	this.codeTheme.size.set(120, 20);
	this.codeTheme.setOnChange(function()
	{
		Settings.code.theme = self.codeTheme.getValue();
	});
	this.form.add(this.codeTheme);
	this.form.nextRow();

	var themes = CodemirrorThemes.list;
	for(var i = 0; i < themes.length; i++)
	{
		this.codeTheme.addValue(themes[i], themes[i]);
	}

	//Code keymap
	this.form.addText("Key bindings");
	this.codeKeymap = new DropdownList(this.form.element);
	this.codeKeymap.size.set(120, 20);
	this.codeKeymap.addValue("codemirror", "default");
	this.codeKeymap.addValue("sublime", "sublime");
	this.codeKeymap.addValue("vim", "vim");
	this.codeKeymap.addValue("emacs", "emacs");
	this.codeKeymap.setOnChange(function()
	{
		Settings.code.keymap = self.codeKeymap.getValue();
	});
	this.form.add(this.codeKeymap);
	this.form.nextRow();

	//Code font size
	this.form.addText("Font size");
	this.codeFontSize = new NumberBox(this.form.element);
	this.codeFontSize.size.set(60, 18);
	this.codeFontSize.setRange(5, 99999);
	this.codeFontSize.setStep(1);
	this.codeFontSize.setOnChange(function()
	{
		Settings.code.fontSize = self.codeFontSize.getValue();
	});
	this.form.add(this.codeFontSize);
	this.form.nextRow();

	//Show line numbers
	this.form.addText("Show line number");
	this.codeLineNumbers = new CheckBox(this.form.element);
	this.codeLineNumbers.size.set(15, 15);
	this.codeLineNumbers.setOnChange(function()
	{
		Settings.code.lineNumbers = self.codeLineNumbers.getValue();
	});
	this.form.add(this.codeLineNumbers);
	this.form.nextRow();

	//Line wrapping
	this.form.addText("Line wrap");
	this.codeLineWrapping = new CheckBox(this.form.element);
	this.codeLineWrapping.size.set(15, 15);
	this.codeLineWrapping.setOnChange(function()
	{
		Settings.code.lineWrapping = self.codeLineWrapping.getValue();
	});
	this.form.add(this.codeLineWrapping);
	this.form.nextRow();

	//Auto close brackets
	this.form.addText("Auto close brackets");
	this.codeAutoCloseBrackets = new CheckBox(this.form.element);
	this.codeAutoCloseBrackets.size.set(15, 15);
	this.codeAutoCloseBrackets.setOnChange(function()
	{
		Settings.code.autoCloseBrackets = self.codeAutoCloseBrackets.getValue();
	});
	this.form.add(this.codeAutoCloseBrackets);
	this.form.nextRow();

	//Highlight active line
	this.form.addText("Highlight line");
	this.codeHighlightActiveLine = new CheckBox(this.form.element);
	this.codeHighlightActiveLine.size.set(15, 15);
	this.codeHighlightActiveLine.setOnChange(function()
	{
		Settings.code.highlightActiveLine = self.codeHighlightActiveLine.getValue();
	});
	this.form.add(this.codeHighlightActiveLine);
	this.form.nextRow();

	//Show search match on scrollback
	this.form.addText("Show match scrollbar");
	this.showMatchesOnScrollbar = new CheckBox(this.form.element);
	this.showMatchesOnScrollbar.size.set(15, 15);
	this.showMatchesOnScrollbar.setOnChange(function()
	{
		Settings.code.showMatchesOnScrollbar = self.showMatchesOnScrollbar.getValue();
	});
	this.form.add(this.showMatchesOnScrollbar);
	this.form.nextRow();
	
	//File drag
	this.form.addText("Drag files");
	this.dragFiles = new CheckBox(this.form.element);
	this.dragFiles.size.set(15, 15);
	this.dragFiles.setOnChange(function()
	{
		Settings.code.dragFiles = self.dragFiles.getValue();
	});
	this.form.add(this.dragFiles);
	this.form.nextRow();

	//Indent with tabs
	this.form.addText("Indent with tabs");
	this.indentWithTabs = new CheckBox(this.form.element);
	this.indentWithTabs.size.set(15, 15);
	this.indentWithTabs.setOnChange(function()
	{
		Settings.code.indentWithTabs = self.indentWithTabs.getValue();
	});
	this.form.add(this.indentWithTabs);
	this.form.nextRow();

	//Tab size
	this.form.addText("Tab size");
	this.tabSize = new NumberBox(this.form.element);
	this.tabSize.size.set(60, 18);
	this.tabSize.setRange(1, 100);
	this.tabSize.setStep(1);
	this.tabSize.setOnChange(function()
	{
		Settings.code.tabSize = self.tabSize.getValue();
	});
	this.form.add(this.tabSize);
	this.form.nextRow();

	//Indent units
	this.form.addText("Indent Unit");
	this.indentUnit = new NumberBox(this.form.element);
	this.indentUnit.size.set(60, 18);
	this.indentUnit.setRange(1, 100);
	this.indentUnit.setStep(1);
	this.indentUnit.setOnChange(function()
	{
		Settings.code.indentUnit = self.indentUnit.getValue();
	});
	this.form.add(this.indentUnit);
	this.form.nextRow();

	//Update form
	this.form.updateInterface();
}

CodeSettingsTab.prototype = Object.create(TabElement.prototype);

//Activate
CodeSettingsTab.prototype.activate = function()
{
	this.codeTheme.setValue(Settings.code.theme);
	this.codeFontSize.setValue(Settings.code.fontSize);
	this.codeKeymap.setValue(Settings.code.keymap);
	this.codeLineNumbers.setValue(Settings.code.lineNumbers);
	this.codeLineWrapping.setValue(Settings.code.lineWrapping);
	this.codeAutoCloseBrackets.setValue(Settings.code.autoCloseBrackets);
	this.codeHighlightActiveLine.setValue(Settings.code.highlightActiveLine);
	this.showMatchesOnScrollbar.setValue(Settings.code.showMatchesOnScrollbar);
	this.dragFiles.setValue(Settings.code.dragFiles);
	this.indentWithTabs.setValue(Settings.code.indentWithTabs);
	this.tabSize.setValue(Settings.code.tabSize);
	this.indentUnit.setValue(Settings.code.indentUnit);
}; 
