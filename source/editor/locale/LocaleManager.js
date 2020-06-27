/**
 * LocaleManager is used to manager multime locale configuration available.
 *
 * A locale has an identifier using the ISO 639-1 standard.
 * 
 * @class LocaleManager
 * @static
 */
function LocaleManager(){}

/**
 * List of all registered locale configurations.
 * 
 * @attribute list
 * @type {Array}
 */
LocaleManager.list = [];

/**
 * Locale is the global variable to access locale related data.
 * 
 * If no locale has been registered this should store a null value.
 *
 * To change local use the LocalManager object.
 *
 * @class Locale
 * @static
 */
var Locale = null;

/**
 * Register new locale in the manager.
 * 
 * If its the first locale to be registered will be used as default.
 * 
 * @method register
 * @param {Object} locale Locale object. 
 */
LocaleManager.register = function(locale)
{
	if(LocaleManager.list.length === 0)
	{
		Locale = locale;
	}

	LocaleManager.list.push(locale);
};

/**
 * Set a new locale to be used.
 * 
 * The interface needs to be updated manually after setting a new locale.
 * 
 * @method setLocale
 * @param {Object} locale Locale json.
 */
LocaleManager.setLocale = function(locale)
{
	// Set locale by id
	if(typeof locale === "string")
	{
		for(var i = 0; i < LocaleManager.list.length; i++)
		{
			if(LocaleManager.list[i].meta.language === locale)
			{
				Locale = LocaleManager.list[i];
				return;
			}
		}
	}
	// Set locale object
	else
	{
		var index = LocaleManager.list.indexOf(locale);
		if(index < 0)
		{
			LocaleManager.register(locale);
		}
		
		Locale = locale;
	}
};
export {LocaleManager};