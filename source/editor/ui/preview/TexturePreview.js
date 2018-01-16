"use strict";

function TexturePreview(){}

TexturePreview.generate = function(texture)
{
	var preview = document.createElement("img");
	TextureRenderer.render(texture, function(url)
	{
		preview.src = url;
	});

	return preview;
};