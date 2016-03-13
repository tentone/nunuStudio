const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

//Quit when all windows are closed.
app.on("window-all-closed", function()
{
	//On OS X it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
	if(process.platform != "darwin")
	{
		app.quit();
	}
});

//This method will be called when Electron has finished initialization and is ready to create browser windows.
app.on("ready", function()
{
	mainWindow = new BrowserWindow({width: 800, height: 600});
	mainWindow.loadURL("file://" + __dirname + "/editor.html");
	mainWindow.on("closed", function()
	{
		mainWindow = null;
	});
});