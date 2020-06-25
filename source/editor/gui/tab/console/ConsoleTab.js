import {Image} from "../../../../../core/resources/Image.js";
import {Key} from "../../../../../core/input/Key.js";
import {History} from "../../../../history/History.js";
import {TextureRenderer} from "../../../preview/TextureRenderer.js";
import {MaterialRenderer} from "../../../preview/MaterialRenderer.js";
import {Interface} from "../../../Interface.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {TabComponent} from "../../../../components/tabs/TabComponent.js";
import {SearchBox} from "../../../../components/SearchBox.js";
import {Form} from "../../../../components/Form.js";
import {ContextMenu} from "../../../../components/dropdown/ContextMenu.js";
import {Component} from "../../../../components/Component.js";
import {Texture, Material, Matrix4, Matrix3} from "three";

/**
 * Console tab is used for the user to access the system console output (that can be also accessed from the dev tools console).
 *
 * It is also possible to test some JS code directly on the console and navigate the project resources here.
 *
 * @class ConsoleTab
 * @extends {TabComponent}
 */
function ConsoleTab(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, "Console", Global.FILE_PATH + "icons/misc/console.png");

	var self = this;

	/**
	 * History of the last commands written into the console.
	 *
	 * Can be navigate to view previously used commands.
	 * 
	 * @attribute history
	 * @type {Array}
	 */
	this.history = [];

	/**
	 * History pointer for navigation of the history using the up arrow in the console input box.
	 * 
	 * @attribute historyPointer
	 * @type {number}
	 */
	this.historyPointer = -1;

	/**
	 * Stores a pointer to the original console functions.
	 *
	 * Used to enable and disable the virtual console.
	 *
	 * @attribute handlers
	 * @type {Object}
	 */
	this.handlers = 
	{
		log: window.console.log,
		info: window.console.info,
		warn: window.console.warn,
		error: window.console.error,
		clear: window.console.clear
	};

	/**
	 * Indicates if the virtual console is enable or disable.
	 *
	 * @attribute enable
	 * @type {boolean} 
	 */
	this.enabled = true;

	/**
	 * Search box to filter console content.
	 *
	 * @property search
	 * @type {SearchBox}
	 */
	this.search = new SearchBox(this.bar);
	this.search.setMode(Component.TOP_RIGHT);
	this.search.size.set(200, 25);
	this.search.position.set(1, 0);
	this.search.updateInterface();
	this.search.setOnChange(function()
	{
		self.filterByName(self.search.search.getText());
	});

	/**
	 * Console content division, where the messages are displayed.
	 *
	 * @attribute console
	 * @type {Component}
	 */
	this.content = document.createElement("div");
	this.content.style.position = "absolute";
	this.content.style.overflow = "auto";
	this.content.style.top = "0px";
	this.content.style.left = "0px";
	this.content.oncontextmenu = function(event)
	{
		var context = new ContextMenu(DocumentBody);
		context.size.set(150, 20);
		context.position.set(event.clientX, event.clientY);
		
		context.addOption(Locale.clear, function()
		{
			console.clear();
		});

		context.addOption(self.enabled ? Locale.disable : Locale.enable, function()
		{
			self.useConsole(!self.enabled);
		});

		context.updateInterface();
	};
	this.element.appendChild(this.content);

	/**
	 * Console input code division, where the user inserts JS code.
	 *
	 * @attribute input
	 * @type {DOM} 
	 */
	this.input = document.createElement("div");
	this.input.style.position = "absolute";
	this.input.style.overflow = "auto";
	this.input.style.bottom = "0px";
	this.input.style.left = "0px";
	this.element.appendChild(this.input);

	/**
	 * Command input division, shown as a codemirror code editor division for docs and hint access.
	 *
	 * @attribute code
	 * @type {CodeMirror}
	 */
	this.code = new CodeMirror(this.input, {
		dragDrop: false,
		firstLineNumber: 1,
		indentUnit: 0,
		indentWithTabs: false,
		keyMap: Editor.settings.code.keymap,
		lineNumbers: false,
		lineWrapping: false,
		matchBrackets: true,
		mode: "javascript",
		styleActiveLine: false,
		styleSelectedText: false,
		tabSize: Editor.settings.code.tabSize,
		theme: Editor.settings.code.theme,
		undoDepth: 0,
		value: "",
		viewportMargin: 1,
		wholeLineUpdateBefore: false,
		showMatchesOnScrollbar: false,
		lint: false,
		hintOptions:
		{
			hint: CodeMirror.hint.anyword,
			completeSingle: false
		}
	});

	/**
	 * Tern server used to provide code analysis.
	 *
	 * @attribute server
	 * @type {CodeMirror.TernServer}
	 */
	this.server = new CodeMirror.TernServer(
	{
		caseInsensitive: false,
		defs: Editor.ternDefinitions
	});

	this.code.on("keypress", function(cm, event)
	{
		var typed = String.fromCharCode(event.charCode);

		if(/[\w\.]/.exec(typed))
		{
			self.server.complete(cm);

			// If there is no tern sugestion suggest known words
			if(cm.state.completionActive == null || cm.state.completionActive.widget === null)
			{
				CodeMirror.commands.autocomplete(cm, null);
			}
		}
	});

	this.code.setOption("extraKeys",
	{
		"Enter": function(cm)
		{
			self.runCommand(self.code.getValue());
			self.code.setValue("");
		},
		"Up": function(cm)
		{
			if(self.history.length > 0 && self.historyPointer > 0)
			{
				self.setText(self.history[self.historyPointer--]);
			}
		}
	})

	this.input.oncontextmenu = function(event)
	{
		var context = new ContextMenu(DocumentBody);
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
		context.addOption(Locale.copy, function()
		{
			var text = self.code.getSelection();
			if(text !== "")
			{
				Editor.clipboard.set(text, "text");
			}
		});
		context.addOption(Locale.cut, function()
		{
			var text = self.code.getSelection();
			if(text !== "")
			{
				Editor.clipboard.set(text, "text");
				self.code.replaceSelection("");
			}
		});
		context.addOption(Locale.paste, function()
		{
			self.code.replaceSelection(Editor.clipboard.get("text"));
		});
		
		context.updateInterface();
	};

	this.useConsole(this.enabled);
}

