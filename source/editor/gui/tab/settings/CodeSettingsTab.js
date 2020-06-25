import {Font} from "../../../../../core/resources/Font.js";
import {Key} from "../../../../../core/input/Key.js";
import {Settings} from "../../../../Settings.js";
import {SettingsTab} from "../SettingsTab.js";
import {Interface} from "../../../Interface.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {TabComponent} from "../../../../components/tabs/TabComponent.js";
import {TableForm} from "../../../../components/TableForm.js";
import {NumberBox} from "../../../../components/input/NumberBox.js";
import {DropdownList} from "../../../../components/input/DropdownList.js";
import {CheckBox} from "../../../../components/input/CheckBox.js";
import {Form} from "../../../../components/Form.js";
import {Component} from "../../../../components/Component.js";


function CodeSettingsTab(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, "Code Editor", Global.FILE_PATH + "icons/script/script.png");
	
	this.element.style.overflow = "auto";

	var self = this;

	this.form = new TableForm(this);
	this.form.defaultTextWidth = 125;
	this.form.setAutoSize(false);

	// Code editor text
	this.form.addText("Code Editor");
	this.form.nextRow();

	// Code Theme
	this.form.addText("Editor theme");
	this.codeTheme = new DropdownList(this.form);
	this.codeTheme.size.set(120, 18);
	this.codeTheme.setOnChange(function()
	{
		Editor.settings.code.theme = self.codeTheme.getValue();
	});
	this.form.add(this.codeTheme);
	this.form.nextRow();
	
	for(var i = 0; i < CodemirrorThemes.length; i++)
	{
		this.codeTheme.addValue(CodemirrorThemes[i], CodemirrorThemes[i]);
	}

	// Code keymap
	this.form.addText("Key bindings");
	this.codeKeymap = new DropdownList(this.form);
	this.codeKeymap.size.set(120, 18);
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

	// Code font size
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

	// Show line numbers
	this.form.addText("Show line number");
	this.codeLineNumbers = new CheckBox(this.form);
	this.codeLineNumbers.size.set(18, 18);
	this.codeLineNumbers.setOnChange(function()
	{
		Editor.settings.code.lineNumbers = self.codeLineNumbers.getValue();
	});
	this.form.add(this.codeLineNumbers);
	this.form.nextRow();

	// Line wrapping
	this.form.addText("Line Wrap");
	this.codeLineWrapping = new CheckBox(this.form);
	this.codeLineWrapping.size.set(18, 18);
	this.codeLineWrapping.setOnChange(function()
	{
		Editor.settings.code.lineWrapping = self.codeLineWrapping.getValue();
	});
	this.form.add(this.codeLineWrapping);
	this.form.nextRow();

	// Auto close brackets
	this.form.addText("Auto Close Brackets");
	this.codeAutoCloseBrackets = new CheckBox(this.form);
	this.codeAutoCloseBrackets.size.set(18, 18);
	this.codeAutoCloseBrackets.setOnChange(function()
	{
		Editor.settings.code.autoCloseBrackets = self.codeAutoCloseBrackets.getValue();
	});
	this.form.add(this.codeAutoCloseBrackets);
	this.form.nextRow();

	// Highlight active line
	this.form.addText("Highlight line");
	this.codeHighlightActiveLine = new CheckBox(this.form);
	this.codeHighlightActiveLine.size.set(18, 18);
	this.codeHighlightActiveLine.setOnChange(function()
	{
		Editor.settings.code.highlightActiveLine = self.codeHighlightActiveLine.getValue();
	});
	this.form.add(this.codeHighlightActiveLine);
	this.form.nextRow();

	// Show search match on scrollback
	this.form.addText("Show match scrollbar");
	this.showMatchesOnScrollbar = new CheckBox(this.form);
	this.showMatchesOnScrollbar.size.set(18, 18);
	this.showMatchesOnScrollbar.setOnChange(function()
	{
		Editor.settings.code.showMatchesOnScrollbar = self.showMatchesOnScrollbar.getValue();
	});
	this.form.add(this.showMatchesOnScrollbar);
	this.form.nextRow();
	
	// File drag
	this.form.addText("Drag files");
	this.dragFiles = new CheckBox(this.form);
	this.dragFiles.size.set(18, 18);
	this.dragFiles.setOnChange(function()
	{
		Editor.settings.code.dragFiles = self.dragFiles.getValue();
	});
	this.form.add(this.dragFiles);
	this.form.nextRow();

	// Indent with tabs
	this.form.addText("Indent with Tabs");
	this.indentWithTabs = new CheckBox(this.form);
	this.indentWithTabs.size.set(18, 18);
	this.indentWithTabs.setOnChange(function()
	{
		Editor.settings.code.indentWithTabs = self.indentWithTabs.getValue();
	});
	this.form.add(this.indentWithTabs);
	this.form.nextRow();

	// Tab size
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

	// Indent units
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

	// Match Brackets
	this.form.addText("Match Brackets");
	this.matchBrackets = new CheckBox(this.form);
	this.matchBrackets.size.set(18, 18);
	this.matchBrackets.setOnChange(function()
	{
		Editor.settings.code.matchBrackets = self.matchBrackets.getValue();
	});
	this.form.add(this.matchBrackets);
	this.form.nextRow();

	// Smart Indent
	this.form.addText("Smart Indent");
	this.smartIndent = new CheckBox(this.form);
	this.smartIndent.size.set(18, 18);
	this.smartIndent.setOnChange(function()
	{
		Editor.settings.code.smartIndent = self.smartIndent.getValue();
	});
	this.form.add(this.smartIndent);
	this.form.nextRow();

	// VIM Mode
	this.form.addText("Vim Mode");
	this.vimMode = new CheckBox(this.form);
	this.vimMode.size.set(18, 18);
	this.vimMode.setOnChange(function()
	{
		Editor.settings.code.vimMode = self.vimMode.getValue();
	});
	this.form.add(this.vimMode);
	this.form.nextRow();
}

CodeSettingsTab.prototype = Object.create(TabComponent.prototype);

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
	this.matchBrackets.setValue(Editor.settings.code.matchBrackets);
	this.smartIndent.setValue(Editor.settings.code.smartIndent);
	this.vimMode.setValue(Editor.settings.code.vimMode);
};

CodeSettingsTab.prototype.updateSize = function()
{
	TabComponent.prototype.updateSize.call(this);

	this.form.size.copy(this.size);
	this.form.updateInterface();
};
export {CodeSettingsTab};