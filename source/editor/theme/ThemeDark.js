"use strict";

function ThemeDark()
{
	//Metadata
	this.name = "dark";
	this.info = "default nunuStudio theme";
	this.version = "v1.0";
	this.author = "Tentone";

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
	document.body.style.fontSize = "12px";
	document.body.style.color = this.textColor;
}

Theme.register(ThemeDark, "dark");