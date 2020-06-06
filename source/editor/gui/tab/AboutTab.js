"use strict";

function AboutTab(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.about, Global.FILE_PATH + "icons/misc/about.png");

	this.element.style.backgroundColor = Editor.theme.barColor;

	// Logo
	this.logo = document.createElement("img");
	this.logo.style.position = "absolute";
	this.logo.style.pointerEvents = "none";
	this.logo.style.top = "5%";
	this.logo.style.left = "25%";
	this.logo.style.width = "50%";
	this.logo.style.height = "20%";
	this.logo.style.objectFit = "contain";
	this.logo.src = Global.FILE_PATH + "logo.png";
	this.element.appendChild(this.logo);

	// Version
	this.name = new Text(this);
	this.name.element.style.top = "30%";
	this.name.element.style.left = "0%";
	this.name.element.style.width = "100%";
	this.name.setTextSize(25);
	this.name.setAlignment(Text.CENTER);
	this.name.setText(Nunu.NAME + " " + Nunu.VERSION + "Build " + Nunu.TIMESTAMP);

	// Libraries
	var libs = [];
	libs.push("three.js R" + THREE.REVISION);
	libs.push("CodeMirror V" + CodeMirror.version);
	libs.push("CannonJS V" + CANNON.version);
	libs.push("TernJS V" + tern.version);
	if(Nunu.runningOnDesktop())
	{
		libs.push("NWJS V" + process.versions['node-webkit']);
	}

	var top = 50;

	for(var i = 0; i < libs.length; i++)
	{
		var text = new Text(this);
		text.element.style.top = top + "%";
		text.element.style.left = "0%";
		text.element.style.width = "100%";
		text.setAlignment(Text.CENTER);
		text.setTextSize(20);
		text.setText(libs[i]);

		top += 6;
	}
}

AboutTab.prototype = Object.create(TabComponent.prototype);
