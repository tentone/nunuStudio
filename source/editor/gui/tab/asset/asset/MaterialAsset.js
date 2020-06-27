import {MaterialLoader} from "../../../../../core/loaders/MaterialLoader.js";
import {RemoveResourceAction} from "../../../../history/action/resources/RemoveResourceAction.js";
import {AddResourceAction} from "../../../../history/action/resources/AddResourceAction.js";
import {ChangeAction} from "../../../../history/action/ChangeAction.js";
import {SpriteMaterialEditor} from "../../material/sprite/SpriteMaterialEditor.js";
import {ShaderMaterialEditor} from "../../material/ShaderMaterialEditor.js";
import {PointsMaterialEditor} from "../../material/points/PointsMaterialEditor.js";
import {MeshToonMaterialEditor} from "../../material/mesh/MeshToonMaterialEditor.js";
import {MeshStandardMaterialEditor} from "../../material/mesh/MeshStandardMaterialEditor.js";
import {MeshPhysicalMaterialEditor} from "../../material/mesh/MeshPhysicalMaterialEditor.js";
import {MeshPhongMaterialEditor} from "../../material/mesh/MeshPhongMaterialEditor.js";
import {MeshMaterialEditor} from "../../material/mesh/MeshMaterialEditor.js";
import {MeshMatcapMaterialEditor} from "../../material/mesh/MeshMatcapMaterialEditor.js";
import {MeshLambertMaterialEditor} from "../../material/mesh/MeshLambertMaterialEditor.js";
import {MeshBasicMaterialEditor} from "../../material/mesh/MeshBasicMaterialEditor.js";
import {MaterialEditor} from "../../material/MaterialEditor.js";
import {LineDashedMaterialEditor} from "../../material/line/LineDashedMaterialEditor.js";
import {LineBasicMaterialEditor} from "../../material/line/LineBasicMaterialEditor.js";
import {Asset} from "./Asset.js";
import {MaterialRenderer} from "../../../preview/MaterialRenderer.js";
import {DragBuffer} from "../../../DragBuffer.js";
import {Global} from "../../../../Global.js";
import {Editor} from "../../../../Editor.js";
import {ContextMenu} from "../../../../components/dropdown/ContextMenu.js";
import {DocumentBody} from "../../../../components/DocumentBody.js";
import {Color, Material, MeshPhongMaterial, MeshToonMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, SpriteMaterial, ShaderMaterial, LineDashedMaterial, LineBasicMaterial, PointsMaterial, Math} from "three";

