"use strict";

/**
 * BrowserView object is used to navigate webpages inside of the 3D scene.
 *
 * Can be used to display external web widget using a iframe. Some pages might present limitations regarding their usage inside of a iframe element.
 * 
 * @class BrowserView
 * @extends {CSS3DObject}
 * @param {String} url URL to be opened by default.
 */
function BrowserView(url)
{
	var element = document.createElement("iframe");
	element.style.border = "none";
	
	CSS3DObject.call(this, element);

	this.name = "browserview";

	var self = this;
	var url, width, height;
	
	Object.defineProperties(this,
	{
		/**
		 * URL of the webpage to open in the view.
		 *
		 * @attribute url
		 * @type {String}
		 */
		url:
		{
			get: function(){return url;},
			set: function(value)
			{
				url = value !== undefined ? BrowserView.processURL(value) : "";
				self.element.src = url;
			}
		},

		/**
		 * Width in pixels of the web view port.
		 *
		 * @attribute size
		 * @type {Number}
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
		 * @type {Number}
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

BrowserView.prototype = Object.create(CSS3DObject.prototype);

BrowserView.prototype.constructor = BrowserView;

/** 
 * Process URL to transform it into embedded URL when possible for common services.
 *
 * @method processURL
 * @param {String} url
 */
BrowserView.processURL = function(url)
{	
	//Youtube use embeded link
	url = url.replace("watch?v=", "embed/");

	return url;			
};

BrowserView.prototype.toJSON = function(resources)
{
	var data = CSS3DObject.prototype.toJSON.call(this, resources);

	data.object.height = this.height;
	data.object.width = this.width;
	data.object.url = this.url;

	return data;
};
