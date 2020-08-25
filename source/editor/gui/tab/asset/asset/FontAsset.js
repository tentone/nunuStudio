import {Locale} from "../../../../locale/LocaleManager.js";
import {RemoveResourceAction} from "../../../../history/action/resources/RemoveResourceAction.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {FontRenderer} from "../../../preview/FontRenderer.js";
import {DragBuffer} from "../../../DragBuffer.js";
import {Global} from "../../../../Global.js";
import {Editor} from "../../../../Editor.js";
import {ContextMenu} from "../../../../components/dropdown/ContextMenu.js";
import {DocumentBody} from "../../../../components/DocumentBody.js";
import {Asset} from "./Asset.js";


function FontAsset(parent)
{
	Asset.call(this, parent);

	this.setIcon(Global.FILE_PATH + "icons/misc/font.png");
	
	var self = this;

	// Image
	this.image = document.createElement("img");
	this.image.style.position = "absolute";
	this.image.style.top = "5%";
	this.image.style.left = "17%";
	this.image.style.width = "66%";
	this.image.style.height = "66%";
	this.element.appendChild(this.image);

	// Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu(DocumentBody);
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
		context.addOption(Locale.rename, function()
		{
			Editor.addAction(new ChangeAction(self.asset, "name", Editor.prompt(Locale.renameFont, self.asset.name)));
		});
		
		context.addOption(Locale.delete, function()
		{
			Editor.addAction(new RemoveResourceAction(self.asset, Editor.program, "fonts"));
		});

		if (self.asset.format === "arraybuffer")
		{
			context.addOption(Locale.reverse, function()
			{
				if (Editor.confirm("Reverse font glyphs?"))
				{
					self.asset.reverseGlyphs();
					self.updateMetadata();
				}
			});
		}

		context.addOption(Locale.copy, function()
		{
			Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
		});
		
		context.addOption(Locale.cut, function()
		{
			Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
			Editor.addAction(new RemoveResourceAction(self.asset, Editor.program, "fonts"));
		});

		context.updateInterface();
	};

	// Drag start
	this.element.ondragstart = function(event)
	{
		// Insert into drag buffer
		if (self.asset !== null)
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

FontAsset.prototype = Object.create(Asset.prototype);

FontAsset.prototype.updateMetadata = function()
{
	var image = this.image;
	
	FontRenderer.render(this.asset, function(url)
	{
		image.src = url;
	});

	this.setText(this.asset.name);
};
export {FontAsset};
