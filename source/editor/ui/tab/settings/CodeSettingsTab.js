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
}; 

//Update division Size
CodeSettingsTab.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		//Element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
