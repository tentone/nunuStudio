import {PositionalAudio} from "../../../../../core/objects/audio/PositionalAudio.js";
import {AudioEmitter} from "../../../../../core/objects/audio/AudioEmitter.js";
import {Nunu} from "../../../../../core/Nunu.js";
import {FileSystem} from "../../../../../core/FileSystem.js";
import {RemoveResourceAction} from "../../../../history/action/resources/RemoveResourceAction.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Asset} from "./Asset.js";
import {DragBuffer} from "../../../DragBuffer.js";
import {Global} from "../../../../Global.js";
import {Editor} from "../../../../Editor.js";
import {ContextMenu} from "../../../../components/dropdown/ContextMenu.js";
import {DocumentBody} from "../../../../components/DocumentBody.js";


function AudioAsset(parent)
{
	Asset.call(this, parent);

	this.setIcon(Global.FILE_PATH + "icons/misc/audio.png");
	
	var self = this;

	// Image
	this.image = document.createElement("img");
	this.image.style.position = "absolute";
	this.image.style.top = "5%";
	this.image.style.left = "17%";
	this.image.style.width = "66%";
	this.image.style.height = "66%";
	this.image.src = Global.FILE_PATH + "icons/misc/audio.png";
	this.element.appendChild(this.image);

	// Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu(DocumentBody);
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
		var menu = context.addMenu("Create Emitter");

		menu.addOption("Audio Emitter", function()
		{
			if(self.asset !== null)
			{
				var emitter = new AudioEmitter(self.asset);
				emitter.name = self.asset.name;
				Editor.addObject(emitter);
			}
		});

		menu.addOption("Positional", function()
		{
			if(self.asset !== null)
			{
				var emitter = new PositionalAudio(self.asset);
				emitter.name = self.asset.name;
				Editor.addObject(emitter);
			}
		});

		context.addOption(Locale.rename, function()
		{
			Editor.addAction(new ChangeAction(self.asset, "name", Editor.prompt("Rename audio", self.asset.name)));
		});

		context.addOption(Locale.export, function()
		{
			if(Nunu.runningOnDesktop())
			{
				FileSystem.chooseFile(function(files)
				{
					if(files.length > 0)
					{
						self.asset.export(files[0].path);
					}
				}, "." + self.asset.encoding, true);
			}
			else
			{
				FileSystem.chooseFileName(function(file)
				{
					self.asset.export(file);
				}, "." + self.asset.encoding);
			}
		});
		
		context.addOption(Locale.delete, function()
		{
			if(Editor.confirm("Delete audio?"))
			{
				Editor.addAction(new RemoveResourceAction(self.asset, Editor.program, "audio"));
			}
		});

		context.addOption(Locale.copy, function()
		{
			Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
		});

		context.addOption(Locale.cut, function()
		{
			Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
			Editor.addAction(new RemoveResourceAction(self.asset, Editor.program, "audio"));
		});

		context.updateInterface();
	};

	// Drag start
	this.element.ondragstart = function(event)
	{
		// Insert into drag buffer
		if(self.asset !== null)
		{
			event.dataTransfer.setData("uuid", self.asset.uuid);
			DragBuffer.push(self.asset);
		}
	};

	// Drag end (called after of ondrop)
	this.element.ondragend = function()
	{
		DragBuffer.pop(self.asset.uuid);
	};
}

AudioAsset.prototype = Object.create(Asset.prototype);
export {AudioAsset};