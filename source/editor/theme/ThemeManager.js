"use strict";

function ThemeManager(){}

ThemeManager.LIST = [];
ThemeManager.THEMES = [];

//Add theme to list
ThemeManager.register = function(theme, name)
{
	ThemeManager.LIST.push(name);
	ThemeManager.THEMES[name] = theme;
};

//Get a theme instance
ThemeManager.get = function(name)
{
	return new ThemeManager.THEMES[name]();
};

ThemeManager.getList = function()
{
	return ThemeManager.LIST;
}