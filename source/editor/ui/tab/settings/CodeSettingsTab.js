"use strict";

function CodeSettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Code Editor", "editor/files/icons/script/script.png");
	
	this.element.style.overflow = "auto";

	//Self pointer
	var self = this;

	//Form
	this.form = new Form(this.element);
	this.form.default_text_width = 125;
	this.form.position.set(5, 5);
	this.form.spacing.set(5, 5);

	//Code editor text
	this.form.addText("Code Editor");
	this.form.nextRow();

	//Code Theme
	this.form.addText("Editor theme");
	this.code_theme = new DropdownList(this.form.element);
	this.code_theme.size.set(120, 20);
	this.code_theme.setOnChange(function()
	{
		Settings.code.theme = self.code_theme.getValue();
	});
	this.form.add(this.code_theme);
	this.form.nextRow();

	//Get codemirror themes available
	var files = FileSystem.getFilesDirectory("lib/codemirror/theme/");
	for(var i = 0; i < files.length; i++)
	{
		var theme = files[i].replace(".css", "");
		this.code_theme.addValue(theme, theme);
	}

	//Code keymap
	this.form.addText("Key bindings");
	this.code_keymap = new DropdownList(this.form.element);
	this.code_keymap.size.set(120, 20);
	this.code_keymap.addValue("codemirror", "default");
	this.code_keymap.addValue("sublime", "sublime");
	this.code_keymap.addValue("vim", "vim");
	this.code_keymap.addValue("emacs", "emacs");
	this.code_keymap.setOnChange(function()
	{
		Settings.code.keymap = self.code_keymap.getValue();
	});
	this.form.add(this.code_keymap);
	this.form.nextRow();

	//Code font size
	this.form.addText("Font size");
	this.code_font_size = new NumberBox(this.form.element);
	this.code_font_size.size.set(60, 18);
	this.code_font_size.setRange(5, 99999);
	this.code_font_size.setStep(1);
	this.code_font_size.setOnChange(function()
	{
		Settings.code.font_size = self.code_font_size.getValue();
	});
	this.form.add(this.code_font_size);
	this.form.nextRow();

	//Show line numbers
	this.form.addText("Show line number");
	this.code_line_numbers = new CheckBox(this.form.element);
	this.code_line_numbers.size.set(20, 16);
	this.code_line_numbers.setOnChange(function()
	{
		Settings.code.line_numbers = self.code_line_numbers.getValue();
	});
	this.form.add(this.code_line_numbers);
	this.form.nextRow();

	//Line wrapping
	this.form.addText("Line wrap");
	this.code_line_wrapping = new CheckBox(this.form.element);
	this.code_line_wrapping.size.set(20, 16);
	this.code_line_wrapping.setOnChange(function()
	{
		Settings.code.line_wrapping = self.code_line_wrapping.getValue();
	});
	this.form.add(this.code_line_wrapping);
	this.form.nextRow();

	//Auto close brackets
	this.form.addText("Auto close brackets");
	this.code_auto_close_brackets = new CheckBox(this.form.element);
	this.code_auto_close_brackets.size.set(20, 16);
	this.code_auto_close_brackets.setOnChange(function()
	{
		Settings.code.auto_close_brackets = self.code_auto_close_brackets.getValue();
	});
	this.form.add(this.code_auto_close_brackets);
	this.form.nextRow();

	//Highlight active line
	this.form.addText("Highlight line");
	this.code_highlight_active_line = new CheckBox(this.form.element);
	this.code_highlight_active_line.size.set(20, 16);
	this.code_highlight_active_line.setOnChange(function()
	{
		Settings.code.highlight_active_line = self.code_highlight_active_line.getValue();
	});
	this.form.add(this.code_highlight_active_line);
	this.form.nextRow();
}

CodeSettingsTab.prototype = Object.create(TabElement.prototype);

//Activate
CodeSettingsTab.prototype.activate = function()
{
	Editor.setState(Editor.STATE_IDLE);

	this.code_theme.setValue(Settings.code.theme);
	this.code_font_size.setValue(Settings.code.font_size);
	this.code_keymap.setValue(Settings.code.keymap);
	this.code_line_numbers.setValue(Settings.code.line_numbers);
	this.code_line_wrapping.setValue(Settings.code.line_wrapping);
	this.code_auto_close_brackets.setValue(Settings.code.auto_close_brackets);
	this.code_highlight_active_line.setValue(Settings.code.highlight_active_line);
}

//Update division Size
CodeSettingsTab.prototype.updateInterface = function()
{
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
	
	//Form
	this.form.visible = this.visible;
	this.form.updateInterface();

	//Update base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
