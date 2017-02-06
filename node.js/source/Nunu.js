/**
 * Modules in this bundle
 * @license
 *
 * nunuStudio:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Tentone <tentone@outlook.com>
 */

"use strict";

function Nunu(){}

Nunu.NAME = "nunuStudio";
Nunu.VERSION = "V0.8.9.19 Alpha";
Nunu.TIMESTAMP = "201702051747";

//Check if webvr is available
Nunu.webvrAvailable = function()
{
	return navigator.getVRDisplays !== undefined;
};
