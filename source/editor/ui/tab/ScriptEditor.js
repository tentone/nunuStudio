"use strict";

function ScriptEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Script", "editor/files/icons/misc/code.png");

	//Codemirror editor
	this.code = new CodeMirror(this.element,
	{
		value: "",
		lineNumbers: Settings.code.lineNumbers,
		lineWrapping: Settings.code.lineWrapping,
		keyMap: Settings.code.keymap,
		autoCloseBrackets: Settings.code.autoCloseBrackets,
		styleActiveLine: Settings.code.highlightActiveLine,
		showMatchesOnScrollbar: Settings.code.showMatchesOnScrollbar,
		matchBrackets: true,
		dragDrop: true,
		indentWithTabs: true,
		indentUnit: 4,
		tabSize: 4,
		hintOptions:
		{
			hint: CodeMirror.hint.anyword
		},
		lint: true,
		gutters: ["CodeMirror-lint-markers"]
	});

	this.code.setOption("theme", Settings.code.theme);
	this.code.setOption("mode", "javascript");

	//Set editor font size
	this.setFontSize(Settings.code.fontSize);

	//Self pointer
	var self = this;

	//Key pressed event
	this.code.on("keydown", function(code, event)
	{
		var key = event.keyCode;
		if(!Editor.keyboard.keyPressed(Keyboard.CTRL) && key >= Keyboard.A && key <= Keyboard.Z)
		{
			if(!code.state.completionActive)
			{
				CodeMirror.commands.autocomplete(code, null, {completeSingle: false});
			}
		}
	});

	//Change
	this.code.on("change", function()
	{
		self.updateScript();
	});

	//Context menu event
	this.element.oncontextmenu = function()
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX - 5, event.clientY - 5);
		
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
	};

	//Script attached to code editor
	this.script = null;
}

ScriptEditor.prototype = Object.create(TabElement.prototype);

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
}

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
}

//Activate code editor
ScriptEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);
	
	//Set editor state
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();

	//Set font size
	this.setFontSize(Settings.code.fontSize);

	//Update editor settings
	this.code.setOption("theme", Settings.code.theme);
	this.code.setOption("lineNumbers", Settings.code.lineNumbers);
	this.code.setOption("lineWrapping", Settings.code.lineWrapping);
	this.code.setOption("keyMap", Settings.code.keymap);
	this.code.setOption("autoCloseBrackets", Settings.code.autoCloseBrackets);
	this.code.setOption("styleActiveLine", Settings.code.highlightActiveLine);
	this.code.setOption("showMatchesOnScrollbar", Settings.code.showMatchesOnScrollbar);
	
	//Update script
	this.updateScript();
}

//Return editor text
ScriptEditor.prototype.getText = function()
{
	return this.code.getValue();
}

//Set editor text
ScriptEditor.prototype.setText = function(text)
{
	this.code.setValue(text);
}

//Check if script is attached to editor
ScriptEditor.prototype.isAttached = function(script)
{
	return this.script === script;
}

//Attach Script to code editor
ScriptEditor.prototype.attach = function(script)
{
	this.script = script;
	this.setText(script.code);
	this.updateMetadata();
}

//Update attached script
ScriptEditor.prototype.updateScript = function()
{
	if(this.script !== null)
	{
		this.script.code = this.code.getValue();
	}
}

//Set language mode (javascript, glsl, etc)
ScriptEditor.prototype.setMode = function(mode)
{
	this.code.setOption("mode", mode);
}

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
}

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
}