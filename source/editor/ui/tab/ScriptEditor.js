"use strict";

function ScriptEditor(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;
	
	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panel_color;

	//Codemirror editor
	this.code = new CodeMirror(this.element,
	{
		value: "",
		lineNumbers: Settings.code.line_numbers,
		lineWrapping: Settings.code.line_wrapping,
		keyMap: Settings.code.keymap,
		autoCloseBrackets: Settings.code.auto_close_brackets,
		styleActiveLine: Settings.code.highlight_active_line,
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
	this.setFontSize(Settings.code.font_size);

	//Self pointer
	var self = this;

	//Key pressed event
	this.code.on("keydown", function(code, event)
	{
		var key = event.keyCode;
		if(!Keyboard.keyPressed(Keyboard.CTRL) && key >= Keyboard.A && key <= Keyboard.Z)
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

	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Script attached to code editor
	this.script = null;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Set code editor font size
ScriptEditor.prototype.setFontSize = function(size)
{
	if(size < 5)
	{
		size = 5;
	}

	Settings.code.font_size = size;

	this.code.display.wrapper.style.fontSize = size + "px";
	this.code.refresh();
}

//Update container object data
ScriptEditor.prototype.updateMetadata = function(container)
{
	if(this.script !== null)
	{
		var script = this.script;

		//Set container name
		container.setName(script.name);

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
			container.close();
		}
	}
}

//Activate code editor
ScriptEditor.prototype.activate = function()
{
	//Set editor state
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();

	//Set font size
	this.setFontSize(Settings.code.font_size);

	//Update editor settings
	this.code.setOption("theme", Settings.code.theme);
	this.code.setOption("lineNumbers", Settings.code.line_numbers);
	this.code.setOption("lineWrapping", Settings.code.line_wrapping);
	this.code.setOption("keyMap", Settings.code.keymap);
	this.code.setOption("autoCloseBrackets", Settings.code.auto_close_brackets);
	this.code.setOption("styleActiveLine", Settings.code.highlight_active_line);

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

//Attach Script to code editor
ScriptEditor.prototype.attachScript = function(script)
{
	this.script = script;
	this.setText(script.code);
}

//Update attached script
ScriptEditor.prototype.updateScript = function()
{
	if(this.script !== null)
	{
		this.script.setCode(this.code.getValue());
	}
}

//Set language mode (javascript, glsl, etc)
ScriptEditor.prototype.setMode = function(mode)
{
	this.code.setOption("mode", mode);
}

//Remove element
ScriptEditor.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update ScriptEditor
ScriptEditor.prototype.update = function()
{
	if(Keyboard.keyPressed(Keyboard.CTRL))
	{
		if(Mouse.wheel !== 0)
		{
			this.setFontSize(Settings.code.font_size - Mouse.wheel/100);
		}
	}
}

//Update division Size
ScriptEditor.prototype.updateInterface = function()
{
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	this.code.setSize(this.size.x, this.size.y);
	
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}