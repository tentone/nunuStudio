import {WebGLRenderer} from "three";

import "../three/animation/AnimationClip.js";
import "../three/animation/KeyframeTrack.js";
import "../three/cameras/Camera.js";
import "../three/core/BufferAttribute.js";
import "../three/core/InstancedBufferAttribute.js";
import "../three/core/InterleavedBuffer.js";
import "../three/core/InterleavedBufferAttribute.js";
import "../three/core/Object3D.js";
import "../three/lights/LightShadow.js";
import "../three/loaders/BufferGeometryLoader.js";
import "../three/materials/Material.js";
import "../three/objects/Points.js";
import "../three/objects/Skeleton.js";
import "../three/scenes/Fog.js";
import "../three/textures/Texture.js";

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
 * @type {string}
 * @default "nunuStudio"
 */
Nunu.NAME = "nunuStudio";

/**
 * Stores the nunu runtime version.
 * 
 * @attribute VERSION
 * @type {string}
 */
Nunu.VERSION = "<PLACEHOLDER_VERSION>";

/**
 * Stores the nunu runtime dev timestamp.
 * 
 * @attribute TIMESTAMP
 * @type {string}
 */
Nunu.TIMESTAMP = "<PLACEHOLDER_TIMESTAMP>";

/**
 * Repository branch, used to track the version after publishing.
 * 
 * @static
 * @attribute REPOSITORY_BRANCH
 * @type {string}
 */
Nunu.REPOSITORY_BRANCH = "<PLACEHOLDER_REPOSITORY_BRANCH>";

/**
 * Repository commit uuid, used to track the version after publishing.
 * 
 * @static
 * @attribute REPOSITORY_COMMIT
 * @type {string}
 */
Nunu.REPOSITORY_COMMIT = "<PLACEHOLDER_REPOSITORY_COMMIT>";

/**
 * NWJS platform, used for desktop version.
 *
 * @static
 * @attribute NWJS
 * @type {number}
 */
Nunu.NWJS = 200;

/**
 * Running inside of a regular web browser.
 *
 * @static
 * @attribute BROWSER
 * @type {number}
 */
Nunu.BROWSER = 201;

/**
 * Cordova platform, used for mobile versions.
 *
 * @static
 * @attribute CORDOVA
 * @type {number}
 */
Nunu.CORDOVA = 202;

/**
 * Import stuff from a namespace to another target namespace.
 *
 * If not target is specified window is used.
 *
 * @static
 * @method copyNamespace
 */
Nunu.copyNamespace = function(namespace, target)
{
	if(target === undefined)
	{
		target = window;
	}

	for(var i in namespace)
	{
		if(!(i in target))
		{
			target[i] = namespace[i];
		}
	}
};

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
 * Check if there is any VR API available, on the device.
 *
 * Checks if there is support for WebVR or WebXR.
 *
 * @method vrAvailable
 * @return {boolean} True if the browser supports vr.
 */
Nunu.vrAvailable = function()
{
	return Nunu.webVRAvailable() || Nunu.webXRAvailable();
};

/**
 * Enter virtual reality mode using WebXR or WebVR depending on the API available.
 *
 * If booth API are available the WebXR API is used.
 *
 * When displaying VR content the display.requestAnimationFrame should be used to call the render method.
 *
 * @method enterVR
 * @param {WebGLRenderer} renderer Renderer used to draw the scene.
 * @param {Function} onSuccess Method called if the application entered VR successfully.
 */
Nunu.enterVR = function(renderer, onSuccess)
{
	if(Nunu.webXRAvailable())
	{
		Nunu.getXRSession(function(session)
		{
			renderer.xr.enabled = true;
			renderer.xr.setSession(session);

			if(onSuccess !== undefined)
			{
				onSuccess();
			}
		});
	}
	else if(Nunu.webVRAvailable())
	{
		Nunu.getVRDisplay(function(display)
		{
			if(!display.isPresenting)
			{
				renderer.xr.enabled = true;
				renderer.xr.setDevice(display);
				display.requestPresent([{source : renderer.domElement}]);
				
				if(onSuccess !== undefined)
				{
					onSuccess();
				}
			}
		});
	}
	else
	{
		console.warn("nunuStudio: VR support is not available.");
	}
};

