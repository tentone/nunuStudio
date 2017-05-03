"use strict";

function ImageChooser(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";

	//Background
	this.alpha = document.createElement("img");
	this.alpha.style.visibility = "inherit";
	this.alpha.style.position = "absolute";
	this.alpha.src = Editor.filePath + "alpha.png";
	this.alpha.style.left = "0px";
	this.alpha.style.top = "0px";
	this.alpha.style.width = "100%";
	this.alpha.style.height = "100%";
	this.alpha.style.borderStyle = "none";
	this.element.appendChild(this.alpha);

	//Image
	this.img = document.createElement("img");
	this.img.style.visibility = "inherit";
	this.img.style.position = "absolute";
	this.img.style.borderStyle = "none";
	this.img.style.left = "0px";
	this.img.style.top = "0px";
	this.img.style.width = "100%";
	this.img.style.height = "100%";
	this.element.appendChild(this.img);

	//Self pointer
	var self = this;

	//On drop get file dropped
	this.element.ondrop = function(event)
	{
		event.preventDefault();

		if(event.dataTransfer.files.length > 0)
		{
			//Get first file from event
			var file = event.dataTransfer.files[0];

			//Check if its a image
			if(Image.fileIsImage(file))
			{
				readImageFile(file);
			}
		}
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Onclick select image file
	this.element.onclick = function()
	{
		if(self.onChange !== null)
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					readImageFile(files[0]);
				}
			}, "image/*, .tga");
		}
	};

	var readImageFile = function(file)
	{
		var reader = new FileReader();
		reader.onload = function()
		{
			self.setValue(reader.result);
			self.onChange(reader.result);
		};
		reader.readAsDataURL(file);
	};

	//onChange callback
	this.onChange = null;

	//Attributes
	this.size = new THREE.Vector2(100, 100);
	this.position = new THREE.Vector2(0, 0);
	this.visible = true;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Set onChange callback
ImageChooser.prototype.setOnChange = function(onChange)
{
	this.onChange = onChange;
}

//Remove element
ImageChooser.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
}

//Set image URL
ImageChooser.prototype.setValue = function(url)
{
	this.img.src = url;
}

//Get image URL
ImageChooser.prototype.getValue = function()
{
	return this.img.src;
}

//Update Interface
ImageChooser.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Keep aspect ratio
	if(this.keepAspectRatio)
	{
		if(this.size.x < this.size.y)
		{
			this.size.y = this.size.x * this.img.naturalHeight / this.img.naturalWidth;
		}
		else
		{
			this.size.x = this.size.y * this.img.naturalWidth / this.img.naturalHeight;
		}
	}

	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
