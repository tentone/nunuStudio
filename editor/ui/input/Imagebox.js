"use strict";

function ImageBox(parent)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}

	//ID
	var id = "img_box" + ImageBox.id;
	ImageBox.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";

	//Alpha background
	this.alpha = document.createElement("img");
	this.alpha.style.position = "absolute";
	this.alpha.src = "editor/files/alpha.png";
	this.element.appendChild(this.alpha);

	//Image
	this.img = document.createElement("img");
	this.img.style.position = "absolute";
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
			if(file.type.startsWith("image"))
			{
				self.setImage(file.path);
				self.onchange(file.path);
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
		if(self.onchange !== null)
		{
			App.chooseFile(function(file)
			{
				self.setImage(file);
				self.onchange(file);
			}, "image/*");
		}
	};

	//On change function
	this.onchange = null;

	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(100, 100);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Image
	this.keep_aspect_ratio = false;
	this.image_scale = new THREE.Vector2(1,1);

	//Add element to document
	this.parent.appendChild(this.element);
}

//ImageBox ID counter
ImageBox.id = 0;

//Functions Prototype
ImageBox.prototype.setImage = setImage;
ImageBox.prototype.getValue = getValue;
ImageBox.prototype.update = update;
ImageBox.prototype.updateInterface = updateInterface;
ImageBox.prototype.destroy = destroy;
ImageBox.prototype.setOnChange = setOnChange;

//Set onchange callback function
function setOnChange(callback)
{
	this.onchange = callback;
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
function update(){}

//Set image from URL
function setImage(url)
{
	this.img.src = url;
}

//Get image URL
function getValue()
{
	return this.img.src;
}

//Update Interface
function updateInterface()
{
	//Fit parent element
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}

	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.img.style.visibility = "visible";
		this.alpha.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.img.style.visibility = "hidden";
		this.alpha.style.visibility = "hidden";
	}

	//Keep image aspect ratio
	if(this.keep_aspect_ratio)
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

	//Update img
	this.img.width = this.size.x * this.image_scale.x;
	this.img.height = this.size.y * this.image_scale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.image_scale.x))/2) + "px";
	this.img.style.top = ((this.size.y - (this.size.y * this.image_scale.y))/2) + "px";
	
	this.alpha.width = this.size.x;
	this.alpha.height = this.size.y;
	this.alpha.style.left = this.img.style.left;
	this.alpha.style.top = this.img.style.top;

	//Update base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
