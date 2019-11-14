"use strict";

/**
 * nunuStudio core main file.
 *   
 * Store nunuStudio development version and timestamp and contains global method to check browser feature support.
 * 
 * @class Nunu
 * @module Runtime
 */
function Nunu(){}

/**
 * nunuStudio
 * 
 * @attribute NAME
 * @type {String}
 * @default "nunuStudio"
 */
Nunu.NAME = "nunuStudio";

/**
 * Stores the nunu runtime version.
 * 
 * @attribute VERSION
 * @type {String}
 */
Nunu.VERSION = "<PLACEHOLDER_VERSION>";

/**
 * Stores the nunu runtime dev timestamp.
 * 
 * @attribute TIMESTAMP
 * @type {String}
 */
Nunu.TIMESTAMP = "<PLACEHOLDER_TIMESTAMP>";

/**
 * Repository branch, used to track the version after publishing.
 * 
 * @static
 * @attribute REPOSITORY_BRANCH
 * @type {String}
 */
Nunu.REPOSITORY_BRANCH = "<PLACEHOLDER_REPOSITORY_BRANCH>";

/**
 * Repository commit uuid, used to track the version after publishing.
 * 
 * @static
 * @attribute REPOSITORY_COMMIT
 * @type {String}
 */
Nunu.REPOSITORY_COMMIT = "<PLACEHOLDER_REPOSITORY_COMMIT>";

/**
 * NWJS platform, used for desktop version.
 *
 * @static
 * @attribute NWJS
 * @type {Number}
 */
Nunu.NWJS = 200;

/**
 * Running inside of a regular web browser.
 *
 * @static
 * @attribute BROWSER
 * @type {Number}
 */
Nunu.BROWSER = 201;

/**
 * Cordova platform, used for mobile versions.
 *
 * @static
 * @attribute CORDOVA
 * @type {Number}
 */
Nunu.CORDOVA = 202;

/**
 * Check if nunu if running in development mode.
 *
 * @method developmentMode
 * @return {boolean} True if running as development mode.
 */
Nunu.developmentMode = function()
{
	return Nunu.TIMESTAMP === "<PLACEHOLDER_TIMESTAMP>";
};

/**
 * Check if host supports WebVR and if there is a VR display available.
 * 
 * @method webVRAvailable
 * @return {boolean} True is WebVR is available.
 */
Nunu.webVRAvailable = function()
{
	// TODO <VR SUPPORT>
	return true;
	//return navigator.getVRDisplays !== undefined;
};

/**
 * Used to get the first VR display available, the display is returned as argument of the getDisplay function.
 * 
 * @method getVRDisplays
 * @param {Function} getDisplay Function used to get the display, receives the display as argument.
 */
/*Nunu.getVRDisplays = function(getDisplay)
{
	if(!Nunu.webVRAvailable())
	{
		console.warn("nunuStudio: WebVR support is not available.");
		return;
	}

	navigator.getVRDisplays().then(function(displays)
	{
		if(displays.length > 0)
		{
			getDisplay(displays[0]);
		}
		else
		{
			console.warn("nunuStudio: WebVR supported but no display is available.");
		}
	});
};*/

/**
 * Get the query parameter from the browser URL.
 *
 * @method getQueryParameters
 * @return {Object} Object with parameters read from the URL.
 */
Nunu.getQueryParameters = function()
{
	var values = location.search.substring(1).split("&");
	var parameters = {};
	for(var i = 0; i < values.length; i++)
	{
		var pair = values[i].split("=");
		if(pair.length > 1)
		{
			var name = unescape(pair[0]).replace(new RegExp("\"", "g"), "");
			var value = unescape(pair[1]).replace(new RegExp("\"", "g"), "");
			parameters[name] = value;
		}
	}

	return parameters;
};


