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
	this.barColor = "#FFFFFF";
	this.sepColor = "#FFFFFF";
	this.panelColor = "#FFFFFF";
	this.resizeTabColor = "#FFFFFF";
	this.boxColor = "#FFFFFF";
	this.textColor = "#FFFFFF";
	this.iconColor = "#FFFFFF";

	//Button
	this.buttonColor = "#ddd";
	this.buttonOverColor = "#fff";
	this.buttonLightColor = "#fff";
	
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