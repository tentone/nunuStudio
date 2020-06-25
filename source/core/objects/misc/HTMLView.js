import {CSS3DObject} from "../../renderer/css/CSS3DObject.js";

/**
 * HTMLView object is used to navigate webpages inside of the 3D scene.
 *
 * Can be used to display external web widget using a iframe. Some pages might present limitations regarding their usage inside of a iframe element.
 * 
 * @class HTMLView
 * @extends {CSS3DObject}
 * @param {string} url URL to be opened by default.
 */
function HTMLView(url)
{
	var element = document.createElement("iframe");
	element.style.border = "none";
	
	CSS3DObject.call(this, element);

	this.type = "HTMLView";
	this.name = "webview";

	var self = this;
	var url, width, height;
	
	Object.defineProperties(this,
	{
		/**
		 * URL of the webpage to open in the view.
		 *
		 * @attribute url
		 * @type {string}
		 */
		url:
		{
			get: function(){return url;},
			set: function(value)
			{
				url = value !== undefined ? HTMLView.processURL(value) : "";
				self.element.src = url;
			}
		},

		/**
		 * Width in pixels of the web view port.
		 *
		 * @attribute size
		 * @type {number}
		 */
		width:
		{
			get: function(){return width;},
			set: function(value)
			{
				width = value;
				self.element.style.width = width + "px";
			}
		},

		/**
		 * Height in pixels of the web view port.
		 *
		 * @attribute height
		 * @type {number}
		 */
		height:
		{
			get: function(){return height;},
			set: function(value)
			{
				height = value;
				self.element.style.height = height + "px";
			}
		}
	});

	this.width = 512;
	this.height = 512;
	this.url = url !== undefined ? url : "";
}

HTMLView.prototype = Object.create(CSS3DObject.prototype);

HTMLView.prototype.constructor = HTMLView;

/** 
 * Process URL to transform it into embedded URL when possible for common services.
 *
 * @method processURL
 * @param {string} url
 */
HTMLView.processURL = function(url)
{	
	// Replace youtube url to use embeded link
	return url.replace("watch?v=", "embed/");			
};

HTMLView.prototype.toJSON = function(meta)
{
	var data = CSS3DObject.prototype.toJSON.call(this, meta);

	data.object.height = this.height;
	data.object.width = this.width;
	data.object.url = this.url;

	return data;
};

export {HTMLView};