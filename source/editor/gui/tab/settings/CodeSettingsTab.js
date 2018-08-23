"use strict";

function CodeSettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Code Editor", Editor.filePath + "icons/script/script.png");
	
	this.element.style.overflow = "auto";

	//Self pointer
	var self = this;

	//Form
	this.form = new Form(this);
	this.form.defaultTextWidth = 125;
	this.form.position.set(5, 5);
	this.form.spacing.set(5, 5);

	//Code editor text
	this.form.addText("Code Editor");
	this.form.nextRow();

	//Code Theme
	this.form.addText("Editor theme");
	this.codeTheme = new DropdownList(this.form);
	this.codeTheme.size.set(120, 20);
	this.codeTheme.setOnChange(function()
	{
		Editor.settings.code.theme = self.codeTheme.getValue();
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
	this.codeKeymap = new DropdownList(this.form);
	this.codeKeymap.size.set(120, 20);
	this.codeKeymap.addValue("codemirror", "default");
	this.codeKeymap.addValue("sublime", "sublime");
	this.codeKeymap.addValue("vim", "vim");
	this.codeKeymap.addValue("emacs", "emacs");
	this.codeKeymap.setOnChange(function()
	{
		Editor.settings.code.keymap = self.codeKeymap.getValue();
	});
	this.form.add(this.codeKeymap);
	this.form.nextRow();

	//Code font size
	this.form.addText("Font size");
	this.codeFontSize = new NumberBox(this.form);
	this.codeFontSize.size.set(60, 18);
	this.codeFontSize.setRange(5, 99999);
	this.codeFontSize.setStep(1);
	this.codeFontSize.setOnChange(function()
	{
		Editor.settings.code.fontSize = self.codeFontSize.getValue();
	});
	this.form.add(this.codeFontSize);
	this.form.nextRow();

	//Show line numbers
	this.form.addText("Show line number");
	this.codeLineNumbers = new CheckBox(this.form);
	this.codeLineNumbers.size.set(15, 15);
	this.codeLineNumbers.setOnChange(function()
	{
		Editor.settings.code.lineNumbers = self.codeLineNumbers.getValue();
	});
	this.form.add(this.codeLineNumbers);
	this.form.nextRow();

	//Line wrapping
	this.form.addText("Line wrap");
	this.codeLineWrapping = new CheckBox(this.form);
	this.codeLineWrapping.size.set(15, 15);
	this.codeLineWrapping.setOnChange(function()
	{
		Editor.settings.code.lineWrapping = self.codeLineWrapping.getValue();
	});
	this.form.add(this.codeLineWrapping);
	this.form.nextRow();

	//Auto close brackets
	this.form.addText("Auto close brackets");
	this.codeAutoCloseBrackets = new CheckBox(this.form);
	this.codeAutoCloseBrackets.size.set(15, 15);
	this.codeAutoCloseBrackets.setOnChange(function()
	{
		Editor.settings.code.autoCloseBrackets = self.codeAutoCloseBrackets.getValue();
	});
	this.form.add(this.codeAutoCloseBrackets);
	this.form.nextRow();

	//Highlight active line
	this.form.addText("Highlight line");
	this.codeHighlightActiveLine = new CheckBox(this.form);
	this.codeHighlightActiveLine.size.set(15, 15);
	this.codeHighlightActiveLine.setOnChange(function()
	{
		Editor.settings.code.highlightActiveLine = self.codeHighlightActiveLine.getValue();
	});
	this.form.add(this.codeHighlightActiveLine);
	this.form.nextRow();

	//Show search match on scrollback
	this.form.addText("Show match scrollbar");
	this.showMatchesOnScrollbar = new CheckBox(this.form);
	this.showMatchesOnScrollbar.size.set(15, 15);
	this.showMatchesOnScrollbar.setOnChange(function()
	{
		Editor.settings.code.showMatchesOnScrollbar = self.showMatchesOnScrollbar.getValue();
	});
	this.form.add(this.showMatchesOnScrollbar);
	this.form.nextRow();
	
	//File drag
	this.form.addText("Drag files");
	this.dragFiles = new CheckBox(this.form);
	this.dragFiles.size.set(15, 15);
	this.dragFiles.setOnChange(function()
	{
		Editor.settings.code.dragFiles = self.dragFiles.getValue();
	});
	this.form.add(this.dragFiles);
	this.form.nextRow();

	//Indent with tabs
	this.form.addText("Indent with tabs");
	this.indentWithTabs = new CheckBox(this.form);
	this.indentWithTabs.size.set(15, 15);
	this.indentWithTabs.setOnChange(function()
	{
		Editor.settings.code.indentWithTabs = self.indentWithTabs.getValue();
	});
	this.form.add(this.indentWithTabs);
	this.form.nextRow();

	//Tab size
	this.form.addText("Tab size");
	this.tabSize = new NumberBox(this.form);
	this.tabSize.size.set(60, 18);
	this.tabSize.setRange(1, 100);
	this.tabSize.setStep(1);
	this.tabSize.setOnChange(function()
	{
		Editor.settings.code.tabSize = self.tabSize.getValue();
	});
	this.form.add(this.tabSize);
	this.form.nextRow();

	//Indent units
	this.form.addText("Indent Unit");
	this.indentUnit = new NumberBox(this.form);
	this.indentUnit.size.set(60, 18);
	this.indentUnit.setRange(1, 100);
	this.indentUnit.setStep(1);
	this.indentUnit.setOnChange(function()
	{
		Editor.settings.code.indentUnit = self.indentUnit.getValue();
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
	this.codeTheme.setValue(Editor.settings.code.theme);
	this.codeFontSize.setValue(Editor.settings.code.fontSize);
	this.codeKeymap.setValue(Editor.settings.code.keymap);
	this.codeLineNumbers.setValue(Editor.settings.code.lineNumbers);
	this.codeLineWrapping.setValue(Editor.settings.code.lineWrapping);
	this.codeAutoCloseBrackets.setValue(Editor.settings.code.autoCloseBrackets);
	this.codeHighlightActiveLine.setValue(Editor.settings.code.highlightActiveLine);
	this.showMatchesOnScrollbar.setValue(Editor.settings.code.showMatchesOnScrollbar);
	this.dragFiles.setValue(Editor.settings.code.dragFiles);
	this.indentWithTabs.setValue(Editor.settings.code.indentWithTabs);
	this.tabSize.setValue(Editor.settings.code.tabSize);
	this.indentUnit.setValue(Editor.settings.code.indentUnit);
}; 
