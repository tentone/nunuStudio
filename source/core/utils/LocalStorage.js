"use strict";

/**
 * Utils to access the browser local storage.
 *
 * @static
 * @class LocalStorage
 */
function LocalStorage(){}

/**
 * Store value in the local storage.
 * 
 * @static
 * @method set
 * @param {String} key
 * @param {Object} value
 */
LocalStorage.set = function(key, value)
{
	if(typeof value === "object")
	{
		window.localStorage.setItem(key, JSON.stringify(value));
	}
	else
	{
		window.localStorage.setItem(key, value);
	}
};

/**
 * Get value from the local storage.
 * 
 * @static
 * @method get
 * @param {String} key
 * @return {Object} Value obtained from the storage.
 */
LocalStorage.get = function(key)
{
	var value = window.localStorage.getItem(key);

	try
	{
		return JSON.parse(value);
	}
	catch(e)
	{
		return value;
	}
};

/**
 * Check if a key exists in the local storage.
 * 
 * @static
 * @method exists
 * @param {String} key
 * @return {Boolean} True if the key exists false otherwise.
 */
LocalStorage.exists = function(key)
{
	return window.localStorage.getItem(key) !== null;
};

/**
 * Delete a key from the local storage.
 * 
 * @static
 * @method delete
 * @param {String} key
 */
LocalStorage.delete = function(key)
{
	return window.localStorage.removeItem(key);
};
