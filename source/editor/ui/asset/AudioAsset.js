"use strict";

function AudioAsset(parent)
{
	Asset.call(this, parent);

	this.audio = null;

	//Self pointer
	var self = this;

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX - 5, event.clientY - 5);
		
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
				//TODO <ADD CODE HERE>
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
}

//Update material preview
AudioAsset.prototype.updateMetadata = function()
{
	if(this.audio !== null)
	{
		this.image.src = Interface.file_dir + "icons/assets/audio.png";
		this.setText(this.audio.name);
	}
}
