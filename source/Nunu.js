"use strict";

/**
 * nunuStudio
 * MIT license (http://opensource.org/licenses/MIT)
 *   
 * Class used to store nunuStudio development version and timestamp.
 *
 * Contains methods to check browser feature support.
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
Nunu.VERSION = "V0.9.1 Beta";

/**
 * Stores the nunu runtime dev timestamp.
 * 
 * @attribute TIMESTAMP
 * @type {String}
 */
Nunu.TIMESTAMP = "201708250247";

/**
 * Check if host supports WebVR and if there is a VR display available.
 * 
 * @method webvrAvailable
 * @return {boolean} True is WebVR is available.
 */
Nunu.webvrAvailable = function()
{
	return navigator.getVRDisplays !== undefined;
};

/**
 * Used to get the first VR display available, the display is returned as argument of the getDisplay function.
 * 
 * @method getVRDisplays
 * @param {Function} getDisplay Function used to get the display, receives the display as argument.
 */
Nunu.getVRDisplays = function(getDisplay)
{
	if(navigator.getVRDisplays === undefined)
	{
		console.warn("nunuStudio: WebVR is not supported.");
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
 * Check if there is some element on fullscreen mode.
 *
 * Returns true even the fullscreen element is not related with the app.
 * 
 * @method isFullscreen
 * @return {boolean} True if there is some element in fullscreen mode.
 */
Nunu.isFullscreen = function()
{
	return document.webkitIsFullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.webkitIsFullScreen || document.fullscreen || false;
};
