"use strict";

/*
 * Include JS or CSS file in project.
 * 
 * Projects can be minified using the build tools.
 * 
 * @author tentone
 */
window.include = function(file, onload)
{
	if(file.endsWith(".js"))
	{
		var js = document.createElement("script");
		js.src = file;
		js.type = "text/javascript";
		js.async = false;
		if(onload)
		{
			js.onload = onload;
		}

		document.body.appendChild(js);
	}
	else if(file.endsWith(".css"))
	{
		var css = document.createElement("link");
		css.href = file;
		css.rel = "stylesheet";

		document.body.appendChild(css);
	}
	else if(window.require !== undefined)
	{
		var fs = require("fs");
		if(fs !== undefined)
		{
			if(file.endsWith("*"))
			{
				var directory = file.replace("*", "");
				var files = fs.readdirSync(directory);
				for(var i = 0; i < files.length; i++)
				{
					include(directory + files[i]);
				}
			}
			else
			{
				var directory = file + "/";
				try
				{
					var files = fs.readdirSync(directory);
					for(var i = 0; i < files.length; i++)
					{
						include(directory + files[i]);
					}
				}
				catch(e){}
			}
			
		}
	}
};
