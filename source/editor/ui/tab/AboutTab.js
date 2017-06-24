"use strict";

function AboutTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "About", Editor.filePath + "icons/misc/about.png");

	this.element.style.backgroundColor = Editor.theme.barColor;

	//Logo
	this.logo = document.createElement("img");
	this.logo.style.position = "absolute";
	this.logo.style.pointerEvents = "none";
	this.logo.style.top = "5%";
	this.logo.style.left = "25%";
	this.logo.style.width = "50%";
	this.logo.style.height = "20%";
	this.logo.style.objectFit = "contain";
	this.logo.src = Editor.filePath + "logo.png";
	this.element.appendChild(this.logo);

	//Version
	this.name = new Text(this.element);
	this.name.element.style.top = "30%";
	this.name.element.style.left = "0%";
	this.name.element.style.width = "100%";
	this.name.setTextSize(25);
	this.name.setAlignment(Text.CENTER);
	this.name.setText(Nunu.NAME + " " + Nunu.VERSION + "<br/>Build " + Nunu.TIMESTAMP);

	//Libraries
	var libs = "three.js R" + THREE.REVISION;
	libs += "<br/>CodeMirror V" + CodeMirror.version;
	libs += "<br/>CannonJS V" + CANNON.version;
	libs += "<br/>TernJS V" + tern.version;

	if(Nunu.runningOnDesktop())
	{
		libs += "<br/>NWJS V" + process.versions['node-webkit'];
	}

	this.libs = new Text(this.element);
	this.libs.element.style.top = "50%";
	this.libs.element.style.left = "0%";
	this.libs.element.style.width = "100%";
	this.libs.setAlignment(Text.CENTER);
	this.libs.setTextSize(20);
	this.libs.setText(libs);
}

AboutTab.prototype = Object.create(TabElement.prototype);

//Update interface
AboutTab.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
