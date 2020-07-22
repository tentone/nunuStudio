/**
 * String utils contains auxiliar methods for string manipulation.
 *
 * @class StringUtils
 */
function StringUtils(){}

/** 
 * Change accents in strings to use non accented chars. Only works for lowercase strings.
 *
 * Useful for string comparison in searches.
 *
 * @static
 * @method accentFolding
 * @param {string} str Input string to be processed.
 * @return {string} Processed string without accented chars.
 */
StringUtils.accentFolding = function(str)
{
	return str.replace(/([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g, function(str, a, c, e, i, n, o, s, u, y, ae)
	{
		if(a){return "a";}
		if(c){return "c";}
		if(e){return "e";}
		if(i){return "i";}
		if(n){return "n";}
		if(o){return "o";}
		if(s){return "s";}
		if(u){return "u";}
		if(y){return "y";}
		if(ae){return "ae";}
	});
};

/** 
 * Remove all the ponctuation and spaces from a string.
 *
 * Useful for string comparison in searches.
 *
 * @static
 * @method accentFolding
 * @param {string} str Input string to be processed.
 * @return {string} Processed string without accented chars.
 */
StringUtils.removePunctuation = function(str)
{
	return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~() ]/g,"");
};

export {StringUtils};