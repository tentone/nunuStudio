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
	this.bar_color = "#666666";
	this.panel_color = "#999999";
	this.resize_tab_color = "#666666";
	this.button_color = "#666666";
	this.button_over_color = "#CCCCCC";
	this.button_light_color = "#999999";
	this.box_color = "#DDDDDD";
	this.text_color = "#FFFFFF";
	this.icon_color = "#FFFFFF";

	//Body
	document.body.style.fontFamily = "Arial";
	document.body.style.fontSize = "12px";
	document.body.style.color = this.text_color;
}

Theme.register(ThemeLight, "light");