import {Locale} from "../../locale/LocaleManager.js";
import {Editor} from "../../Editor.js";
import {ContextMenu} from "../dropdown/ContextMenu.js";
import {DocumentBody} from "../DocumentBody.js";
import {Component} from "../Component.js";

/**
 * Text area input is used to handle multi line string values.
 *
 * @class CodeInput
 * @extends {Component}
 */
function CodeInput(parent)
{
	Component.call(this, parent, "div");

	/**
	 * CodeMirror editor instance should be used to access any codemirror functionality.
	 * 
	 * @property code
	 * @type {CodeMirror}
	 */
	this.code = new CodeMirror(this.element,
	{
		value: "",
		hintOptions:
		{
			hint: CodeMirror.hint.anyword,
			completeSingle: false
		},
		gutters: ["CodeMirror-lint-markers"]
	});
	
	this.code.setOption("theme", Editor.settings.code.theme);
	this.code.setOption("indentWithTabs", Editor.settings.code.indentWithTabs);
	this.code.setOption("tabSize", Editor.settings.code.tabSize);
	this.code.setOption("indentUnit", Editor.settings.code.indentUnit);
	this.code.setOption("autoCloseBrackets", Editor.settings.code.autoCloseBrackets);

	var self = this;

	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu(DocumentBody);
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
		var refactor = context.addMenu(Locale.refactor);
		refactor.addOption(Locale.rename, function()
		{
			self.server.rename(self.code);
		});

		refactor.addOption(Locale.select, function()
		{
			self.server.selectName(self.code);
		});

		context.addOption(Locale.search, function()
		{
			self.code.execCommand("find");
		});

		context.addOption(Locale.replace, function()
		{
			self.code.execCommand("replace");
		});

		context.addOption(Locale.replaceAll, function()
		{
			self.code.execCommand("replaceAll");
		});

		context.addOption(Locale.documentation, function()
		{
			self.server.jumpToDef(self.code);
		});

		context.addOption(Locale.copy, function()
		{
			var text = self.code.getSelection();
			if(text !== "")
			{
				Editor.clipboard.set(text, "text");
			}
		});
		context.addOption(Locale.cut, function()
		{
			var text = self.code.getSelection();
			if(text !== "")
			{
				Editor.clipboard.set(text, "text");
				self.code.replaceSelection("");
			}
		});
		context.addOption(Locale.paste, function()
		{
			self.code.replaceSelection(Editor.clipboard.get("text"));
		});
		context.addOption(Locale.autoIndent, function()
		{
			self.code.execCommand("indentAuto");
		});
		context.addOption(Locale.selectAll, function()
		{
			self.code.execCommand("selectAll");
		});
		context.addOption(Locale.undo, function()
		{
			self.code.execCommand("undo");
		});
		context.addOption(Locale.redo, function()
		{
			self.code.execCommand("redo");
		});
		context.updateInterface();
	};
}

CodeInput.prototype = Object.create(Component.prototype);

/**
 * Set code editor font size.
 *
 * @method setFontSize
 * @param {number} size
 */
CodeInput.prototype.setFontSize = function(size)
{
	if(size < 5)
	{
		size = 5;
	}

	Editor.settings.code.fontSize = size;
	this.code.display.wrapper.style.fontSize = size + "px";
};

/**
 * Set language mode (javascript, glsl, etc).
 *
 * @method setLanguage
 * @param {string} mode Language mode.
 */
CodeInput.prototype.setLanguage = function(mode)
{
	this.code.setOption("mode", mode);
};

/**
 * Set the disabled state of the element.
 *
 * @method setDisabled
 * @param {boolean} disabled
 */
CodeInput.prototype.setDisabled = function(value)
{
	this.element.disabled = value;
};

/**
 * Set onchange callback, called after changes.
 *
 * @method setOnChange
 * @param {Function} onChange
 */
CodeInput.prototype.setOnChange = function(callback)
{
	this.code.on("change", callback);
};

/**
 * Set value stored in the input element.
 *
 * @method setText
 * @param {Object} text
 */
CodeInput.prototype.setText = function(text)
{
	this.code.setValue(text);
};

/**
 * Get text stored in the input element.
 *
 * @method getText
 * @return {string} Text stored in the input element.
 */
CodeInput.prototype.getText = function()
{
	return this.code.getValue();
};

/**
 * Set value stored in the input element. Same as setText().
 *
 * @method setValue
 * @param {Object} text
 */
CodeInput.prototype.setValue = CodeInput.prototype.setText;

/**
 * Get text stored in the input element. Same as getText().
 *
 * @method getValue
 * @return {string} Text stored in the input element.
 */
CodeInput.prototype.getValue = CodeInput.prototype.getText;

export {CodeInput};
