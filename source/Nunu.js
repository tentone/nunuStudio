"use strict";

function Nunu(){}

Nunu.NAME = "nunuStudio";
Nunu.VERSION = "V0.8.9.16 Alpha";
Nunu.TIMESTAMP = "201612280259";

//Check if webvr is available
Nunu.webvrAvailable = function()
{
	return navigator.getVRDisplays !== undefined;
}
