"use strict";

function ThemeLight()
{
	this.name = "light";

	this.bar_color = "#666666";
	this.panel_color = "#999999";
	this.resize_tab_color = "#666666";
	this.button_color = "#666666";
	this.button_over_color = "#CCCCCC";
	this.button_light_color = "#999999";
	this.box_color = "#DDDDDD";
	this.text_color = "#000000";
	this.icon_color = "#000000";

	document.body.style.color = this.text_color;
	document.body.style.fontFamily = "Arial";
	document.body.style.fontSize = "12px";
}

Theme.register(ThemeLight, "light");