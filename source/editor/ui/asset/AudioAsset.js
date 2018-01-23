"use strict";

function AudioAsset(parent)
{
	Asset.call(this, parent);

	this.setIcon(Editor.filePath + "icons/misc/audio.png");
	
	//Self pointer
	var self = this;

	//Image
	this.image = document.createElement("img");
	this.image.style.position = "absolute";
	this.image.style.top = "5px";
	this.image.src = Editor.filePath + "icons/misc/audio.png";
	this.element.appendChild(this.image);

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
		var menu = context.addMenu("Create Emitter");

		menu.addOption("Audio Emitter", function()
		{
			if(self.asset !== null)
			{
				var emitter = new AudioEmitter(self.asset);
				emitter.name = self.asset.name;
				Editor.addToScene(emitter);
			}
		});

		menu.addOption("Positional", function()
		{
			if(self.asset !== null)
			{
				var emitter = new PositionalAudio(self.asset);
				emitter.name = self.asset.name;
				Editor.addToScene(emitter);
			}
		});

		context.addOption("Rename", function()
		{
			if(self.asset !== null)
			{
				Editor.history.add(new ChangeAction(self.asset, "name", prompt("Rename audio", self.asset.name)));
				Editor.updateObjectViews();
			}
		});

		context.addOption("Export Audio", function()
		{
			if(Nunu.runningOnDesktop())
			{
				FileSystem.chooseFile(function(files)
				{
					if(files.length > 0)
					{
						var file = files[0].path;
						FileSystem.writeFileArrayBuffer(file, self.asset.data);
					}
				}, "." + self.asset.encoding, true);
			}
			else
			{
				FileSystem.chooseFileName(function(file)
				{
					FileSystem.writeFileArrayBuffer(file, self.asset.data);
				}, "." + self.asset.encoding);
			}
		});
		
		context.addOption("Delete", function()
		{
			if(self.asset !== null && confirm("Delete audio?"))
			{
				Editor.program.removeAudio(self.asset, Editor.defaultAudio);
				Editor.updateObjectViews();
			}
		});

		context.addOption("Copy", function()
		{
			if(self.asset !== null)
			{
				try
				{
					Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
				}
				catch(e){}
			}
		});

		context.updateInterface();
	};

	//Drag start
	this.element.ondragstart = function(event)
	{
		//Insert into drag buffer
		if(self.asset !== null)
		{
			event.dataTransfer.setData("uuid", self.asset.uuid);
			DragBuffer.pushDragElement(self.asset);
		}
	};

	//Drag end (called after of ondrop)
	this.element.ondragend = function(event)
	{
		var uuid = event.dataTransfer.getData("uuid");
		var obj = DragBuffer.popDragElement(uuid);
	};
}

AudioAsset.prototype = Object.create(Asset.prototype);

//Set object to file
AudioAsset.prototype.setAudio = function(audio)
{
	if(audio instanceof Audio)
	{
		this.asset = audio;
		this.updateMetadata();
	}
};

//Update material preview
AudioAsset.prototype.updateMetadata = function()
{
	if(this.asset !== null)
	{
		this.setText(this.asset.name);
	}
};

//Update interface
AudioAsset.prototype.updateInterface = function()
{
	Asset.prototype.updateInterface.call(this);

	//Update image
	this.image.width = this.size.x * this.scale.x;
	this.image.height = this.size.y * this.scale.y;
	this.image.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";
};