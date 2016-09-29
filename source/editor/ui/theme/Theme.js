"use strict";

function Theme(){}

//Themes
Theme.list = [];
Theme.theme = [];

//Add theme to list
Theme.register = function(theme, name)
{
	Theme.list.push(name);
	Theme.theme[name] = theme;
}

//Get a theme instance
Theme.get = function(name)
{
	return new Theme.theme[name]();
}
