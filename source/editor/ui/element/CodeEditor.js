"use strict";

function CodeEditor(parent)
{
	Element.call(this, parent);

	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panelColor;

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
		if(!Editor.keyboard.keyPressed(Keyboard.CTRL) && key >= Keyboard.A && key <= Keyboard.Z)
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
		context.position.set(event.clientX, event.clientY);
		
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
}

CodeEditor.prototype = Object.create(Element.prototype);

//Set language mode (javascript, glsl, etc)
CodeEditor.prototype.setMode = function(mode)
{
	this.code.setOption("mode", mode);
};

//Set onchange callback
CodeEditor.prototype.setOnChange = function(callback)
{
	this.code.on("change", callback);
};

//Set text
CodeEditor.prototype.setValue = function(text)
{
	this.code.setValue(text);
};

//Get text
CodeEditor.prototype.getValue = function()
{
	return this.code.getValue();
};

//Update Interface
CodeEditor.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	
		this.code.setOption("theme", Settings.code.theme);
		this.code.setOption("lineNumbers", Settings.code.lineNumbers);
		this.code.setOption("lineWrapping", Settings.code.lineWrapping);
		this.code.setOption("keyMap", Settings.code.keymap);
		this.code.setOption("autoCloseBrackets", Settings.code.autoCloseBrackets);
		this.code.setOption("styleActiveLine", Settings.code.highlightActiveLine);
		this.code.setOption("showMatchesOnScrollbar", Settings.code.showMatchesOnScrollbar); 
		this.code.display.wrapper.style.fontSize = Settings.code.fontSize + "px";
		this.code.setSize(this.size.x, this.size.y);
		this.code.refresh();
	}
	else
	{
		this.element.style.display = "none";
	}
};