import {RemoveResourceAction} from "../../../../history/action/resources/RemoveResourceAction.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {Asset} from "./Asset.js";
import {GeometryRenderer} from "../../../preview/GeometryRenderer.js";
import {DragBuffer} from "../../../DragBuffer.js";
import {Global} from "../../../../Global.js";
import {Editor} from "../../../../Editor.js";
import {ContextMenu} from "../../../../components/dropdown/ContextMenu.js";
import {DocumentBody} from "../../../../components/DocumentBody.js";


function GeometryAsset(parent)
{
	Asset.call(this, parent);

	this.setIcon(Global.FILE_PATH + "icons/misc/scene.png");
	
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
			Editor.addAction(new ChangeAction(self.asset, "name", Editor.prompt(Locale.rename, self.asset.name)));
		});
		
		context.addOption(Locale.delete, function()
		{
			Editor.addAction(new RemoveResourceAction(self.asset, Editor.program, "geometries"));
		});

		context.addOption(Locale.copy, function()
		{
			Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
		});
		
		context.addOption(Locale.cut, function()
		{
			if(self.asset !== null)
			{
				Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
				Editor.addAction(new RemoveResourceAction(self.asset, Editor.program, "geometries"));
			}
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

GeometryAsset.prototype = Object.create(Asset.prototype);

GeometryAsset.prototype.updateMetadata = function()
{
	if(this.asset !== null)
	{
		this.setText(this.asset.name);

		var image = this.image;

		GeometryRenderer.render(this.asset, function(url)
		{
			image.src = url;
		});
	}
};
export {GeometryAsset};