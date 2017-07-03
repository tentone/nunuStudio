"use strict";

function importFrom(namespace)
{
	for(var i in namespace)
	{
		if(!(i in window))
		{
			window[i] = namespace[i];
		}
	}
}

importFrom(THREE);
importFrom(CANNON);
importFrom(SPE);
