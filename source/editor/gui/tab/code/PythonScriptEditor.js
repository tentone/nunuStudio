import {Script} from "../../../../core/objects/script/Script.js";
import {CodeEditor} from "./CodeEditor.js";

/**
 * The script editor is used to view and edit code of script objects.
 *
 * @class PythonScriptEditor
 * @extends {CodeEditor}
 */
class PythonScriptEditor extends CodeEditor {
	constructor(parent, closeable, container, index) {
	super(parent, closeable, container, index);

	var self = this;

	this.setLanguage("python");
	this.updateSettings();

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

	/**
	 * Scroll position
	 *
	 * @attribute scroll
	 * @type {Object}
	 */
	this.scroll = null;

	/**
	 * Script object attached to code editor.
	 *
	 * @attribute script
	 * @type {Script}
	 */
	this.script = null;
	}

	updateMetadata() {
	// Name
	this.setName(this.script.name);

	// Check if object has a parent
	if (this.script.parent === null)
	{
		this.close();
		return;
	}

	// Check if object exists in parent
	var children = this.script.parent.children;
	for (var i = 0; i < children.length; i++)
	{
		if (this.script.uuid === children[i].uuid)
		{
			return;
		}
	}

	// If not found close tab
	if (i >= children.length)
	{
		this.close();
	}
	}

	activate() {
	super.activate();

	this.updateCode();
	}

	isAttached(script) {
	return this.script === script;
	}

	attach(script) {
	this.script = script;
	this.setText(script.code);
	this.updateMetadata();
	}

/**
 * Update the attached object script code.
 *
 * @method updateCode
 */
	updateCode() {
	if (this.script !== null)
	{
		this.script.code = this.code.getValue();
	}
	}

}

export {PythonScriptEditor};
