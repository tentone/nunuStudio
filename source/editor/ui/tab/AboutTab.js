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

	//Version info
	this.name = new Text(this.element);
	this.name.element.style.top = "30%";
	this.name.element.style.left = "25%";
	this.name.element.style.width = "50%";
	this.name.setTextSize(30);
	this.name.setText(Nunu.NAME + " " + Nunu.VERSION);

	//Build info
	this.timestamp = new Text(this.element);
	this.timestamp.element.style.top = "50%";
	this.timestamp.element.style.left = "25%";
	this.timestamp.element.style.width = "50%";
	this.timestamp.setTextSize(20);
	this.timestamp.setText("Build " + Nunu.TIMESTAMP);

	//ThreeJS version
	this.threejs = new Text(this.element);
	this.threejs.element.style.top = "60%";
	this.threejs.element.style.left = "25%";
	this.threejs.element.style.width = "50%";
	this.threejs.setTextSize(15);
	this.threejs.setText("THREEJS R" + THREE.REVISION);

	//Codemirror version
	this.codemirror = new Text(this.element);
	this.codemirror.element.style.top = "70%";
	this.codemirror.element.style.left = "25%";
	this.codemirror.element.style.width = "50%";
	this.codemirror.setTextSize(15);
	this.codemirror.setText("CodeMirror V" + CodeMirror.version);

	//CannonJS version
	this.cannon = new Text(this.element),
	this.cannon.element.style.top = "80%";
	this.cannon.element.style.left = "25%";
	this.cannon.element.style.width = "50%";
	this.cannon.setTextSize(15);
	this.cannon.setText("CannonJS V" + CANNON.version);

	//NWJS version
	if(Nunu.runningOnDesktop())
	{
		this.nwjs = new Text(this.element);
		this.nwjs.element.style.top = "90%";
		this.nwjs.element.style.left = "25%";
		this.nwjs.element.style.width = "50%";
		this.nwjs.setTextSize(15);
		this.nwjs.setText("NWJS V" + process.versions['node-webkit']);
	}
}

AboutTab.prototype = Object.create(TabElement.prototype);

//Update interface
AboutTab.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		//Element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}

}
