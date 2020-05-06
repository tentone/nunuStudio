"use strict";

/**
 * The text editor is used to edit text files.
 *
 * It can present colors for some programming language (javascript, glsl, html, css, etc).
 *
 * @class TextEditor
 * @extends {CodeEditor}
 */
function TextEditor(parent, closeable, container, index)
{
	CodeEditor.call(this, parent, closeable, container, index);

	var self = this;

	// Change
	this.code.on("change", function(cm)
	{
		if(!cm.state.focused)
		{
			return;
		}

		self.updateCode();
	});

	// Key pressed event
	this.code.on("keypress", function(cm, event)
	{
		var typed = String.fromCharCode(event.charCode);

		if(/[\w\.]/.exec(typed))
		{
			// If there is no tern sugestion suggest known words
			if(cm.state.completionActive == null || cm.state.completionActive.widget === null)
			{
				CodeMirror.commands.autocomplete(cm, null);
			}
		}
	});

	this.resource = null;
}

TextEditor.prototype = Object.create(CodeEditor.prototype);

TextEditor.prototype.updateMetadata = function()
{
	this.setName(this.resource.name);

	// If not found close tab
	if(Editor.program.resources[this.resource.uuid] === undefined)
	{
		this.close();
	}
};

TextEditor.prototype.activate = function()
{
	CodeEditor.prototype.activate.call(this);

	this.updateCode();
};

TextEditor.prototype.isAttached = function(resource)
{
	return this.resource === resource;
};

TextEditor.prototype.attach = function(resource)
{
	this.resource = resource;
	this.setText(resource.data);

	if(resource.encoding == "js")
	{
		this.setMode("javascript");
	}
	else if(resource.encoding == "html")
	{
		this.setMode("htmlmixed");
	}
	else if(resource.encoding == "css")
	{
		this.setMode("css");
	}
	else
	{
		this.setMode("");
	}
	
	this.updateMetadata();
	this.updateSettings();
};

// Update attached script
TextEditor.prototype.updateCode = function()
{
	if(this.resource !== null)
	{
		this.resource.data = this.code.getValue();
	}
};
