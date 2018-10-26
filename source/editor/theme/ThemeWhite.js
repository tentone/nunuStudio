"use strict";

function ThemeWhite()
{
	this.name = "white";
	this.author = "nothersingame";
	this.info = "";
	this.version = "v1.0";

	//Font
	this.font = "Arial";

	//Color
	this.barColor = "#ccc";
	this.sepColor = "#FFFFFF";
	this.panelColor = "#bbb";
	this.resizeTabColor = "#aaa";
	this.boxColor = "#ddd";
	this.textColor = "#555";
	this.iconColor = "#FFFFFF";

	//Button
	this.buttonColor = "#ccc";
	this.buttonOverColor = "#bbb";
	this.buttonLightColor = "#bbb";
	
	//Audio player
	this.audioTrack = "#FFFFFF";
	this.audioScrubber = "#FFFFFF";
	this.audioProgress = "#FFFFFF";

	//Body
	document.body.style.fontFamily = this.font;
	document.body.style.color = this.textColor;
	document.body.style.fontSize = "12px";
}

ThemeManager.register(ThemeWhite, "white");