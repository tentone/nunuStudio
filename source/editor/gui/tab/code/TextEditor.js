import {Editor} from "../../../Editor.js";
import {CodeEditor} from "./CodeEditor.js";

/**
 * The text editor is used to edit text files.
 *
 * It can present colors for some programming language (javascript, glsl, html, css, etc).
 *
 * @class TextEditor
 * @extends {CodeEditor}
 */
class TextEditor extends CodeEditor {
	constructor(parent, closeable, container, index) {
	super(parent, closeable, container, index);

	var self = this;

	// Change
	this.code.on("change", function(cm)
	{
		if (!cm.state.focused)
		{
			return;
		}

		self.updateCode();
	});

	// Key pressed event
	this.code.on("keypress", function(cm, event)
	{
		var typed = String.fromCharCode(event.charCode);

		if (/[\w\.]/.exec(typed))
		{
			// If there is no tern sugestion suggest known words
			if (!cm.state.completionActive || !cm.state.completionActive.widget)
			{
				CodeMirror.commands.autocomplete(cm, null);
			}
		}
	});

	this.resource = null;
	}

	updateMetadata() {
	this.setName(this.resource.name);

	// If not found close tab
	if (Editor.program.resources[this.resource.uuid] === undefined)
	{
		this.close();
	}
	}

	activate() {
	super.activate();

	this.updateCode();
	}

	isAttached(resource) {
	return this.resource === resource;
	}

	attach(resource) {
	this.resource = resource;
	this.setText(resource.data);

	if (resource.encoding === "js")
	{
		this.setLanguage("javascript");
	}
	else if (resource.encoding === "html")
	{
		this.setLanguage("htmlmixed");
	}
	else if (resource.encoding === "css")
	{
		this.setLanguage("css");
	}
	else
	{
		this.setLanguage("");
	}
	
	this.updateMetadata();
	this.updateSettings();
	}

// Update attached script
	updateCode() {
	if (this.resource !== null)
	{
		this.resource.data = this.code.getValue();
	}
	}

}

export {TextEditor};