ConsoleTab.prototype = Object.create(TabComponent.prototype);

/**
 * Run a user command from the console, commands are regular code, they have access to the global application space.
 *
 * Its possible to create global variables and access enviroments varibles for the program loaded into the platform.
 *
 * @method runCommand
 */
ConsoleTab.prototype.runCommand = function(code)
{
	var container = document.createElement("div");
	container.style.paddingLeft = "5px";
	container.style.paddingTop = "5px";
	container.style.paddingBottom = "5px";
	CodeMirror.runMode(code, "javascript", container, {
		mode: "javascript",
		tabSize: Editor.settings.code.tabSize,
		theme: Editor.settings.code.theme,
	});
	this.content.appendChild(container);
	
	try
	{
		window.program = Editor.program;
		var result = eval.call(window, code);
		if(result !== undefined) {
			console.log(result);
		}
	}
	catch(e)
	{
		console.error(e);
	}

	this.history.push(code);
	this.historyPointer = this.history.length - 1;
};

/**
 * Get stack trace up until the point that this method was called.
 *
 * Includes the place were this method was called.
 *
 * Result is returned as a array of strings and may be different from browser to browser.
 *
 * @static
 * @method getStackTrace
 */
ConsoleTab.getStackTrace = function()
{
	var stack;

	try
	{
		throw new Error("");
	}
	catch(error)
	{
		stack = error.stack || "";
		stack = stack.split("\n").map(function(line)
		{
			return line.trim();
		});
		return stack.splice(stack[0] == "Error" ? 2 : 1);
	}

	return "";
};