/**
 * Enter virtual reality mode, if the application is not running on VR mode does not do anything.
 *
 * @method exitVR
 * @param {WebGLRenderer} renderer Renderer used to draw the scene.
 */
Nunu.exitVR = function(renderer)
{
	if(Nunu.webXRAvailable())
	{
		Nunu.getXRSession(function(session)
		{
			renderer.xr.enabled = false;
			renderer.xr.setSession(null);
		});
	}
	else if(Nunu.webVRAvailable())
	{
		Nunu.getVRDisplay(function(display)
		{
			if(display.isPresenting)
			{
				renderer.xr.enabled = false;
				renderer.xr.setDevice(null);
				device.exitPresent();
			}
		});
	}
};

/**
 * WebXR session created.
 *
 * @attribute webXRSession
 * @type {XRSession}
 */
Nunu.webXRSession = null;

/**
 * Flag checking if there is support for XR immersive VR mode.
 *
 * Checked on the library startup if XR is supported, while the check does not finish it is set to null.
 *
 * @attribute webXRSupported
 * @type {boolean}
 */
Nunu.webXRSupported = null;

if(navigator.xr !== undefined && navigator.xr.isSessionSupported !== undefined)
{
	navigator.xr.isSessionSupported("immersive-vr").then(function(supported)
	{
		Nunu.webXRSupported = supported;
	});
}

/**
 * Check if host supports WebXR.
 * 
 * @method webXRAvailable
 * @return {boolean} True is WebVR is available.
 */
Nunu.webXRAvailable = function()
{
	return navigator.xr !== undefined && navigator.xr.isSessionSupported !== undefined && Nunu.webXRSupported !== false;
};

/**
 * Get WebXR session.
 *
 * @method getXRSession
 * @param {Function} onSession Function used to get the XR session, receives the session as argument.
 */
Nunu.getXRSession = function(onSession)
{
	if(!Nunu.webXRAvailable())
	{
		console.warn("nunuStudio: WebXR support is not available.");
		return;
	}

	if(Nunu.webXRSession !== null)
	{
		onSession(Nunu.webXRSession);
	}
	else
	{	
		navigator.xr.requestSession("immersive-vr",{optionalFeatures: ["local-floor", "bounded-floor"]}).then(function(session)
		{
			Nunu.webXRSession = session;
			onSession(session);
		});
	}
}

/**
 * Web VR display obtained.
 *
 * @attribute webVRDisplay
 * @type {VRDisplay}
 */
Nunu.webVRDisplay = null;

/**
 * Flag indicating if there are any VR displays available.
 *
 * Checked on the library bootup if WebVR is available, while the check does not finish it is set to null.
 *
 * @attribute webVRHasDisplay
 * @type {boolean}
 */
Nunu.webVRHasDisplay = null;

if(navigator.getVRDisplays !== undefined)
{
	navigator.getVRDisplays().then(function(displays)
	{
		Nunu.webVRHasDisplay = displays.length > 0;
	});
}

/**
 * Check if host supports WebVR.
 * 
 * @method webVRAvailable
 * @return {boolean} True is WebVR is available.
 */
Nunu.webVRAvailable = function()
{
	return navigator.getVRDisplays !== undefined && Nunu.webVRHasDisplay !== false;
};

/**
 * Used to get the first VR display available, the display is returned as argument of the onDisplay function.
 * 
 * @method getVRDisplays
 * @param {Function} onDisplay Function used to get the display, receives the display as argument.
 */
Nunu.getVRDisplay = function(onDisplay)
{
	if(!Nunu.webVRAvailable())
	{
		console.warn("nunuStudio: WebVR support is not available.");
		return;
	}

	if(Nunu.webVRDisplay !== null)
	{
		onDisplay(Nunu.webVRDisplay);
	}
	else
	{
		navigator.getVRDisplays().then(function(displays)
		{
			if(displays.length > 0)
			{
				Nunu.webVRDisplay = displays[0];
				onDisplay(displays[0]);
			}
			else
			{
				console.warn("nunuStudio: WebVR supported but no display is available.");
			}
		});
	}
};

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
 * @param {string} code Javascript code for this worker.
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
Nunu.webGLAvailable = function()
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
 * @return {number} Indicates the platform type.
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
		window.require("nw.gui").Shell.openExternal(url);
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
 * @param {Component} element DOM element to put into fullscreen.
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
export {Nunu};