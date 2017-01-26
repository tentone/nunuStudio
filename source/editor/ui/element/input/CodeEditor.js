"use strict";

function CodeEditor(parent)
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
		}
	});
	this.code.setOption("theme", Settings.code.theme);
	this.code.setOption("mode", "javascript");

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
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//Set language mode (javascript, glsl, etc)
CodeEditor.prototype.setMode = function(mode)
{
	this.code.setOption("mode", mode);
}

//Set onchange callback
CodeEditor.prototype.setOnChange = function(callback)
{
	this.code.on("change", callback);
}

//Set text
CodeEditor.prototype.setValue = function(text)
{
	this.code.setValue(text);
}

//Get text
CodeEditor.prototype.getValue = function()
{
	return this.code.getValue();
}

//Remove element
CodeEditor.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
CodeEditor.prototype.update = function(){}

//Update Interface
CodeEditor.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	this.code.setOption("theme", Settings.code.theme);
	this.code.setOption("lineNumbers", Settings.code.line_numbers);
	this.code.setOption("lineWrapping", Settings.code.line_wrapping);
	this.code.setOption("keyMap", Settings.code.keymap);
	this.code.setOption("autoCloseBrackets", Settings.code.auto_close_brackets);
	this.code.setOption("styleActiveLine", Settings.code.highlight_active_line);

	this.code.display.wrapper.style.fontSize = Settings.code.font_size + "px";
	this.code.setSize(this.size.x, this.size.y);
	this.code.refresh();

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}