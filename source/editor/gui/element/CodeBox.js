"use strict";

/**
 * Code box can be used as an input element for any type of code of highlighted text input.
 *
 * Wraps a codemirror input element that can be access to integrate more advanced code mirror functionality.
 *
 * @class CodeBox
 * @extends {Element}
 * @param {Element} parent Parent element.
 * @param {Object} options Options for the codemirror object.
 */
function CodeBox(parent, options)
{
	Element.call(this, parent, "div");
	
	var self = this;
 
 	options = options !== undefined ? options : {
		dragDrop: false,
		firstLineNumber: 1,
		indentUnit: Editor.settings.code.indentUnit,
		indentWithTabs: false,
		inputStyle: "textarea",
		keyMap: Editor.settings.code.keymap,
		lineNumbers: false,
		lineWiseCopyCut: false,
		lineWrapping: false,
		lint: false,
		matchBrackets: true,
		mode: "javascript",
		pollInterval: 100,
		readOnly: false,
		smartIndent: false,
		spellcheck: false,
		styleActiveLine: false,
		styleSelectedText: false,
		tabSize: Editor.settings.code.tabSize,
		theme: Editor.settings.code.theme,
		undoDepth: 0,
		value: "",
		viewportMargin: 1,
		vimMode: false,
		wholeLineUpdateBefore: true,
		showMatchesOnScrollbar: false,
		hintOptions:
		{
			hint: CodeMirror.hint.anyword,
			completeSingle: false
		},
		gutters: ["CodeMirror-lint-markers"]
 	};

	/**
	 * CodeMirror editor instance should be used to access any codemirror functionality.
	 * 
	 * @property code
	 * @type {CodeMirror}
	 */
	this.code = new CodeMirror(this.element, options);
	
	// Create a context menu for basic text copy/paste actions
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu(DocumentBody);
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
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
		
		context.updateInterface();
	};
}

CodeBox.prototype = Object.create(Element.prototype);

/**
 * Set code editor font size.
 *
 * @method setFontSize
 * @param {number} size
 */
CodeBox.prototype.setFontSize = function(size)
{
	if(size < 5)
	{
		size = 5;
	}

	Editor.settings.code.fontSize = size;
	this.code.display.wrapper.style.fontSize = size + "px";
};

/**
 * Get the code open in the editor.
 *
 * @method getText
 * @return {string} The code in the editor.
 */
CodeBox.prototype.getText = function()
{
	return this.code.getValue();
};

/**
 * Set the code open in the editor.
 *
 * @method getText
 * @param {string} text Code to put in the editor.
 */
CodeBox.prototype.setText = function(text)
{
	this.code.setValue(text);
};

/**
 * Set language mode (javascript, glsl, etc).
 *
 * @method setLanguage
 * @param {string} mode Language mode.
 */
CodeBox.prototype.setLanguage = function(mode)
{
	this.code.setOption("mode", mode);
};

/**
 * Set onchange callback.
 *
 * @method setOnChange
 * @param {Function} callback
 */
CodeBox.prototype.setOnChange = function(callback)
{
	this.code.on("change", callback);
};

CodeBox.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	this.code.setSize(this.size.x, this.size.y);
};
