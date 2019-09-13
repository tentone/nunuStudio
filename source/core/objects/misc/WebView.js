"use strict";

/**
 * WebView object is used to navigate webpages inside of the 3D scene.
 *
 * Can be used to display external web widget using a iframe. Some pages might present limitations regarding their usage inside of a iframe element.
 * 
 * @class WebView
 * @extends {CSS3DObject}
 * @param {String} url URL to be opened by default.
 */
function WebView(url)
{
	var element = document.createElement("iframe");
	element.style.border = "none";
	
	CSS3DObject.call(this, element);

	this.name = "webview" + this.uuid.substr(0, 3);

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
				url = value !== undefined ? WebView.processURL(value) : "";
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

WebView.prototype = Object.create(CSS3DObject.prototype);

WebView.prototype.constructor = WebView;

/** 
 * Process URL to transform it into embedded URL when possible for common services.
 *
 * @method processURL
 * @param {String} url
 */
WebView.processURL = function(url)
{	
	//Youtube use embeded link
	url = url.replace("watch?v=", "embed/");

	//http://x-frame-options-bypass.herokuapp.com/?url=
	
	return url;			
};

WebView.prototype.toJSON = function(resources)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, resources);

	data.data.height = this.height;
	data.data.width = this.width;
	data.data.url = this.url;

	return data;
};
