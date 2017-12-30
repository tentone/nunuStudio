"use strict";

function TexturePreview(){}

TexturePreview.generate = function(texture)
{
	var preview = null;

	//Video texture
	if(texture instanceof VideoTexture || texture instanceof WebcamTexture)
	{
		preview = document.createElement("video");
		preview.volume = 0.0;
		preview.loop = true;
		preview.autostart = true;
		preview.src = texture.image.src;
	}
	//Cube texture
	else if(texture instanceof CubeTexture)
	{
		if(texture.mode === CubeTexture.CUBE)
		{
			preview = document.createElement("canvas");
			preview.width = 128;
			preview.height = 128;

			var context = preview.getContext("2d");

			for(var i = 0; i < texture.images.length; i++)
			{
				var image = document.createElement("img");
				image.index = i;
				image.onload = function()
				{
					if(this.index === 2)
					{
						context.drawImage(this, 32, 16, 32, 32);
					}
					else if(this.index === 3)
					{
						context.drawImage(this, 32, 80, 32, 32);
					}
					else
					{
						var order = [2, 0, null, null, 1, 3]
						context.drawImage(this, order[this.index] * 32, 48, 32, 32);
					}
				}
				image.src = texture.images[i].data;
			}
		}
		else
		{
			preview = document.createElement("img");
			preview.src = texture.images[0].data;
		}

	}
	//Canvas texture
	else if(texture instanceof CanvasTexture)
	{
		preview = document.createElement("img");
		preview.src = texture.image.toDataURL();
	}
	//Compressed
	else if(texture instanceof CompressedTexture)
	{
		//TODO <ADD CODE HERE>
		preview = document.createElement("img");
		preview.src = Editor.filePath + "icon.png";
	}
	//Image
	else if(texture instanceof THREE.Texture)
	{
		preview = document.createElement("img");
		preview.src = texture.image.src;
	}

	return preview;
};