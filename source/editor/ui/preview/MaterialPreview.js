"use strict";

function MaterialPreview(){}

MaterialPreview.generate = function(material)
{
	var preview = document.createElement("img");
	MaterialRenderer.render(material, function(url)
	{
		preview.src = url;
	});

	return preview;
};