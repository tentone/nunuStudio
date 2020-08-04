import {WebGLRenderer} from "three";

/**
 * AR class handles all the agumented reality related tasks.
 * 
 * Can be used to detect if the host system is capable of displaying AR content and checks for the availability of WebXR with the required modes.
 * 
 * @class ARHandler
 */
function ARHandler(){}

/**
 * Flag checking if there is support for XR immersive AR mode.
 *
 * @attribute webXRSupported
 * @type {boolean}
 */
ARHandler.webXRAvailable = false;

/**
 * WebXR session if there is one active.
 *
 * @attribute webXRSession
 * @type {XRSession}
 */
ARHandler.webXRSession = null;

/**
 * Check if there is any AR API available, on the device.
 *
 * Checks if there is support for WebAR or WebXR.
 *
 * @method arAvailable
 * @return {boolean} True if the browser supports AR.
 */
ARHandler.arAvailable = function()
{
	return ARHandler.webXRAvailable;
};

/**
 * Enter virtual reality mode using WebXR or WebAR depending on the API available.
 *
 * If booth API are available the WebXR API is used.
 *
 * When displaying AR content the display.requestAnimationFrame should be used to call the render method.
 *
 * @method enterAR
 * @param {WebGLRenderer} renderer Renderer used to draw the scene.
 * @param {Function} onSuccess Method called if the application entered AR successfully.
 */
ARHandler.enterAR = function(renderer, onSuccess)
{
	if(ARHandler.webXRAvailable)
	{
		ARHandler.getWebXRSession().then(function(session)
		{
			renderer.xr.enabled = true;
			renderer.xr.setReferenceSpaceType("local");
			renderer.xr.setSession(session);

			ARHandler.webXRSession = session;

			if(onSuccess !== undefined)
			{
				onSuccess();
			}
		});
	}
	else
	{
		console.warn("nunuStudio: AR support is not available.");
	}
};

/**
 * Enter virtual reality mode, if the application is not running on AR mode does not do anything.
 *
 * @method exitAR
 * @param {WebGLRenderer} renderer Renderer used to draw the scene.
 */
ARHandler.exitAR = function(renderer)
{
	if(ARHandler.webXRAvailable && ARHandler.webXRSession !== null)
	{
		renderer.xr.enabled = false;
		renderer.xr.setSession(null);

		ARHandler.webXRSession.end();
		ARHandler.webXRSession = null;
	}
};

/**
 * Get WebXR session.
 *
 * @method getXRSession
 * @return {Promise} Promise used to get the XR session, receives the session as argument.
 */
ARHandler.getWebXRSession = function()
{
	if(!ARHandler.webXRAvailable)
	{
		return Promise.reject("WebXR support is not available.");
	}

	return navigator.xr.requestSession("immersive-ar", {});
};

// Look into WebXR support (chrome, edge, ...)
if(navigator.xr !== undefined && navigator.xr.isSessionSupported !== undefined)
{
	navigator.xr.isSessionSupported("immersive-ar").then(function(supported)
	{
		ARHandler.webXRAvailable = true;
	});
}

export {ARHandler};