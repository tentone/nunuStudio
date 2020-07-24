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
 * Check if there is any VR API available, on the device.
 *
 * Checks if there is support for WebVR or WebXR.
 *
 * @method vrAvailable
 * @return {boolean} True if the browser supports vr.
 */
VRHandler.vrAvailable = function()
{
	return VRHandler.webVRAvailable() || VRHandler.webXRAvailable();
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
	if(VRHandler.webXRAvailable())
	{
		VRHandler.getXRSession(function(session)
		{
			renderer.xr.enabled = true;
			renderer.xr.setSession(session);

			if(onSuccess !== undefined)
			{
				onSuccess();
			}
		});
	}
	else if(VRHandler.webVRAvailable())
	{
		VRHandler.getVRDisplay(function(display)
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
VRHandler.exitVR = function(renderer)
{
	if(VRHandler.webXRAvailable())
	{
		VRHandler.getXRSession(function(session)
		{
			renderer.xr.enabled = false;
			renderer.xr.setSession(null);
		});
	}
	else if(VRHandler.webVRAvailable())
	{
		VRHandler.getVRDisplay(function(display)
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
VRHandler.webXRSession = null;

/**
 * Flag checking if there is support for XR immersive VR mode.
 *
 * Checked on the library startup if XR is supported, while the check does not finish it is set to null.
 *
 * @attribute webXRSupported
 * @type {boolean}
 */
VRHandler.webXRSupported = null;

if(navigator.xr !== undefined && navigator.xr.isSessionSupported !== undefined)
{
	navigator.xr.isSessionSupported("immersive-vr").then(function(supported)
	{
		VRHandler.webXRSupported = supported;
	});
}

/**
 * Check if host supports WebXR.
 * 
 * @method webXRAvailable
 * @return {boolean} True is WebVR is available.
 */
VRHandler.webXRAvailable = function()
{
	return navigator.xr !== undefined && navigator.xr.isSessionSupported !== undefined && VRHandler.webXRSupported !== false;
};

/**
 * Get WebXR session.
 *
 * @method getXRSession
 * @param {Function} onSession Function used to get the XR session, receives the session as argument.
 */
VRHandler.getXRSession = function(onSession)
{
	if(!VRHandler.webXRAvailable())
	{
		console.warn("nunuStudio: WebXR support is not available.");
		return;
	}

	if(VRHandler.webXRSession !== null)
	{
		onSession(VRHandler.webXRSession);
	}
	else
	{	
		navigator.xr.requestSession("immersive-vr").then(function(session)
		{
			VRHandler.webXRSession = session;
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
VRHandler.webVRDisplay = null;

/**
 * Flag indicating if there are any VR displays available.
 *
 * Checked on the library bootup if WebVR is available, while the check does not finish it is set to null.
 *
 * @attribute webVRHasDisplay
 * @type {boolean}
 */
VRHandler.webVRHasDisplay = null;

if(navigator.getVRDisplays !== undefined)
{
	navigator.getVRDisplays().then(function(displays)
	{
		VRHandler.webVRHasDisplay = displays.length > 0;
	});
}

/**
 * Check if host supports WebVR.
 * 
 * @method webVRAvailable
 * @return {boolean} True is WebVR is available.
 */
VRHandler.webVRAvailable = function()
{
	return navigator.getVRDisplays !== undefined && VRHandler.webVRHasDisplay !== false;
};

/**
 * Used to get the first VR display available, the display is returned as argument of the onDisplay function.
 * 
 * @method getVRDisplays
 * @param {Function} onDisplay Function used to get the display, receives the display as argument.
 */
VRHandler.getVRDisplay = function(onDisplay)
{
	if(!VRHandler.webVRAvailable())
	{
		console.warn("nunuStudio: WebVR support is not available.");
		return;
	}

	if(VRHandler.webVRDisplay !== null)
	{
		onDisplay(VRHandler.webVRDisplay);
	}
	else
	{
		navigator.getVRDisplays().then(function(displays)
		{
			if(displays.length > 0)
			{
				VRHandler.webVRDisplay = displays[0];
				onDisplay(displays[0]);
			}
			else
			{
				console.warn("nunuStudio: WebVR supported but no display is available.");
			}
		});
	}
};

export {VRHandler};