"use strict";

function ThemeLight()
{
	//Metadata
	this.name = "light";
	this.info = "";
	this.version = "V1.0";
	this.author = "Tentone";

	//Font
	this.font = "Arial";

	//Colors
	this.barColor = "#666666";
	this.panelColor = "#999999";
	this.resizeTabColor = "#666666";
	this.buttonColor = "#666666";
	this.buttonOverColor = "#CCCCCC";
	this.buttonLightColor = "#999999";
	this.boxColor = "#DDDDDD";
	this.textColor = "#FFFFFF";
	this.iconColor = "#FFFFFF";

	//Body
	document.body.style.fontFamily = this.font;
	document.body.style.fontSize = "12px";
	document.body.style.color = this.textColor;
}

Theme.register(ThemeLight, "light");