/**
 * Use this console as the predefined console.
 *
 * Overrides the browser provided window.console methods and displays the logs in this tab.
 *
 * @method useConsole
 * @param {boolean} enabled
 */
ConsoleTab.prototype.useConsole = function(enabled)
{
	var self = this;

	this.enabled = enabled;

	if(this.enabled)
	{
		window.console.log = function()
		{
			self.log(arguments);
			self.handlers.log.apply(null, arguments);
		};

		window.console.warn = function()
		{
			self.warn(arguments);
			self.handlers.warn.apply(null, arguments);
		};

		window.console.error = function()
		{
			self.error(arguments);
			self.handlers.error.apply(null, arguments);
		};

		window.console.clear = function()
		{
			self.clear(arguments);
			self.handlers.clear.apply(null, arguments);
		};
	}
	else
	{
		window.console.log = self.handlers.log;
		window.console.warn = self.handlers.warn;
		window.console.error = self.handlers.error;
		window.console.clear = self.handlers.clear;
	}
};

/**
 * Show a log messsage in the console.
 *
 * The content is display using different element depending on its type.
 *
 * Multiple objects are shown in different lines.
 *
 * @method warn
 */
ConsoleTab.prototype.log = function(args)
{
	for(var i = 0; i < args.length; i++)
	{
		this.content.appendChild(ConsoleTab.createMessage(args[i]));
	}

	// TODO <REMOVE CODE>
	// var stack = ConsoleTab.getStackTrace();
	// this.handlers.log(stack, stack[2]);
	// TODO <CHECK IF THIS Class is a part of the call stack to detect recursion>

	this.content.appendChild(ConsoleTab.createBar());
	this.content.scrollTop = Number.MAX_SAFE_INTEGER;
};

/**
 * Show an warning message from a console.warn() call.
 *
 * @method warn
 */
ConsoleTab.prototype.warn = function(args)
{
	for(var i = 0; i < args.length; i++)
	{
		var log = ConsoleTab.createMessage(args[i]);
		log.style.color = "var(--color-console-warn)";
		log.style.backgroundColor = "var(--color-console-warn-background)";
		this.content.appendChild(log);
	}

	this.content.appendChild(ConsoleTab.createBar());
	this.content.scrollTop = Number.MAX_SAFE_INTEGER;
};

/**
 * Show an error message from a console.error() call.
 *
 * @method error
 */
ConsoleTab.prototype.error = function(args)
{
	for(var i = 0; i < args.length; i++)
	{
		var log = ConsoleTab.createMessage(args[i]);
		log.style.color = "var(--color-console-error)";
		log.style.backgroundColor = "var(--color-console-error-background)";
		this.content.appendChild(log);
	}

	this.content.appendChild(ConsoleTab.createBar());
	this.content.scrollTop = Number.MAX_SAFE_INTEGER;
};

/**
 * Clear content from the console, remove all nodes created and reset GUI.
 *
 * @method clear 
 */
ConsoleTab.prototype.clear = function(args)
{
	this.history = [];

	while(this.content.hasChildNodes())
	{
    	this.content.removeChild(this.content.lastChild);
	}

	this.content.scrollTop = Number.MAX_SAFE_INTEGER;
};

ConsoleTab.prototype.updateSize = function()
{
	TabComponent.prototype.updateSize.call(this);

	this.content.style.height = (this.size.y - 30) + "px";
	this.content.style.width = this.size.x + "px";

	this.input.style.height = "30px";
	this.input.style.width = this.size.x + "px";
	this.code.setSize(this.size.x, 30);
};

/**
 * Create a new log division element and fill with information from the object.
 *
 * Checks the type of the object and creates the log accordingly.
 * 
 * @static
 * @method createMessage
 * @param {Object} object Object to be logged into the console.
 * @return {Element} Element created.
 */
