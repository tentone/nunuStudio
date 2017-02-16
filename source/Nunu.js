/**
 * Modules in this bundle
 * @license
 *
 * nunuStudio:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Tentone <tentone@outlook.com>
 */

"use strict";

/**
 * Class used to store nunu version and timstamp used for development
 * 
 * @class Nunu
 * @module Runtime
 */
function Nunu(){}

/**
 * @attribute NAME
 * @type {String}
 * @default "nunuStudio"
 */
Nunu.NAME = "nunuStudio";

/**
 * Stores the nunu runtime version
 * 
 * @attribute VERSION
 * @type {String}
 */
Nunu.VERSION = "V0.8.9.20 Alpha";

/**
 * Stores the nunu runtime timestamp
 * 
 * @attribute TIMESTAMP
 * @type {String}
 */
Nunu.TIMESTAMP = "201702162218";

/**
 * Check if host supports WebVR
 * 
 * @method webvrAvailable
 * @return {boolean} True is webVR is available
 */
Nunu.webvrAvailable = function()
{
	return navigator.getVRDisplays !== undefined;
};
