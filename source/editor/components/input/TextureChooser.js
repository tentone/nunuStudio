import {Texture} from "three";
import {WebcamTexture} from "../../../core/texture/WebcamTexture.js";
import {VideoTexture} from "../../../core/texture/VideoTexture.js";
import {SpriteSheetTexture} from "../../../core/texture/SpriteSheetTexture.js";
import {CubeTexture} from "../../../core/texture/CubeTexture.js";
import {CanvasTexture} from "../../../core/texture/CanvasTexture.js";
import {Video} from "../../../core/resources/Video.js";
import {Image} from "../../../core/resources/Image.js";
import {FileSystem} from "../../../core/FileSystem.js";
import {Loaders} from "../../Loaders.js";
import {DragBuffer} from "../../gui/DragBuffer.js";
import {Global} from "../../Global.js";
import {Editor} from "../../Editor.js";
import {Component} from "../Component.js";

function TextureChooser(parent)
{
	Component.call(this, parent, "div");

	// Preview
	this.preview = document.createElement("div");
	this.preview.style.cursor = "pointer";
	this.preview.style.visibility = "inherit";
	this.preview.style.position = "absolute";
	this.preview.style.top = "0px";
	this.preview.style.left = "0px";
	this.preview.style.backgroundImage = "url(\"" + Global.FILE_PATH + "alpha.png\")";
	this.preview.style.backgroundRepeat = "repeat";
	this.preview.style.backgroundSize = "120px 120px";
	this.element.appendChild(this.preview);

	// Image
	this.img = document.createElement("img");
	this.img.style.pointerEvents = "none";
	this.img.style.position = "absolute";
	this.img.style.left = "0px";
	this.img.style.top = "0px";
	this.img.style.width = "100%";
	this.img.style.height = "100%";
	this.preview.appendChild(this.img);

	// Video
	this.video = document.createElement("video");
	this.video.autoplay = true;
	this.video.loop = true;
	this.video.volume = 0.0;
	this.video.style.pointerEvents = "none";
	this.video.style.position = "absolute";
	this.video.style.left = "0px";
	this.video.style.top = "0px";
	this.video.style.width = "100%";
	this.video.style.height = "100%";
	this.preview.appendChild(this.video);

	var self = this;

	// On drop get file dropped
	this.preview.ondrop = function(event)
	{
		// File
		if (event.dataTransfer.files.length > 0)
		{
			self.loadTexture(event.dataTransfer.files[0]);
		}
		// Resource
		else
		{
			var uuid = event.dataTransfer.getData("uuid");
			var value = DragBuffer.get(uuid);

			// Texture
			if (value instanceof Texture && (self.acceptAll || !value.isCubeTexture))
			{
				self.setTexture(value);
			}
			// Image
			else if (value instanceof Image)
			{
				self.setTexture(new Texture(value));
			}
			// Video
			else if (value instanceof Video)
			{
				self.setTexture(new VideoTexture(value));
			}
			else
			{
				Editor.alert("Only textures, videos and images accepted");
			}
		}

		event.preventDefault();
	};

	// Onclick select image or video file
	this.preview.onclick = function()
	{
		if (self.onChange !== null)
		{
			FileSystem.chooseFile(function(files)
			{
				if (files.length > 0)
				{
					self.loadTexture(files[0]);
				}
			}, "image/*, video/*, .tga");
		}
	};

	/**
	 * On change callback function.
	 *
	 * @property onChange
	 * @type {Function}
	 */
	this.onChange = null;

	this.acceptAll = false;

	/**
	 * Texture stored in chooser.
	 *
	 * @property texture
	 * @type {Texture}
	 */
	this.texture = null;
}

TextureChooser.prototype = Object.create(Component.prototype);

/**
 * Set onchange callback, called after changes.
 *
 * @method setOnChange
 * @param {Function} onChange
 */
TextureChooser.prototype.setOnChange = function(onChange)
{
	this.onChange = onChange;
};

// Set texture value
TextureChooser.prototype.setValue = function(texture)
{
	if (texture instanceof Texture)
	{
		this.texture = texture;
		this.updatePreview();
	}
	else
	{
		this.texture = null;
	}
};

/**
 * Get value stored in the input element.
 *
 * @method getValue
 * @return {Object} Value stored in the input element.
 */
TextureChooser.prototype.getValue = function()
{
	return this.texture;
};

// Set Texture
TextureChooser.prototype.setTexture = function(texture)
{
	this.setValue(texture);

	if (this.onChange !== null)
	{
		this.onChange();
	}
};

// Load texture from file
TextureChooser.prototype.loadTexture = function(file)
{
	var self = this;
	var onLoad = function(texture)
	{
		self.texture = texture;
		self.updatePreview();

		if (self.onChange !== null)
		{
			self.onChange();
		}
	};

	if (Image.fileIsImage(file))
	{
		Loaders.loadTexture(file, onLoad);
	}
	else if (Video.fileIsVideo(file))
	{
		Loaders.loadVideoTexture(file, onLoad);
	}
};

// Update texture preview
TextureChooser.prototype.updatePreview = function()
{
	var texture = this.texture;

	if (texture instanceof CanvasTexture)
	{
		this.video.style.display = "none";
		this.img.style.display = "block";
		this.img.src = texture.image.toDataURL();
	}
	else if (texture instanceof VideoTexture || texture instanceof WebcamTexture)
	{
		this.img.style.display = "none";
		this.video.style.display = "block";
		this.video.src = texture.image.src;
	}
	else if (texture instanceof CubeTexture)
	{
		this.video.style.display = "none";
		this.img.style.display = "block";
		this.img.src = texture.image[0].toDataURL();
	}
	else if (texture instanceof Texture || texture instanceof SpriteSheetTexture)
	{
		this.video.style.display = "none";
		this.img.style.display = "block";
		this.img.src = texture.image.src;
	}
	else
	{
		this.img.style.display = "none";
		this.video.style.display = "none";
	}
};

TextureChooser.prototype.updateVisibility = function()
{
	this.element.style.visibility = this.visible ? "visible" : "hidden";
};

TextureChooser.prototype.updateSize = function()
{
	this.preview.style.width = this.size.y + "px";
	this.preview.style.height = this.size.y + "px";

	Component.prototype.updateSize.call(this);
};

export {TextureChooser};