ConsoleTab.createMessage = function(object)
{
	var log = document.createElement("div");
	log.style.width = "100%";
	log.style.color = "var(--color-light)";

	if(object === undefined)
	{
		var container = document.createElement("div");
		container.style.paddingLeft = "5px";
		container.style.paddingTop = "5px";
		container.style.paddingBottom = "5px";
		container.appendChild(document.createTextNode("undefined"));
		log.appendChild(container);
	}
	else if(object === null)
	{
		var container = document.createElement("div");
		container.style.paddingLeft = "5px";
		container.style.paddingTop = "5px";
		container.style.paddingBottom = "5px";
		container.appendChild(document.createTextNode("null"));
		log.appendChild(container);
	}
	else if(object instanceof Image)
	{
		var preview = document.createElement("img");
		preview.src = object.data;
		preview.height = 70;
		log.appendChild(preview);

		var table = document.createElement("table");
		table.style.display = "inline-block";

		var type = table.insertRow(0);
		type.insertCell(0).appendChild(document.createTextNode("Image"));

		var name = table.insertRow(1);
		name.insertCell(0).appendChild(document.createTextNode(Locale.name));
		name.insertCell(1).appendChild(document.createTextNode(object.name));

		var uuid = table.insertRow(2);
		uuid.insertCell(0).appendChild(document.createTextNode(Locale.uuid));
		uuid.insertCell(1).appendChild(document.createTextNode(object.uuid));

		var format = table.insertRow(3);
		format.insertCell(0).appendChild(document.createTextNode("Format"));
		format.insertCell(1).appendChild(document.createTextNode(object.format));

		var encoding = table.insertRow(4);
		encoding.insertCell(0).appendChild(document.createTextNode("Encoding"));
		encoding.insertCell(1).appendChild(document.createTextNode(object.encoding));

		log.appendChild(table);
	}
	else if(object instanceof Texture)
	{
		var preview = TextureRenderer.generateElement(object);
		preview.height = 70;
		log.appendChild(preview);

		var table = document.createElement("table");
		table.style.display = "inline-block";

		var type = table.insertRow(0);
		type.insertCell(0).appendChild(document.createTextNode(Locale.type));
		type.insertCell(1).appendChild(document.createTextNode(object.type));

		var name = table.insertRow(1);
		name.insertCell(0).appendChild(document.createTextNode(Locale.name));
		name.insertCell(1).appendChild(document.createTextNode(object.name));

		var uuid = table.insertRow(2);
		uuid.insertCell(0).appendChild(document.createTextNode(Locale.uuid));
		uuid.insertCell(1).appendChild(document.createTextNode(object.uuid));

		log.appendChild(table);
	}
	else if(object instanceof Material)
	{
		var preview = MaterialRenderer.generateElement(object);
		preview.height = 60;
		log.appendChild(preview);

		var table = document.createElement("table");
		table.style.display = "inline-block";

		var type = table.insertRow(0);
		type.insertCell(0).appendChild(document.createTextNode(Locale.type));
		type.insertCell(1).appendChild(document.createTextNode(object.type));

		var name = table.insertRow(1);
		name.insertCell(0).appendChild(document.createTextNode(Locale.name));
		name.insertCell(1).appendChild(document.createTextNode(object.name));

		var uuid = table.insertRow(2);
		uuid.insertCell(0).appendChild(document.createTextNode(Locale.uuid));
		uuid.insertCell(1).appendChild(document.createTextNode(object.uuid));

		log.appendChild(table);
	}
	else if(object.isVector2)
	{
		var table = document.createElement("table");
		table.style.display = "inline-block";

		var coord = table.insertRow(0);
		coord.insertCell(0).appendChild(document.createTextNode("X"));
		coord.insertCell(1).appendChild(document.createTextNode("Y"));

		var value = table.insertRow(1);
		value.insertCell(0).appendChild(document.createTextNode(object.x));
		value.insertCell(1).appendChild(document.createTextNode(object.y));

		log.appendChild(table);
	}
	else if(object.isVector3)
	{
		var table = document.createElement("table");
		table.style.display = "inline-block";

		var coord = table.insertRow(0);
		coord.insertCell(0).appendChild(document.createTextNode("X"));
		coord.insertCell(1).appendChild(document.createTextNode("Y"));
		coord.insertCell(2).appendChild(document.createTextNode("Z"));

		var value = table.insertRow(1);
		value.insertCell(0).appendChild(document.createTextNode(object.x));
		value.insertCell(1).appendChild(document.createTextNode(object.y));
		value.insertCell(2).appendChild(document.createTextNode(object.z));

		log.appendChild(table);
	}
	else if(object.isVector4 || object.isQuaternion)
	{
		var table = document.createElement("table");
		table.style.display = "inline-block";

		var coord = table.insertRow(0);
		coord.insertCell(0).appendChild(document.createTextNode("X"));
		coord.insertCell(1).appendChild(document.createTextNode("Y"));
		coord.insertCell(2).appendChild(document.createTextNode("Z"));
		coord.insertCell(3).appendChild(document.createTextNode("W"));

		var value = table.insertRow(1);
		value.insertCell(0).appendChild(document.createTextNode(object.x));
		value.insertCell(1).appendChild(document.createTextNode(object.y));
		value.insertCell(2).appendChild(document.createTextNode(object.z));
		value.insertCell(3).appendChild(document.createTextNode(object.w));

		log.appendChild(table);
	}
	else if(object instanceof Matrix4)
	{
		var table = document.createElement("table");
		table.style.display = "inline-block";

		for(var i = 0, j = 0; i < 16; i += 4, j++)
		{
			var row = table.insertRow(j);
			row.insertCell(0).appendChild(document.createTextNode(object.elements[i]));
			row.insertCell(1).appendChild(document.createTextNode(object.elements[i + 1]));
			row.insertCell(2).appendChild(document.createTextNode(object.elements[i + 2]));
			row.insertCell(3).appendChild(document.createTextNode(object.elements[i + 3]));
		}

		log.appendChild(table);
	}
	else if(object instanceof Matrix3)
	{
		var table = document.createElement("table");
		table.style.display = "inline-block";

		for(var i = 0, j = 0; i < 9; i += 3, j++)
		{
			var row = table.insertRow(j);
			row.insertCell(0).appendChild(document.createTextNode(object.elements[i]));
			row.insertCell(1).appendChild(document.createTextNode(object.elements[i + 1]));
			row.insertCell(2).appendChild(document.createTextNode(object.elements[i + 2]));
		}

		log.appendChild(table);
	}
	else if(object instanceof Error)
	{
		var container = document.createElement("div");
		container.style.paddingLeft = "5px";
		container.style.paddingTop = "5px";
		container.style.paddingBottom = "5px";
		container.appendChild(document.createTextNode(object = object.message));
		log.appendChild(container);
	}
	else if(object instanceof Object)
	{
		var container = document.createElement("div");
		container.style.paddingLeft = "5px";
		container.style.paddingTop = "5px";
		container.style.paddingBottom = "5px";

		try
		{
			container.appendChild(document.createTextNode(JSON.stringify(object, null, "\t")));
		}
		catch(e)
		{
			container.appendChild(document.createTextNode(object));
		}

		log.appendChild(container);
	}
	else
	{
		var container = document.createElement("div");
		container.style.paddingLeft = "5px";
		container.style.paddingTop = "5px";
		container.style.paddingBottom = "5px";
		container.appendChild(document.createTextNode(object));
		log.appendChild(container);
	}

	return log;
};

/**
 * Create a separator bar division.
 *
 * @static
 * @method createBar
 * @return {Element} Element created.
 */
ConsoleTab.createBar = function()
{
	var bar = document.createElement("div");
	bar.style.width = "100%";
	bar.style.height = "1px";
	bar.style.backgroundColor = "var(--bar-color)";
	return bar;
};

export {ConsoleTab};