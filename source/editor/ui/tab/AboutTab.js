"use strict";

function AboutTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "About", "editor/files/icons/misc/about.png");

	this.element.style.backgroundColor = Editor.theme.bar_color;

	//Logo
	this.logo = new ImageBox(this.element);
	this.logo.setImage("editor/files/logo.png");
	this.logo.size.set(390, 65);

	//Version info
	this.name = new Text(this.element);
	this.name.size.set(400, 0);
	this.name.setTextSize(30);
	this.name.setText(Nunu.NAME + " " + Nunu.VERSION);

	//Build info
	this.timestamp = new Text(this.element);
	this.timestamp.size.set(400, 0);
	this.timestamp.setTextSize(20);
	this.timestamp.setText("Build " + Nunu.TIMESTAMP);

	//ThreeJS version
	this.threejs = new Text(this.element);
	this.threejs.size.set(400, 0);
	this.threejs.setTextSize(15);
	this.threejs.setText("THREEJS R" + THREE.REVISION);

	//NWJS version
	this.nwjs = new Text(this.element);
	this.nwjs.size.set(400, 0);
	this.nwjs.setTextSize(15);
	if(Editor.gui !== undefined)
	{
		this.nwjs.setText("NWJS V" + process.versions['node-webkit']);
	}

	//Codemirror version
	this.codemirror = new Text(this.element);
	this.codemirror.size.set(400, 0);
	this.codemirror.setTextSize(15);
	this.codemirror.setText("CodeMirror V" + CodeMirror.version);

	//CannonJS version
	this.cannon = new Text(this.element),
	this.cannon.size.set(400, 0);
	this.cannon.setTextSize(15);
	this.cannon.setText("CannonJS V" + CANNON.version);

	//Build info
	this.builton = new Text(this.element);
	this.builton.setText("Built on");
	this.builton.size.set(400, 0);
	this.builton.setTextSize(20);

	//Made with
	this.madewith = new ImageBox(this.element);
	this.madewith.setImage("editor/files/logo/madewith.png");
	this.madewith.size.set(540, 60);
	this.madewith.position.set(0, 0);
}

AboutTab.prototype = Object.create(TabElement.prototype);

//Activate
AboutTab.prototype.activate = function()
{
	Editor.setState(Editor.STATE_IDLE);
}

//Update division Size
AboutTab.prototype.updateInterface = function()
{
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
	
	//About elements
	this.logo.visible = this.visible;
	this.logo.position.set((this.size.x-this.logo.size.x)/2, (this.size.y*0.5-this.logo.size.y)/2);
	this.logo.updateInterface();

	this.name.visible = this.visible;
	this.name.position.set((this.size.x-this.name.size.x)/2, this.logo.position.y + 80);
	this.name.updateInterface();

	this.timestamp.visible = this.visible;
	this.timestamp.position.set((this.size.x-this.timestamp.size.x)/2, this.name.position.y + 30);
	this.timestamp.updateInterface();

	this.threejs.visible = this.visible;
	this.threejs.position.set((this.size.x-this.threejs.size.x)/2, this.timestamp.position.y + 20);
	this.threejs.updateInterface();

	this.nwjs.visible = this.visible;
	this.nwjs.position.set((this.size.x-this.nwjs.size.x)/2, this.threejs.position.y + 20);
	this.nwjs.updateInterface();

	this.codemirror.visible = this.visible;
	this.codemirror.position.set((this.size.x-this.codemirror.size.x)/2, this.nwjs.position.y + 20);
	this.codemirror.updateInterface();

	this.cannon.visible = this.visible;
	this.cannon.position.set((this.size.x-this.cannon.size.x)/2, this.codemirror.position.y + 20);
	this.cannon.updateInterface();

	this.builton.visible = this.visible;
	this.builton.position.set((this.size.x-this.builton.size.x)/2, this.size.y - 90);
	this.builton.updateInterface();

	this.madewith.visible = this.visible;
	this.madewith.position.set((this.size.x-this.madewith.size.x)/2, this.size.y - 75);
	this.madewith.updateInterface();

	//Update base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
