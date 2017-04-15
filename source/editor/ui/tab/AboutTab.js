"use strict";

function AboutTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "About", Editor.filePath + "icons/misc/about.png");

	this.element.style.backgroundColor = Editor.theme.barColor;

	//Logo
	this.logo = new ImageBox(this.element);
	this.logo.setImage(Editor.filePath + "logo.png");
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

	//NWJS version
	if(Nunu.runningOnDesktop())
	{
		this.nwjs = new Text(this.element);
		this.nwjs.size.set(400, 0);
		this.nwjs.setTextSize(15);
		this.nwjs.setText("NWJS V" + process.versions['node-webkit']);
	}

	//Build info
	this.builton = new Text(this.element);
	this.builton.setText("Built on");
	this.builton.size.set(400, 0);
	this.builton.setTextSize(20);

	//Made with
	this.madewith = new ImageBox(this.element);
	this.madewith.setImage(Editor.filePath + "logo/madewith.png");
	this.madewith.size.set(540, 60);
	this.madewith.position.set(0, 0);
}

AboutTab.prototype = Object.create(TabElement.prototype);

//Update division Size
AboutTab.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		this.logo.position.set((this.size.x-this.logo.size.x)/2, (this.size.y*0.5-this.logo.size.y)/2);
		this.logo.updateInterface();

		this.name.position.set((this.size.x-this.name.size.x)/2, this.logo.position.y + 80);
		this.name.updateInterface();

		this.timestamp.position.set((this.size.x-this.timestamp.size.x)/2, this.name.position.y + 30);
		this.timestamp.updateInterface();

		this.threejs.position.set((this.size.x-this.threejs.size.x)/2, this.timestamp.position.y + 20);
		this.threejs.updateInterface();

		this.codemirror.position.set((this.size.x-this.codemirror.size.x)/2, this.threejs.position.y + 20);
		this.codemirror.updateInterface();

		this.cannon.position.set((this.size.x-this.cannon.size.x)/2, this.codemirror.position.y + 20);
		this.cannon.updateInterface();

		if(this.nwjs !== undefined)
		{
			this.nwjs.position.set((this.size.x-this.nwjs.size.x)/2, this.cannon.position.y + 20);
			this.nwjs.updateInterface();
		}

		this.builton.position.set((this.size.x-this.builton.size.x)/2, this.size.y - 90);
		this.builton.updateInterface();

		this.madewith.position.set((this.size.x-this.madewith.size.x)/2, this.size.y - 75);
		this.madewith.updateInterface();

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
