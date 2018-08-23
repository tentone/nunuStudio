"use strict";

function ThemeDark()
{
	this.name = "dark";
	this.author = "tentone";
	this.info = "";
	this.version = "v1.0";

	//Font
	this.font = "Arial";

	//Color
	this.barColor = "#222222";
	this.sepColor = "#292929";
	this.panelColor = "#333333";
	this.resizeTabColor = "#222222";
	this.boxColor = "#444444";
	this.textColor = "#FFFFFF";
	this.iconColor = "#FFFFFF";

	//Button
	this.buttonColor = "#222222";
	this.buttonOverColor = "#555555";
	this.buttonLightColor = "#333333";
	
	//Audio player
	this.audioTrack = "#222222";
	this.audioScrubber = "#FFFFFF";
	this.audioProgress = "#555555";

	//Body
	document.body.style.fontFamily = this.font;
	document.body.style.color = this.textColor;
	document.body.style.fontSize = "12px";
}

ThemeManager.register(ThemeDark, "dark");
