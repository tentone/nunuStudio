function SettingsTab(parent)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}
	
	//ID
	var id = "settings" + SettingsTab.id;
	SettingsTab.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

	//Prevent Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Options tab container
	this.tab = new TabGroup(this.element);
	this.tab.options_size.set(200, 30);
	this.tab.element.className = "bar";
	this.tab.mode = TabGroup.LEFT;
	this.tab.updateInterface();

	//General
	this.general = this.tab.addOption("General", "editor/files/icons/misc/tool.png", false);

	this.general_form = new Form(this.general.division.element);
	this.general_form.position.set(5, 5);
	this.general_form.spacing.set(10, 8);
	this.general_form.addText("General Settings");
	this.general_form.nextRow();
	this.general_form.addText("Theme");
	this.general_form.nextRow();
	this.general_form.addText("Renderer Settings");
	this.general_form.nextRow();
	this.general_form.addText("Antialiasing");
	this.general_form.nextRow();
	this.general_form.addText("Show wireframe");
	this.general_form.nextRow();

	//Code 
	this.code = this.tab.addOption("Code", "editor/files/icons/script/script.png", false);
	
	//About
	this.about = this.tab.addOption("About", "editor/files/icons/misc/about.png", false);
	this.about.attachComponent(new AboutTab(this.about.division.element));
	this.about.updateInterface();
	
	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//SettingsTab counter
SettingsTab.id = 0;

//Functions Prototype
SettingsTab.prototype.update = update;
SettingsTab.prototype.updateInterface = updateInterface;
SettingsTab.prototype.destroy = destroy;
SettingsTab.prototype.activate = activate;
SettingsTab.prototype.updateMetadata = updateMetadata;

//Update container object data
function updateMetadata(container){}

//Activate
function activate()
{
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update SettingsTab
function update(){}

//Update division Size
function updateInterface()
{
	//Fit parent
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update forms
	this.general_form.visible = this.visible;
	this.general_form.updateInterface();
	
	//Update tab
	this.tab.visible = this.visible;
	this.tab.size.copy(this.size);
	this.tab.updateInterface();

	//Update base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
