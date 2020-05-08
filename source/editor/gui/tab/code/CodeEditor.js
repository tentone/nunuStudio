"use strict";

/**
 * Code editor tab element based on the codemirror code editor library.
 *
 * @class CodeEditor
 * @extends TabElement
 */
function CodeEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, Locale.codeEditor, Global.FILE_PATH + "icons/misc/code.png");
	CodeBox.call(this, parent);
}

CodeEditor.prototype = Object.create(TabElement.prototype);
Object.assign(CodeEditor.prototype, CodeBox.prototype);

CodeEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	this.updateSettings();
};

CodeEditor.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);

	this.code.setSize(this.size.x, this.size.y);
};
