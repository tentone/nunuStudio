import {Vector2} from "three";
import {Resource} from "../../../../../core/resources/Resource.js";
import {Editor} from "../../../../Editor.js";
import {Component} from "../../../../components/Component.js";

/**
 * Asset represents an resource in the asset explorer.
 *
 * There are multiple types of assets this class should be used as base for other types.
 *
 * @class Asset
 * @param {Component} parent
 * @extends {Component}
 */
class Asset extends Component {
	constructor(parent) {
	super(parent, "div");

	this.asset = null;

	this.scale = new Vector2(0.7, 0.7);

	// Element
        this.element.style.display = "block";
        this.element.style.float = "left";
        this.element.style.position = "relative";
        this.element.style.cursor = "pointer";
        this.element.style.width = "70px";
        this.element.style.height = "70px";
        this.element.draggable = true;

	// Icon
	this.icon = document.createElement("img");
	this.icon.draggable = false;
	this.icon.style.display = "block";
	this.icon.style.position = "absolute";
	this.icon.style.bottom = "20px";
	this.icon.style.right = "5px";
	this.icon.style.width = "30%";
	this.icon.style.height = "30%";
	this.icon.style.pointerEvents = "none";
	this.icon.style.opacity = "0.5";
	this.icon.style.zIndex = "1";
	this.element.appendChild(this.icon);

	// Text
	this.text = document.createElement("div");
	this.text.style.position = "absolute";
	this.text.style.overflow = "hidden";
	this.text.style.textAlign = "center";
	this.text.style.pointerEvents = "none";
	this.text.style.textOverflow = "ellipsis";
	this.text.style.whiteSpace = "nowrap";
	this.text.style.color = "var(--color-light)";
	this.text.style.height = "20px";
	this.text.style.width = "100%";
	this.text.style.bottom = "0px";
	this.element.appendChild(this.text);

	// Text
	this.name = document.createTextNode("");
	this.text.appendChild(this.name);

	var self = this;

	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = "var(--button-over-color)";
	};

	this.element.onmouseleave = function()
	{
		if (!Editor.isSelected(self.asset))
		{
			this.style.backgroundColor = null;
		}
	};

	this.element.onclick = function(event)
	{
		if (event.ctrlKey)
		{
			if (Editor.isSelected(self.asset))
			{
				Editor.unselectObject(self.asset);
			}
			else
			{
				Editor.addToSelection(self.asset);
			}
		}
		else
		{
			Editor.selectObject(self.asset);
		}
	};
	}

/**
 * Update selection state and the matching visual elements.
 *
 * @method setSelected
 * @param {boolean} selected If true set selected, otherwise se unselected.
 */
	setSelected(selected) {
	// this.selected = selected;

	this.element.style.backgroundColor = selected ? "var(--button-over-color)" : null;
	}

/**
 * Set the size of the asset.
 *
 * @method setSize
 * @param {number} size Size in px.
 */
	setSize(size) {
	this.element.style.width = size + "px";
	this.element.style.height = size + "px";
	}

/**
 * Attach resource to this asset.
 *
 * @method attach
 * @param {Resource} asset
 */
	attach(asset) {
	this.asset = asset;
	this.asset.gui = {node: this};
	
	this.updateMetadata();
	}

/**
 * Set icon to use in the asset.
 *
 * @method setIcon
 * @param {string} icon Image URL.
 */
	setIcon(icon) {
	this.icon.src = icon;
	}

/**
 * Set asset label.
 *
 * @method setText
 * @param {string} text Asset label.
 */
	setText(text) {
	this.name.data = text;
	}

	updateMetadata() {
	this.setText(this.asset.name);
	}

	updateInterface() {}

}
export {Asset};
