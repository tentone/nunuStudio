"use strict";

function AudioAsset(parent)
{
	Asset.call(this, parent);

	this.audio = null;
	this.setIcon(Interface.fileDir + "icons/misc/audio.png");
	
	//Self pointer
	var self = this;

	//Image
	this.image = document.createElement("img");
	this.image.style.position = "absolute";
	this.image.style.top = "5px";
	this.element.appendChild(this.image);

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX - 5, event.clientY - 5);
		
		context.addOption("Create Emitter", function()
		{
			if(self.audio !== null)
			{
				var emitter = new AudioEmitter(self.audio);
				emitter.name = self.audio.name;
				Editor.addToScene(emitter);
			}
		});

		context.addOption("Rename", function()
		{
			if(self.audio !== null)
			{
				self.audio.name = prompt("Rename audio", self.audio.name);
				Editor.updateObjectViews();
			}
		});
		
		context.addOption("Delete", function()
		{
			if(self.audio !== null && confirm("Delete audio?"))
			{
				Editor.program.removeAudio(self.audio, Editor.defaultAudio);
				Editor.updateObjectViews();
			}
		});

		context.addOption("Copy", function()
		{
			if(self.audio !== null)
			{
				try
				{
					Editor.clipboard.set(JSON.stringify(self.audio.toJSON()), "text");
				}
				catch(e){}
			}
		});
	};

	//Drag start
	this.element.ondragstart = function(event)
	{
		//Insert into drag buffer
		if(self.audio !== null)
		{
			event.dataTransfer.setData("uuid", self.audio.uuid);
			DragBuffer.pushDragElement(self.audio);
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
		this.audio = audio;
		this.updateMetadata();
	}
};

//Update material preview
AudioAsset.prototype.updateMetadata = function()
{
	if(this.audio !== null)
	{
		this.image.src = Interface.fileDir + "icons/misc/audio.png";

		this.setText(this.audio.name);
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