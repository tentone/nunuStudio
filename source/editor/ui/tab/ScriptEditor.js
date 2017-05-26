"use strict";

function ScriptEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Script", Editor.filePath + "icons/misc/code.png");

	//Codemirror editor
	this.code = new CodeMirror(this.element,
	{
		value: "",
		matchBrackets: true,
		indentWithTabs: true,
		indentUnit: 4,
		tabSize: 4,
		hintOptions:
		{
			hint: CodeMirror.hint.anyword,
			completeSingle: false
		},
		lint: true,
		gutters: ["CodeMirror-lint-markers"]
	});

	this.code.setOption("mode", "javascript");
	this.updateSettings();

	//Self pointer
	var self = this;

	//Tern server
	var server = new CodeMirror.TernServer(
	{
		caseInsensitive: false,
		plugins:
		{
			threejs: null
		}
	});

	//Key pressed event
	/*this.code.on("keydown", function(cm, event)
	{
		var key = event.keyCode;

		if(!Editor.keyboard.keyPressed(Keyboard.CTRL) && key >= Keyboard.A && key <= Keyboard.Z)
		{
			if(!cm.state.completionActive)
			{
				CodeMirror.commands.autocomplete(cm, null);
			}
		}
	});*/

	//Change
	this.code.on("change", function(cm)
	{
		if(!cm.state.focused)
		{
			return;
		}

		self.updateScript();
	});

	this.code.on("cursorActivity", function(cm)
	{
		server.updateArgHints(cm);
	});

	this.code.on("keypress", function(cm, event)
	{
		var typed = String.fromCharCode(event.keyCode);

		if(/[\w\.]/.exec(typed))
		{
			server.complete(cm);
		}
	});

	//Context menu event
	this.element.oncontextmenu = function()
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX - 5, event.clientY - 5);
		
		var refactor = context.addMenu("Refactor");
		refactor.addOption("Rename", function()
		{
			server.rename(self.code);
		});

		context.addOption("Copy", function()
		{
			var text = self.code.getSelection();
			if(text !== "")
			{
				Editor.clipboard.set(text, "text");
			}
		});
		context.addOption("Cut", function()
		{
			var text = self.code.getSelection();
			if(text !== "")
			{
				Editor.clipboard.set(text, "text");
				self.code.replaceSelection("");
			}
		});
		context.addOption("Paste", function()
		{
			self.code.replaceSelection(Editor.clipboard.get("text"));
		});
		context.addOption("Auto ident", function()
		{
			self.code.execCommand("indentAuto");
		});
		context.addOption("Select all", function()
		{
			self.code.execCommand("selectAll");
		});
		context.addOption("Undo", function()
		{
			self.code.execCommand("undo");
		});
		context.addOption("Redo", function()
		{
			self.code.execCommand("redo");
		});
		context.updateInterface();
	};

	//Script attached to code editor
	this.script = null;
}

ScriptEditor.prototype = Object.create(TabElement.prototype);

//Update script editor settings
ScriptEditor.prototype.updateSettings = function()
{
	this.setFontSize(Settings.code.fontSize);

	this.code.setOption("theme", Settings.code.theme);
	this.code.setOption("lineNumbers", Settings.code.lineNumbers);
	this.code.setOption("lineWrapping", Settings.code.lineWrapping);
	this.code.setOption("keyMap", Settings.code.keymap);
	this.code.setOption("autoCloseBrackets", Settings.code.autoCloseBrackets);
	this.code.setOption("styleActiveLine", Settings.code.highlightActiveLine);
	this.code.setOption("showMatchesOnScrollbar", Settings.code.showMatchesOnScrollbar);
	this.code.setOption("dragDrop", Settings.code.dragFiles);
};

//Set code editor font size
ScriptEditor.prototype.setFontSize = function(size)
{
	if(size < 5)
	{
		size = 5;
	}

	Settings.code.fontSize = size;

	this.code.display.wrapper.style.fontSize = size + "px";
	this.code.refresh();
};

//Update object data
ScriptEditor.prototype.updateMetadata = function()
{
	if(this.script !== null)
	{
		var script = this.script;

		//Set name
		this.setName(script.name);

		//Check if script exists in program
		var found = false;
		Editor.program.traverse(function(obj)
		{
			if(obj.uuid === script.uuid)
			{
				found = true;
			}
		});

		//If not found close tab
		if(!found)
		{
			this.close();
		}
	}
};

//Activate code editor
ScriptEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	this.updateSettings();

	this.updateScript();
};

//Return editor text
ScriptEditor.prototype.getText = function()
{
	return this.code.getValue();
};

//Set editor text
ScriptEditor.prototype.setText = function(text)
{
	this.code.setValue(text);
};

//Check if script is attached to editor
ScriptEditor.prototype.isAttached = function(script)
{
	return this.script === script;
};

//Attach Script to code editor
ScriptEditor.prototype.attach = function(script)
{
	this.script = script;
	this.setText(script.code);
	this.updateMetadata();
};

//Update attached script
ScriptEditor.prototype.updateScript = function()
{
	if(this.script !== null)
	{
		this.script.code = this.code.getValue();
	}
};

//Set language mode (javascript, glsl, etc)
ScriptEditor.prototype.setMode = function(mode)
{
	this.code.setOption("mode", mode);
};

//Update ScriptEditor
ScriptEditor.prototype.update = function()
{
	if(Editor.keyboard.keyPressed(Keyboard.CTRL))
	{
		if(Editor.mouse.wheel !== 0)
		{
			this.setFontSize(Settings.code.fontSize - Editor.mouse.wheel/100);
		}
	}
};

//Update division Size
ScriptEditor.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";

		this.code.setSize(this.size.x, this.size.y);
		
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