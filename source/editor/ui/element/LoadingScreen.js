"use strict";

function LoadingScreen(parent)
{
	Element.call(this, parent);

	this.element.style.pointerEvents = "none";
	this.element.style.top = "0px";
	this.element.style.left = "0px";
	this.element.style.width = "100%";
	this.element.style.height = "100%";
	this.element.style.zIndex = "10000000";
	this.element.style.backgroundColor = "rgba(0, 0, 0, 0.6)";

	this.message = document.createElement("div");
	this.message.style.display = "flex";
	this.message.style.alignItems = "center";
	this.message.style.justifyContent = "center";
	this.message.style.alignText = "center";
	this.message.style.display = "none";
	this.message.innerText = "message";
	this.element.appendChild(this.message);

	this.image = document.createElement("img");
	this.image.src = "editor/files/loading.gif";
	this.element.appendChild(this.image);
}

LoadingScreen.prototype = Object.create(Element.prototype);

LoadingScreen.prototype.show = function(message)
{
	this.visible = true;
	this.message.innerText = message;
	this.updateInterface();
}

LoadingScreen.prototype.hide = function()
{
	this.visible = false;
	this.updateInterface();
}

LoadingScreen.prototype.updateInterface = function()
{
	this.element.style.display = this.visible ? "block" : "none";
};
