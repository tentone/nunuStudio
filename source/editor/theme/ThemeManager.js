"use strict";

function ThemeManager(){}

ThemeManager.list = [];
ThemeManager.themes = [];

//Add theme to list
ThemeManager.register = function(theme, name)
{
	ThemeManager.list.push(name);
	ThemeManager.themes[name] = theme;
};

//Get a theme instance
ThemeManager.get = function(name)
{
	return new ThemeManager.themes[name]();
};

ThemeManager.getList = function()
{
	return ThemeManager.list;
}