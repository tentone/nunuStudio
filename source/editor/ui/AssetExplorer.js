"use strict";

function AssetExplorer(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "auto";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	//Drop event
	this.element.ondrop = function(event)
	{
		//Dragged file into explorer
		if(event.dataTransfer.files.length > 0)
		{
			var file = event.dataTransfer.files[0];
			var name = file.name;

			//Image
			if(Image.fileIsImage(file))
			{
				Editor.loadTexture(file);
			}
			//Video
			else if(Video.fileIsVideo(file))
			{
				Editor.loadVideoTexture(file);
			}
			//Audio
			else if(Audio.fileIsAudio(file))
			{
				Editor.loadAudio(file);
			}
			//Font
			else if(Font.fileIsFont(file))
			{
				Editor.loadFont(file);
			}
		}
	};

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Files in explorer
	this.filesSize = new THREE.Vector2(70, 70);
	this.filesSpacing = 0;
	this.files = [];

	//Add element to document
	this.parent.appendChild(this.element);
}

//Remove all files
AssetExplorer.prototype.clear = function()
{
	while(this.files.length > 0)
	{
		this.files.pop().destroy();
	}
};

//Add file to explorer
AssetExplorer.prototype.add = function(file)
{
	file.setParent(this.element);
	file.size.copy(this.filesSize);
	file.updateInterface();

	this.files.push(file);
};

//Remove element
AssetExplorer.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
};

//Update division
AssetExplorer.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		//Asset position
		var filesRow = Math.floor(this.files.length / ((this.files.length * (this.filesSize.x+this.filesSpacing)) / this.size.x));
		for(var i = 0; i < this.files.length; i++)
		{
			var row = Math.floor(i / filesRow);
			var col = i % filesRow;

			this.files[i].position.x = (col * this.filesSize.x) + ((col + 1) * this.filesSpacing);
			this.files[i].position.y = (row * this.filesSize.y) + ((row + 1) * this.filesSpacing);
			this.files[i].updateInterface();
		}

		//Element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};