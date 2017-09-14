"use strict";

function ScriptEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Script", Editor.filePath + "icons/misc/code.png");

	//Codemirror editor
	this.code = new CodeMirror(this.element,
	{
		value: "",
		matchBrackets: true,
		hintOptions:
		{
			hint: CodeMirror.hint.anyword,
			completeSingle: false
		},
		gutters: ["CodeMirror-lint-markers"]
	});

	this.code.setOption("mode", "javascript");
	this.updateSettings();

	//Self pointer
	var self = this;

	//Tern server
	this.server = new CodeMirror.TernServer(
	{
		caseInsensitive: false,
		defs: Editor.ternDefinitions,
		plugins:
		{
			threejs: null
		}
	});

	this.code.setOption("extraKeys",
	{
		"Ctrl-Space": function(cm){self.server.complete(cm);}
	})

	//Change
	this.code.on("change", function(cm)
	{
		if(!cm.state.focused)
		{
			return;
		}

		self.updateScript();
	});

	//Cursor activity event
	this.code.on("cursorActivity", function(cm)
	{
		self.server.updateArgHints(cm);
	});

	//Key pressed event
	this.code.on("keypress", function(cm, event)
	{
		var typed = String.fromCharCode(event.charCode);

		if(/[\w\.]/.exec(typed))
		{
			self.server.complete(cm);

			//If there is no tern sugestion suggest known words
			if(cm.state.completionActive == null || cm.state.completionActive.widget === null)
			{
				CodeMirror.commands.autocomplete(cm, null);
			}
		}
	});

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX - 5, event.clientY - 5);
		
		var refactor = context.addMenu("Refactor");
		refactor.addOption("Rename", function()
		{
			self.server.rename(self.code);
		});
		refactor.addOption("Select", function()
		{
			self.server.selectName(self.code);
		});

		context.addOption("Documentation", function()
		{
			self.server.jumpToDef(self.code);
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

	//Scroll position
	this.scroll = null;

	//Script attached to code editor
	this.script = null;
}

ScriptEditor.prototype = Object.create(TabElement.prototype);

//Update script editor settings
ScriptEditor.prototype.updateSettings = function()
{
	this.setFontSize(Settings.code.fontSize);

	this.code.setOption("lint", {options: Settings.jslint});
	this.code.setOption("theme", Settings.code.theme);
	this.code.setOption("lineNumbers", Settings.code.lineNumbers);
	this.code.setOption("lineWrapping", Settings.code.lineWrapping);
	this.code.setOption("keyMap", Settings.code.keymap);
	this.code.setOption("autoCloseBrackets", Settings.code.autoCloseBrackets);
	this.code.setOption("styleActiveLine", Settings.code.highlightActiveLine);
	this.code.setOption("showMatchesOnScrollbar", Settings.code.showMatchesOnScrollbar);
	this.code.setOption("dragDrop", Settings.code.dragFiles);
	this.code.setOption("indentWithTabs", Settings.code.indentWithTabs);
	this.code.setOption("tabSize", Settings.code.tabSize);
	this.code.setOption("indentUnit", Settings.code.indentUnit);
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
};

//Update object data
ScriptEditor.prototype.updateMetadata = function()
{
	if(this.script !== null)
	{
		//Set name
		this.setName(this.script.name);

		//Check if object has a parent
		if(this.script.parent === null)
		{
			this.close();
			return;
		}

		//Check if object exists in parent
		var children = this.script.parent.children;
		for(var i = 0; i < children.length; i++)
		{
			if(this.script.uuid === children[i].uuid)
			{
				return;
			}
		}

		//If not found close tab
		if(i >= children.length)
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