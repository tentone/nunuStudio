var app = require("app"); // Module to control application life.
var BrowserWindow = require("browser-window"); // Module to create native browser window.

//Report crashes to our server.
//require('crash-reporter').start();

//Keep a global reference of the window object
var mainWindow = null;

// This method will be called when Electron has done everything initialization and ready for creating browser windows.
app.on("ready", function()
{
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600});

	//Load index.html
	mainWindow.loadUrl("file://" + __dirname + "/index.html");

	// Open the devtools.
	//mainWindow.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on("closed", function()
	{
		mainWindow = null;
		app.quit();
	});
});