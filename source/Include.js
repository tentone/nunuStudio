"use strict";

/*
 * Include JS or CSS file in project, files can be obtained from node_packages.
 * 
 * The project can be built and minified using the build tools.
 * 
 * All files are included relative to the root of the project.
 *
 * @method include
 * @param {string} file File to include into the project.
 * @param {Function} onload Code to execute after the file is imported into the project.
 */
window.include = function(file, onload)
{
	// Code
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
	// CSS
	else if(file.endsWith(".css"))
	{
		var css = document.createElement("link");
		css.href = file;
		css.rel = "stylesheet";

		document.body.appendChild(css);
	}
	// Folder
	else if(window.require !== undefined)
	{
		var fs = window.require("fs");
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