/**
 * Create a web worker from code written in a string.
 *
 * Uses a blob to inject the code and loads it from and URL object.
 *
 * @method createWorker
 * @param {String} code Javascript code for this worker.
 * @param {Function} onMessage On message worker callback.
 * @return {Worker} Returns a worker instance (for comunication).
 */
Nunu.createWorker = function(code, onMessage)
{
	var blob = new Blob([code], {type: "application/javascript"});
	var worker = new Worker(URL.createObjectURL(blob));

	if(onMessage !== undefined)
	{
		worker.onmessage = onMessage;
	}
	
	return worker;
};

/**
 * Check if host supports WebAudio.
 *
 * @method webAudioAvailable
 * @return {boolean} True if WebAudio is available.
 */
Nunu.webAudioAvailable = function()
{
	return window.AudioContext !== undefined || window.webkitAudioContext !== undefined;
};

/**
 * Check if host supports WebGL, only checks for WebGL 1.0 support.
 *
 * @method webglAvailable
 * @return {boolean} True if WebGL is available.
 */
Nunu.webglAvailable = function()
{
	try
	{
		var canvas = document.createElement("canvas"); 
		var context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		var extensions = context.getSupportedExtensions();
		return true;
	}
	catch(e)
	{
		return false;
	}

	return false;
};

/**
 * Check in wich platform the enviroment is running.
 *
 * Possible return values are:
 *    - Nunu.NWJS
 *    - Nunu.BROWSER
 *    - Nunu.CORDOVA
 *
 * @method getPlatform
 * @return {Number} Indicates the platform type.
 */
Nunu.getPlatform = function()
{
	if(window.nw !== undefined)
	{
		return Nunu.NWJS;
	}
	else if(window.cordova !== undefined)
	{
		return Nunu.CORDOVA;
	}
	
	return Nunu.BROWSER;
};

/**
 * Check if nunu is running inside NWJS.
 *
 * @method runningOnDesktop
 * @return {boolean} True if running inside NWJS 
 */
Nunu.runningOnDesktop = function()
{
	return window.nw !== undefined;
};


/**
 * Open a webpage on a new window.
 *
 * On desktop and mobile it will open the default browser.
 *
 * On the web it will open as a popup. 
 *
 * @method openWebpage
 */
Nunu.openWebpage = function(url)
{
	if(Nunu.runningOnDesktop())
	{
		require("nw.gui").Shell.openExternal(url);
	}
	else
	{
		window.open(url);
	}
};

/**
 * Check if there is some element on fullscreen mode.
 *
 * Returns true even the fullscreen element is not related with the app.
 * 
 * @method isFullscreen
 * @return {boolean} True if there is some element in fullscreen mode.
 */
Nunu.isFullscreen = function()
{
	return document.webkitIsFullScreen === true || document.mozFullScreen === true || document.webkitIsFullScreen === true || document.webkitIsFullScreen === true || document.fullscreen === true || false;
};


/**
 * Set an element into fullscreen mode or exit out of fullscreen mode.
 *
 * Uses isFullscreen to check if the application is running in fullscreen mode already.
 * 
 * @method setFullscreen
 * @param {boolean} fullscreen If true the application will enter fullscreen mode, if false it will exit, if undefine it will toggle the value.
 * @param {DOM} element DOM element to put into fullscreen.
 */
Nunu.setFullscreen = function(fullscreen, element)
{
	var isFullscreen = Nunu.isFullscreen();
	
	if(fullscreen === undefined)
	{
		fullscreen = !isFullscreen;	
	}

	if(fullscreen === true)
	{
		if(element === undefined)
		{
			element = document.body;
		}

		if(isFullscreen === false)
		{
			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen;
			
			if(element.requestFullscreen !== undefined)
			{
				element.requestFullscreen();
			}
		}
	}
	else
	{
		if(isFullscreen === true)
		{		
			document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
			
			if(document.exitFullscreen !== undefined)
			{
				document.exitFullscreen();
			}
		}
	}
};
