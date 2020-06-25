"use strict";

/**
 * Theme manager is where the GUI themes are registered and accessed.
 *
 * Themes are loaded from CSS files using variables.
 *
 * @static
 * @class ThemeManager
 */
function ThemeManager(){}

/**
 * Map of themes registered in the manager by their name.
 *
 * Associates the theme name and its CSS selector.
 *
 * @static
 * @property themes
 * @type {Map<string, string>}
 */
ThemeManager.themes = [];

/**
 * Add theme to list to associate the theme name with its CSS selector.
 *
 * @static
 * @method register
 */
ThemeManager.register = function(theme, name)
{
	ThemeManager.themes[name] = theme;
};

/**
 * Get the list of themes available by their name.
 *
 * @static
 * @method getList
 */
ThemeManager.getList = function()
{
	return Object.keys(ThemeManager.themes);
}