function MaterialAsset(parent)
{
	Asset.call(this, parent);

	this.setIcon(Global.FILE_PATH + "icons/misc/material.png");
	
	var self = this;

	// Use to store original material color on highlight
	this.materialColor = new Color(0, 0, 0);
	this.materialHighlighted = false;

	// Material Preview
	this.image = document.createElement("img");
	this.image.style.position = "absolute";
	this.image.style.top = "5%";
	this.image.style.left = "17%";
	this.image.style.width = "66%";
	this.image.style.height = "66%";
	this.element.appendChild(this.image);

	// Mouse over event
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = "var(--button-over-color)";
		self.highlightMaterial();
	};

	// Mouse leave event
	this.element.onmouseleave = function()
	{
		if(!Editor.isSelected(self.asset))
		{
			this.style.backgroundColor = null;
		}
		self.restoreMaterial();
	};

	// Double click
	this.element.ondblclick = function()
	{
		if(self.asset instanceof Material)
		{
			var tab = Editor.gui.tab.getTab(MaterialEditor, self.asset);

			if(tab === null)
			{
				self.restoreMaterial();

				if(self.asset instanceof MeshPhongMaterial)
				{
					tab = Editor.gui.tab.addTab(MeshPhongMaterialEditor, true);
				}
				else if(self.asset instanceof MeshToonMaterial)
				{
					tab = Editor.gui.tab.addTab(MeshToonMaterialEditor, true);
				}
				else if(self.asset instanceof MeshLambertMaterial)
				{
					tab = Editor.gui.tab.addTab(MeshLambertMaterialEditor, true);
				}
				else if(self.asset instanceof MeshMatcapMaterial)
				{
					tab = Editor.gui.tab.addTab(MeshMatcapMaterialEditor, true);
				}
				else if(self.asset instanceof MeshBasicMaterial)
				{
					tab = Editor.gui.tab.addTab(MeshBasicMaterialEditor, true);
				}
				else if(self.asset instanceof MeshPhysicalMaterial)
				{
					tab = Editor.gui.tab.addTab(MeshPhysicalMaterialEditor, true);
				}
				else if(self.asset instanceof MeshStandardMaterial)
				{
					tab = Editor.gui.tab.addTab(MeshStandardMaterialEditor, true);
				}
				else if(self.asset instanceof SpriteMaterial)
				{
					tab = Editor.gui.tab.addTab(SpriteMaterialEditor, true);
				}
				else if(self.asset instanceof ShaderMaterial)
				{
					tab = Editor.gui.tab.addTab(ShaderMaterialEditor, true);
				}
				else if(self.asset instanceof LineDashedMaterial)
				{
					tab = Editor.gui.tab.addTab(LineDashedMaterialEditor, true);
				}
				else if(self.asset instanceof LineBasicMaterial)
				{
					tab = Editor.gui.tab.addTab(LineBasicMaterialEditor, true);
				}
				else if(self.asset instanceof PointsMaterial)
				{
					tab = Editor.gui.tab.addTab(PointsMaterialEditor, true);
				}
				else
				{
					tab = Editor.gui.tab.addTab(MeshMaterialEditor, true);
				}

				tab.attach(self.asset, self);
			}

			tab.select();
		}
	};

	// Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu(DocumentBody);
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
		context.addOption(Locale.rename, function()
		{
			Editor.addAction(new ChangeAction(self.asset, "name", Editor.prompt(Locale.renameMaterial, self.asset.name)));
		});
		
		context.addOption(Locale.selectObjects, function()
		{	
			Editor.clearSelection();
			Editor.program.traverse(function(child)
			{
				if(child.material === self.asset)
				{
					Editor.addToSelection(child);
				}
			});

			Editor.updateSelectionGUI();
		})

		context.addOption(Locale.delete, function()
		{
			if(Editor.confirm(Locale.deleteMaterial))
			{
				Editor.addAction(new RemoveResourceAction(self.asset, Editor.program, "materials"));
			}
		});

		context.addOption(Locale.copy, function()
		{
			Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
		});

		context.addOption(Locale.cut, function()
		{
			Editor.clipboard.set(JSON.stringify(self.asset.toJSON()), "text");
			Editor.addAction(new RemoveResourceAction(self.asset, Editor.program, "materials"));
		});

		context.addOption(Locale.duplicate, function()
		{
			try
			{
				// Serialize
				var json = self.asset.toJSON();

				// Loader
				var loader = new MaterialLoader();
				loader.setTextures(Editor.program.textures);

				// Load
				var material = loader.parse(json); 
				material.uuid = Math.generateUUID();
				material.name += "*";
				
				Editor.addAction(new AddResourceAction(material, Editor.program, "materials"));
			}
			catch(e)
			{
				Editor.alert("Material duplication failed.\n" + e.stack);
			}
		});

		context.updateInterface();
	};

	// Drag start
	this.element.ondragstart = function(event)
	{
		// Restore material color
		self.restoreMaterial();

		// Insert material into drag buffer
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

// Super prototypes
MaterialAsset.prototype = Object.create(Asset.prototype);

// Destroy material file
MaterialAsset.prototype.destroy = function()
{
	Asset.prototype.destroy.call(this);

	this.restoreMaterial();
};

// Highlight material
MaterialAsset.prototype.highlightMaterial = function()
{
	if(this.asset instanceof Material && this.asset.color !== undefined)
	{
		this.materialColor.copy(this.asset.color);
		this.asset.color.setRGB(1, 1, 0);
		this.materialHighlighted = true;
	}
};

// Restore material to normal color
MaterialAsset.prototype.restoreMaterial = function()
{
	if(this.materialHighlighted)
	{
		if(this.asset instanceof Material && this.asset.color !== undefined)
		{
			this.asset.color.copy(this.materialColor);
			this.materialHighlighted = false;
		}
	}
};

MaterialAsset.prototype.updateMetadata = function()
{
	if(this.asset !== null)
	{
		var image = this.image;
		
		MaterialRenderer.render(this.asset, function(url)
		{
			image.src = url;
		});
		
		this.setText(this.asset.name);
	}
};
export {MaterialAsset};