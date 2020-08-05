import {WebGLRenderer} from "three";

/**
 * VR class handles all the virtual reality related tasks.
 * 
 * Can be used to detect if the host system is capable of displaying VR content and checks for the availability of WebXR and/or WebVR.
 * 
 * @class VRHandler
 */
function VRHandler(){}

/**
 * Flag checking if there is support for XR immersive VR mode.
 *
 * Checked on the library startup if XR is supported, while the check does not finish it is set to null.
 *
 * @attribute webXRSupported
 * @type {boolean}
 */
VRHandler.webXRAvailable = false;

/**
 * WebXR session if there is one active.
 *
 * @attribute webXRSession
 * @type {XRSession}
 */
VRHandler.webXRSession = null;

/**
 * Flag indicating if there are any VR displays available.
 *
 * Checked on the library bootup if WebVR is available, while the check does not finish it is set to null.
 *
 * @attribute webVRHasDisplay
 * @type {boolean}
 */
VRHandler.webVRAvailable = false;

/**
 * WebVR display if there is one active.
 *
 * @attribute webVRDisplay
 * @type {VRDisplay}
 */
VRHandler.webVRDisplay = null;

/**
 * Check if there is any VR API available, on the device.
 *
 * Checks if there is support for WebVR or WebXR.
 *
 * @method vrAvailable
 * @return {boolean} True if the browser supports vr.
 */
VRHandler.vrAvailable = function()
{
	return VRHandler.webXRAvailable || VRHandler.webVRAvailable;
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
VRHandler.enterVR = function(renderer, onSuccess)
{
	if(VRHandler.webXRAvailable)
	{
		VRHandler.getWebXRSession().then(function(session)
		{
			renderer.xr.enabled = true;
			renderer.xr.setSession(session);
			VRHandler.webXRSession = session;

			if(onSuccess !== undefined)
			{
				onSuccess();
			}
		});
	}
	else if(VRHandler.webVRAvailable)
	{
		VRHandler.getWebVRDisplay().then(function(display)
		{
			if(displays.length > 0)
			{
				VRHandler.webVRDisplay = displays[0];

				if(!VRHandler.webVRDisplay.isPresenting)
				{
					renderer.xr.enabled = true;
					renderer.xr.setDevice(VRHandler.webVRDisplay);
					VRHandler.webVRDisplay.requestPresent([{source : renderer.domElement}]);
					
					if(onSuccess !== undefined)
					{
						onSuccess();
					}
				}
			};
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
VRHandler.exitVR = function(renderer)
{
	if(VRHandler.webXRAvailable && VRHandler.webXRSession !== null)
	{
		renderer.xr.enabled = false;
		renderer.xr.setSession(null);

		VRHandler.webXRSession.end();
		VRHandler.webXRSession = null;
	}
	else if(VRHandler.webVRAvailable && VRHandler.webVRDisplay !== null)
	{
		if(VRHandler.webVRDisplay.isPresenting)
		{
			renderer.xr.enabled = false;
			renderer.xr.setDevice(null);

			VRHandler.webVRDisplay.exitPresent();
			VRHandler.webVRDisplay = null;
		}
	}
};

/**
 * Get WebXR session.
 *
 * @method getXRSession
 * @return {Promise} Promise used to get the XR session, receives the session as argument.
 */
VRHandler.getWebXRSession = function()
{
	if(!VRHandler.webXRAvailable)
	{
		return Promise.reject("WebXR support is not available.");
	}

	var sessionInit = {optionalFeatures: ["local-floor", "bounded-floor"]};

	return navigator.xr.requestSession("immersive-vr",  sessionInit);
};

/**
 * Used to get the first VR display available, the display is returned as argument of the onDisplay function.
 * 
 * @method getVRDisplays
 * @return {Promise} Promise used to get the display, receives the display as argument.
 */
VRHandler.getWebVRDisplay = function(onDisplay)
{
	if(!VRHandler.webVRAvailable)
	{
		return Promise.reject("WebVR support is not available.");
	}

	return navigator.getVRDisplays();
};

// Look into WebXR support (chrome, edge, ...)
if(navigator.xr !== undefined && navigator.xr.isSessionSupported !== undefined)
{
	navigator.xr.isSessionSupported("immersive-vr").then(function(supported)
	{
		VRHandler.webXRAvailable = supported;
	});
}
// Only look into WebVR support if WebXR is not available (firefox, samsung internet, ...)
else if(navigator.getVRDisplays !== undefined)
{
	navigator.getVRDisplays().then(function(displays)
	{
		VRHandler.webVRAvailable = displays.length > 0;
	});
}

export {VRHandler};