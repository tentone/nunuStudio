"use strict";

function ThemeDark()
{
	this.name = "dark";

	this.bar_color = "#222222";
	this.panel_color = "#333333";
	this.resize_tab_color = "#222222";
	this.button_color = "#222222";
	this.button_over_color = "#555555";
	this.button_light_color = "#333333";
	this.box_color = "#444444";
	this.text_color = "#FFFFFF";
	this.icon_color = "#FFFFFF";

	document.body.style.color = this.text_color;
	document.body.style.fontFamily = "Arial";
	document.body.style.fontSize = "12px";
}

Theme.register(ThemeDark, "dark");